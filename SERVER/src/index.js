import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import prisma from './prisma/client.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import promoRoutes from './routes/promoRoutes.js';
import ugcRoutes from './routes/ugcRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cmsDistPath = path.resolve(__dirname, '../../CMS/dist');

const app = express();
const PORT = process.env.PORT || 5000;

// Flexible CORS for Local + Live Hosting (Vercel, Netlify, Render, Railway)
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.netlify.app') ||
      origin.endsWith('.onrender.com') ||
      origin.endsWith('.railway.app') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Serve static frontend build if it exists (for single-server fullstack deployment)
if (fs.existsSync(cmsDistPath)) {
  app.use(express.static(cmsDistPath));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// API Health Check
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'healthy',
      brand: 'Taasa Luxury E-Commerce API',
      version: '1.0.0',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message
    });
  }
});

// Mount Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/promos', promoRoutes);
app.use('/api/ugc', ugcRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/categories', categoryRoutes);

// Frontend SPA Client Route Fallback OR API Welcome Page
if (fs.existsSync(path.join(cmsDistPath, 'index.html'))) {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(cmsDistPath, 'index.html'));
  });
} else {
  // Root Welcome Endpoint (when running as standalone API)
  app.get('/', (req, res) => {
    res.json({
      brand: 'Taasa. 🌸',
      tagline: 'Hyper-Aesthetic Female Fashion E-Commerce REST API',
      status: 'online',
      endpoints: {
        health: '/api/health',
        products: '/api/products',
        orders: '/api/orders',
        cart: '/api/cart/validate',
        promos: '/api/promos',
        ugc: '/api/ugc',
        reviews: '/api/reviews',
        newsletter: '/api/newsletter',
        adminStats: '/api/admin/stats',
        payment: '/api/payment/create-intent'
      }
    });
  });
}

// 404 Route Handler for unmatched API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, _next) => {
  console.error('❌ Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
});

// Start Server only if invoked directly (not when imported in test suites)
const isDirectEntry = process.argv[1] && (
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]) ||
  process.argv[1].endsWith('index.js')
);

if (isDirectEntry && !process.env.TEST_MODE) {
  app.listen(PORT, () => {
    console.log(`🌸 Taasa REST API Server running on http://localhost:${PORT}`);
    console.log(`✨ Health check: http://localhost:${PORT}/api/health`);
    console.log(`🛍️ Products endpoint: http://localhost:${PORT}/api/products`);
  });
}

export default app;
