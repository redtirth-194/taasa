process.env.NODE_ENV = 'test';
import http from 'http';
import { Duplex } from 'stream';
import app from './src/index.js';
import prisma from './src/prisma/client.js';

class MockSocket extends Duplex {
  constructor() {
    super();
    this.remoteAddress = '127.0.0.1';
    this.remotePort = 12345;
    this.encrypted = false;
  }
  _read() {}
  _write(chunk, encoding, callback) {
    callback();
  }
  destroy() {
    this.emit('close');
  }
}

function makeRequest(app, { method = 'GET', url = '/', body = null, headers = {} }) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : '';
    const socket = new MockSocket();
    const req = new http.IncomingMessage(socket);

    req.method = method.toUpperCase();
    req.url = url;
    req.headers = {
      'content-type': 'application/json',
      'content-length': String(Buffer.byteLength(bodyStr)),
      ...headers
    };

    const res = new http.ServerResponse(req);
    res.assignSocket(socket);

    let resBody = '';
    const origWrite = res.write.bind(res);
    const origEnd = res.end.bind(res);

    res.write = (chunk, encoding, callback) => {
      if (chunk) resBody += chunk.toString();
      return origWrite(chunk, encoding, callback);
    };

    res.end = (chunk, encoding, callback) => {
      if (chunk) resBody += chunk.toString();
      origEnd(chunk, encoding, callback);

      let parsed = resBody;
      try {
        parsed = JSON.parse(resBody);
      } catch (e) {
        // keep string
      }

      resolve({
        status: res.statusCode,
        headers: res.getHeaders(),
        data: parsed
      });
    };

    try {
      app(req, res);
      if (bodyStr) {
        req.push(bodyStr);
      }
      req.push(null);
    } catch (err) {
      reject(err);
    }
  });
}

async function runTests() {
  console.log('🧪 Starting Taasha In-Memory API Integration Test Suite...\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name} ->`, err.message);
      failed++;
    }
  }

  // 1. Health check
  await test('GET /api/health', async () => {
    const res = await makeRequest(app, { method: 'GET', url: '/api/health' });
    if (res.status !== 200 || res.data.status !== 'healthy') {
      throw new Error(`Expected healthy, got ${JSON.stringify(res.data)}`);
    }
  });

  // 2. Products list
  let firstProdId;
  await test('GET /api/products (All)', async () => {
    const res = await makeRequest(app, { method: 'GET', url: '/api/products' });
    if (!res.data.success || !Array.isArray(res.data.data) || res.data.count === 0) {
      throw new Error(`Expected products list, got count=${res.data?.count}`);
    }
    firstProdId = res.data.data[0].id;
  });

  // 3. Products category filter
  await test('GET /api/products?category=Sarees', async () => {
    const res = await makeRequest(app, { method: 'GET', url: '/api/products?category=Sarees' });
    if (!res.data.success || res.data.count === 0) {
      throw new Error(`Expected sarees, got count=${res.data?.count}`);
    }
    const nonSaree = res.data.data.find(p => p.category !== 'Sarees');
    if (nonSaree) throw new Error(`Found non-saree: ${nonSaree.title}`);
  });

  // 3b. Categories API
  await test('GET /api/categories', async () => {
    const res = await makeRequest(app, { method: 'GET', url: '/api/categories' });
    if (!res.data.success || !Array.isArray(res.data.data) || res.data.data.length < 6) {
      throw new Error(`Expected >= 6 categories, got ${res.data?.data?.length}`);
    }
    const kurtiCat = res.data.data.find(c => c.name === 'Kurtis');
    if (!kurtiCat || !Array.isArray(kurtiCat.subtypes) || kurtiCat.subtypes.length === 0) {
      throw new Error('Expected Kurtis category with subtypes array');
    }
  });

  // 3c. Products subcategory filter
  await test('GET /api/products?subcategory=Short', async () => {
    const res = await makeRequest(app, { method: 'GET', url: '/api/products?subcategory=Short' });
    if (!res.data.success || res.data.count === 0) {
      throw new Error(`Expected products with subcategory=Short, got count=${res.data?.count}`);
    }
    const invalid = res.data.data.find(p => !p.subcategory?.includes('Short'));
    if (invalid) throw new Error(`Found non-short item: ${invalid.title} (subcat: ${invalid.subcategory})`);
  });

  // 4. Products single by ID
  await test('GET /api/products/:id', async () => {
    const res = await makeRequest(app, { method: 'GET', url: `/api/products/${firstProdId}` });
    if (!res.data.success || !res.data.data || res.data.data.id !== firstProdId) {
      throw new Error(`Expected product ${firstProdId}, got ${JSON.stringify(res.data)}`);
    }
    if (!Array.isArray(res.data.data.variants)) {
      throw new Error('Expected variants array in product details');
    }
  });

  // 5. Cart validate promo code - Percentage (RANI20)
  await test('POST /api/cart/validate (RANI20)', async () => {
    const res = await makeRequest(app, {
      method: 'POST',
      url: '/api/cart/validate',
      body: { code: 'RANI20', subtotal: 10000 }
    });
    if (!res.data.success || res.data.data.discountAmount !== 2000) {
      throw new Error(`Expected 2000 discount, got ${JSON.stringify(res.data)}`);
    }
  });

  // 6. Cart validate promo code - Fixed (UTSAV50)
  await test('POST /api/cart/validate (UTSAV50)', async () => {
    const res = await makeRequest(app, {
      method: 'POST',
      url: '/api/cart/validate',
      body: { code: 'UTSAV50', subtotal: 20000 }
    });
    if (!res.data.success || res.data.data.discountAmount !== 4000) {
      throw new Error(`Expected 4000 discount, got ${JSON.stringify(res.data)}`);
    }
  });

  // 7. Cart validate promo code - Below minOrder
  await test('POST /api/cart/validate (UTSAV50 below min order)', async () => {
    const res = await makeRequest(app, {
      method: 'POST',
      url: '/api/cart/validate',
      body: { code: 'UTSAV50', subtotal: 10000 }
    });
    if (res.status !== 400 || res.data.success) {
      throw new Error(`Expected 400 rejection, got ${JSON.stringify(res.data)}`);
    }
  });

  // 8. Checkout create-intent
  await test('POST /api/cart/create-intent', async () => {
    const res = await makeRequest(app, {
      method: 'POST',
      url: '/api/cart/create-intent',
      body: {
        items: [{ id: firstProdId, price: 18500, quantity: 1 }],
        promoCode: 'RANI20'
      }
    });
    if (!res.data.success || res.data.data.discount !== 3700 || res.data.data.total !== 14800) {
      throw new Error(`Unexpected order summary: ${JSON.stringify(res.data)}`);
    }
  });

  // 9. Orders list
  await test('GET /api/orders', async () => {
    const res = await makeRequest(app, { method: 'GET', url: '/api/orders' });
    if (!res.data.success || !Array.isArray(res.data.data) || res.data.count === 0) {
      throw new Error(`Expected orders list, got ${JSON.stringify(res.data)}`);
    }
  });

  // 10. Admin KPIs & Stats
  await test('GET /api/admin/stats', async () => {
    const res = await makeRequest(app, { method: 'GET', url: '/api/admin/stats' });
    if (!res.data.success || !res.data.data.kpis || typeof res.data.data.kpis.totalRevenue !== 'number') {
      throw new Error(`Expected stats KPIs, got ${JSON.stringify(res.data)}`);
    }
  });

  // 11. UGC Feed
  await test('GET /api/ugc', async () => {
    const res = await makeRequest(app, { method: 'GET', url: '/api/ugc' });
    if (!res.data.success || !Array.isArray(res.data.data) || res.data.count === 0) {
      throw new Error(`Expected approved UGC posts, got ${JSON.stringify(res.data)}`);
    }
  });

  // 12. Reviews for product
  await test('GET /api/reviews/:productId', async () => {
    const res = await makeRequest(app, { method: 'GET', url: `/api/reviews/${firstProdId}` });
    if (!res.data.success || !Array.isArray(res.data.data)) {
      throw new Error(`Expected reviews array, got ${JSON.stringify(res.data)}`);
    }
  });

  // 13. Newsletter subscribe & manage
  let subscriberId = null;
  await test('POST /api/newsletter/subscribe', async () => {
    const testEmail = `test_${Date.now()}@test.com`;
    const res = await makeRequest(app, {
      method: 'POST',
      url: '/api/newsletter/subscribe',
      body: { email: testEmail, source: 'TEST_SUITE' }
    });
    if (res.status !== 201 || !res.data.success || res.data.code !== 'MUSE15') {
      throw new Error(`Expected subscription success, got ${JSON.stringify(res.data)}`);
    }

    // Verify subscriber is listed in admin GET /api/newsletter
    const listRes = await makeRequest(app, { method: 'GET', url: '/api/newsletter' });
    if (!listRes.data.success || !Array.isArray(listRes.data.data)) {
      throw new Error('Failed to fetch subscribers');
    }
    const createdSub = listRes.data.data.find(s => s.email === testEmail);
    if (createdSub) subscriberId = createdSub.id;
  });

  await test('DELETE /api/newsletter/:id', async () => {
    if (!subscriberId) return;
    const res = await makeRequest(app, {
      method: 'DELETE',
      url: `/api/newsletter/${subscriberId}`
    });
    if (!res.data.success) {
      throw new Error(`Expected successful delete, got ${JSON.stringify(res.data)}`);
    }
  });

  // 14. Payment Gateway: Create Intent
  let intentId = null;
  await test('POST /api/payment/create-intent', async () => {
    const res = await makeRequest(app, {
      method: 'POST',
      url: '/api/payment/create-intent',
      body: {
        items: [{ price: 18500, quantity: 1 }],
        promoCode: 'UTSAV50',
        customerEmail: 'muse@taasha.com'
      }
    });
    if (!res.data.success || !res.data.paymentIntentId || res.data.amount !== 14500) {
      throw new Error(`Expected payment intent created with discount applied, got ${JSON.stringify(res.data)}`);
    }
    intentId = res.data.paymentIntentId;
  });

  // 15. Payment Gateway: Verify Payment
  await test('POST /api/payment/verify-payment', async () => {
    const res = await makeRequest(app, {
      method: 'POST',
      url: '/api/payment/verify-payment',
      body: {
        paymentIntentId: intentId || 'pi_tsh_test_verification',
        paymentMethod: 'CARD'
      }
    });
    if (!res.data.success || !res.data.verified || res.data.status !== 'SUCCEEDED') {
      throw new Error(`Expected verified payment, got ${JSON.stringify(res.data)}`);
    }
  });

  // 16. Payment Gateway: Generate UPI QR Intent
  await test('POST /api/payment/create-upi-qr', async () => {
    const res = await makeRequest(app, {
      method: 'POST',
      url: '/api/payment/create-upi-qr',
      body: { amount: 18500, orderNumber: 'TSH-9999' }
    });
    if (!res.data.success || !res.data.data.upiUri || !res.data.data.vpa || res.data.data.inrAmount !== 18500) {
      throw new Error(`Expected upi uri and vpa, got ${JSON.stringify(res.data)}`);
    }
  });

  // 17. Create Order with Payment Tracking
  await test('POST /api/orders (with payment metadata)', async () => {
    const res = await makeRequest(app, {
      method: 'POST',
      url: '/api/orders',
      body: {
        customerName: 'Queen Radhika',
        customerEmail: 'radhika@royaltaasha.com',
        customerPhone: '+91 98200 99999',
        shippingAddress: {
          street: 'Palace Suite 101',
          city: 'Jaipur',
          state: 'Rajasthan',
          zip: '302001',
          country: 'India'
        },
        items: [{
          productId: firstProdId,
          title: 'Royal Banarasi Silk Saree',
          price: 18500,
          quantity: 1
        }],
        subtotal: 18500,
        discount: 4000,
        shippingFee: 0,
        total: 14500,
        paymentMethod: 'CARD',
        paymentStatus: 'PAID',
        paymentId: intentId,
        promoCode: 'UTSAV50',
        giftPackaging: true
      }
    });

    if (res.status !== 201 || !res.data.success || res.data.data.paymentStatus !== 'PAID' || res.data.data.paymentId !== intentId) {
      throw new Error(`Expected order with paymentStatus=PAID and paymentId, got ${JSON.stringify(res.data)}`);
    }
  });

  console.log(`\n========================================`);
  console.log(`🏁 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  await prisma.$disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
