import { Router } from 'express';
import prisma from '../prisma/client.js';

const router = Router();

// GET /api/admin/stats - Dynamic Dashboard KPIs & Analytics
router.get('/stats', async (req, res, next) => {
  try {
    const [
      totalProducts,
      orders,
      totalPromos,
      totalSubscribers,
      totalUgc,
      lowStockVariants
    ] = await Promise.all([
      prisma.product.count(),
      prisma.order.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.promoCode.count(),
      prisma.newsletterSubscriber.count(),
      prisma.uGCPost.count(),
      prisma.productVariant.findMany({
        where: { inventory: { lte: 5 } },
        include: { product: true }
      })
    ]);

    // Financial Metrics
    const totalRevenue = orders
      .filter(o => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + o.total, 0);

    const averageOrderValue = orders.length > 0 
      ? totalRevenue / orders.length 
      : 0;

    // Order status breakdown
    const orderStatuses = {
      PENDING: orders.filter(o => o.status === 'PENDING').length,
      PROCESSING: orders.filter(o => o.status === 'PROCESSING').length,
      SHIPPED: orders.filter(o => o.status === 'SHIPPED').length,
      DELIVERED: orders.filter(o => o.status === 'DELIVERED').length,
      CANCELLED: orders.filter(o => o.status === 'CANCELLED').length
    };

    // Low stock alerts
    const lowStockAlerts = lowStockVariants.map(v => ({
      productId: v.productId,
      productTitle: v.product?.title || 'Unknown Product',
      size: v.size,
      color: v.colorName,
      inventory: v.inventory,
      sku: v.sku
    }));

    // Recent 5 orders parsed
    const recentOrders = orders.slice(0, 5).map(o => {
      let items = [];
      try { items = JSON.parse(o.items); } catch { items = []; }
      return {
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        customerEmail: o.customerEmail,
        total: o.total,
        status: o.status,
        date: o.createdAt,
        itemSummary: items.map(i => `${i.title} (${i.size || 'S'})`).join(', ') || '1 item'
      };
    });

    res.json({
      success: true,
      data: {
        kpis: {
          totalRevenue: parseFloat(totalRevenue.toFixed(2)),
          totalOrders: orders.length,
          totalProducts,
          totalCustomers: new Set(orders.map(o => o.customerEmail)).size + totalSubscribers,
          averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
          totalPromos,
          totalUgc
        },
        orderStatuses,
        lowStockAlerts,
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
