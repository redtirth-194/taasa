import { Router } from 'express';
import prisma from '../prisma/client.js';

const router = Router();

// GET /api/orders - Admin list orders
router.get('/', async (req, res, next) => {
  try {
    const { status, search, limit = 50 } = req.query;

    const where = {};
    if (status && status !== 'all') {
      where.status = { equals: status.toUpperCase() };
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { orderNumber: { contains: q } },
        { customerName: { contains: q } },
        { customerEmail: { contains: q } }
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit, 10)
    });

    // Parse JSON items & shippingAddress for clean client consumption
    const parsedOrders = orders.map(order => {
      let items = [];
      let address = {};
      try { items = JSON.parse(order.items); } catch { items = order.items; }
      try { address = JSON.parse(order.shippingAddress); } catch { address = order.shippingAddress; }

      return {
        ...order,
        items,
        shippingAddress: address
      };
    });

    res.json({
      success: true,
      count: parsedOrders.length,
      data: parsedOrders
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/:id - Single order
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const isNum = !isNaN(Number(id));

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber: id },
          ...(isNum ? [{ id: Number(id) }] : [])
        ]
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    let items = [];
    let address = {};
    try { items = JSON.parse(order.items); } catch { items = order.items; }
    try { address = JSON.parse(order.shippingAddress); } catch { address = order.shippingAddress; }

    res.json({
      success: true,
      data: {
        ...order,
        items,
        shippingAddress: address
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/orders - Storefront create order
router.post('/', async (req, res, next) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      discount = 0,
      shippingFee = 0,
      total,
      paymentMethod = 'CARD',
      paymentStatus = 'PAID',
      paymentId,
      promoCode,
      giftPackaging = false,
      notes
    } = req.body;

    if (!customerEmail || !items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Order creation requires customerEmail and at least one item.'
      });
    }

    // Generate unique order number (e.g. TSH-8945)
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `TSH-${randomNum}`;

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customerName || 'Valued Muse',
        customerEmail,
        customerPhone,
        shippingAddress: typeof shippingAddress === 'object' ? JSON.stringify(shippingAddress) : (shippingAddress || '{}'),
        items: typeof items === 'object' ? JSON.stringify(items) : items,
        subtotal: parseFloat(subtotal || 0),
        discount: parseFloat(discount || 0),
        shippingFee: parseFloat(shippingFee || 0),
        total: parseFloat(total || subtotal || 0),
        status: 'PROCESSING',
        paymentMethod,
        paymentStatus,
        paymentId: paymentId || null,
        promoCode,
        giftPackaging: Boolean(giftPackaging),
        notes
      }
    });

    // If a promo code was used, increment usage count
    if (promoCode) {
      try {
        await prisma.promoCode.update({
          where: { code: promoCode.trim().toUpperCase() },
          data: { usageCount: { increment: 1 } }
        });
      } catch {
        // promo code might not be in DB, ignore
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! 💖 Your luxury package is being prepared.',
      data: {
        orderNumber: newOrder.orderNumber,
        id: newOrder.id,
        total: newOrder.total,
        status: newOrder.status,
        paymentStatus: newOrder.paymentStatus,
        paymentId: newOrder.paymentId,
        customerEmail: newOrder.customerEmail,
        createdAt: newOrder.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/orders/:id/status - Admin update status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const orderId = parseInt(id, 10);

    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!status || !validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: status.toUpperCase() }
    });

    res.json({
      success: true,
      message: `Order status updated to ${updated.status}`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/orders/:id - Admin delete order
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const orderId = parseInt(id, 10);

    await prisma.order.delete({
      where: { id: orderId }
    });

    res.json({
      success: true,
      message: `Order ${id} deleted successfully.`
    });
  } catch (error) {
    next(error);
  }
});

export default router;
