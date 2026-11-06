const rawEnvUrl = import.meta.env.VITE_API_URL;
const API_BASE_URL = (rawEnvUrl && rawEnvUrl.trim()) ? rawEnvUrl.trim() : '/api';

/**
 * Universal API Helper
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status} ${response.statusText}`);
    }
    return data;
  } catch (error) {
    console.warn(`[Taasa API] Request to ${endpoint} failed:`, error.message);
    throw error;
  }
}

// -------------------------------------------------------------
// Products API
// -------------------------------------------------------------
export const getProducts = async (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, val);
    }
  });
  const queryString = query.toString() ? `?${query.toString()}` : '';
  return request(`/products${queryString}`);
};

export const getProductById = async (id) => {
  return request(`/products/${id}`);
};

export const createProduct = async (productData) => {
  return request('/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  });
};

export const updateProduct = async (id, productData) => {
  return request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData)
  });
};

export const deleteProduct = async (id) => {
  return request(`/products/${id}`, {
    method: 'DELETE'
  });
};

// -------------------------------------------------------------
// Categories API
// -------------------------------------------------------------
export const getCategories = async () => {
  return request('/categories');
};

export const createCategory = async (categoryData) => {
  return request('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData)
  });
};

export const updateCategory = async (id, categoryData) => {
  return request(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData)
  });
};

export const deleteCategory = async (id) => {
  return request(`/categories/${id}`, {
    method: 'DELETE'
  });
};

// -------------------------------------------------------------
// Orders API
// -------------------------------------------------------------
export const getOrders = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return request(`/orders${query ? `?${query}` : ''}`);
};

export const getOrderById = async (id) => {
  return request(`/orders/${id}`);
};

export const createOrder = async (orderData) => {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
};

export const updateOrderStatus = async (id, status) => {
  return request(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
};

export const deleteOrder = async (id) => {
  return request(`/orders/${id}`, {
    method: 'DELETE'
  });
};

// -------------------------------------------------------------
// Promo Codes API
// -------------------------------------------------------------
export const getPromos = async () => {
  return request('/promos');
};

export const createPromo = async (promoData) => {
  return request('/promos', {
    method: 'POST',
    body: JSON.stringify(promoData)
  });
};

export const togglePromo = async (id) => {
  return request(`/promos/${id}/toggle`, {
    method: 'PATCH'
  });
};

export const deletePromo = async (id) => {
  return request(`/promos/${id}`, {
    method: 'DELETE'
  });
};

export const validatePromoCode = async (code, subtotal) => {
  return request('/cart/validate', {
    method: 'POST',
    body: JSON.stringify({ code, subtotal })
  });
};

// -------------------------------------------------------------
// UGC Social Feed API
// -------------------------------------------------------------
export const getUgcPosts = async (category) => {
  const query = category && category !== 'all' ? `?category=${category}` : '';
  return request(`/ugc${query}`);
};

export const getAllUgcPosts = async () => {
  return request('/ugc/all');
};

export const submitUgcLook = async (postData) => {
  return request('/ugc', {
    method: 'POST',
    body: JSON.stringify(postData)
  });
};

export const likeUgcPost = async (id, increment = true) => {
  return request(`/ugc/${id}/like`, {
    method: 'POST',
    body: JSON.stringify({ increment })
  });
};

export const updateUgcStatus = async (id, status) => {
  return request(`/ugc/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
};

export const deleteUgcPost = async (id) => {
  return request(`/ugc/${id}`, {
    method: 'DELETE'
  });
};

// -------------------------------------------------------------
// Newsletter API
// -------------------------------------------------------------
export const subscribeNewsletter = async (email, source = 'FOOTER_FORM') => {
  return request('/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email, source })
  });
};

export const getNewsletterSubscribers = async () => {
  return request('/newsletter');
};

export const deleteNewsletterSubscriber = async (id) => {
  return request(`/newsletter/${id}`, {
    method: 'DELETE'
  });
};

// -------------------------------------------------------------
// Reviews API
// -------------------------------------------------------------
export const getReviews = async (productId) => {
  return request(`/reviews/${productId}`);
};

export const submitReview = async (reviewData) => {
  return request('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData)
  });
};

// -------------------------------------------------------------
// Admin Analytics & KPIs
// -------------------------------------------------------------
export const getAdminStats = async () => {
  return request('/admin/stats');
};

// -------------------------------------------------------------
// Payment Gateway API (Stripe + UPI + Netbanking + Simulator)
// -------------------------------------------------------------
export const createPaymentIntent = async (paymentData) => {
  return request('/payment/create-intent', {
    method: 'POST',
    body: JSON.stringify(paymentData)
  });
};

export const verifyPayment = async (verificationData) => {
  return request('/payment/verify-payment', {
    method: 'POST',
    body: JSON.stringify(verificationData)
  });
};

export const createUpiQr = async (upiData) => {
  return request('/payment/create-upi-qr', {
    method: 'POST',
    body: JSON.stringify(upiData)
  });
};
