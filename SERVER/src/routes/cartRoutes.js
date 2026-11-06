import { Router } from 'express';
import prisma from '../prisma/client.js';

const router = Router();

// POST /api/cart/validate - Validate promo code
router.post('/validate', async (req, res, next) => {
  try {
    const { code, subtotal = 0 } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Promo code is required.'
      });
    }

    const cleanCode = code.trim().toUpperCase();

    // Check DB for promo code
    const promo = await prisma.promoCode.findUnique({
      where: { code: cleanCode }
    });

    if (!promo || !promo.active) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or expired promo code. Try MUSE20 or CUTE20!'
      });
    }

    if (promo.expiryDate && new Date(promo.expiryDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'This promo code has expired.'
      });
    }

    const cartSubtotal = parseFloat(subtotal);
    if (promo.minOrder > 0 && cartSubtotal < promo.minOrder) {
      return res.status(400).json({
        success: false,
        message: `This code requires a minimum order of ₹${promo.minOrder.toLocaleString('en-IN')}.`
      });
    }

    let discountAmount = 0;
    if (promo.discountType === 'PERCENTAGE') {
      discountAmount = cartSubtotal * promo.value;
    } else {
      discountAmount = Math.min(cartSubtotal, promo.value);
    }

    res.json({
      success: true,
      message: `${promo.discountType === 'PERCENTAGE' ? `${(promo.value * 100).toFixed(0)}% OFF` : `₹${promo.value.toLocaleString('en-IN')} OFF`} applied! 💖`,
      data: {
        code: promo.code,
        discountType: promo.discountType,
        rate: promo.discountType === 'PERCENTAGE' ? promo.value : null,
        value: promo.value,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        label: promo.discountType === 'PERCENTAGE' ? `${(promo.value * 100).toFixed(0)}% OFF (${promo.code})` : `₹${promo.value.toLocaleString('en-IN')} OFF (${promo.code})`
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/checkout/create-intent - Prepare payment intent / calculate order summary
router.post('/create-intent', async (req, res, next) => {
  try {
    const { items = [], promoCode } = req.body;

    if (!items.length) {
      return res.status(400).json({
        success: false,
        message: 'At least one item is required in cart.'
      });
    }

    const FREE_SHIPPING_THRESHOLD = 4999.00;
    const subtotal = items.reduce((acc, item) => acc + (parseFloat(item.price) * parseInt(item.quantity || 1, 10)), 0);

    let discount = 0;
    let promoDetails = null;

    if (promoCode) {
      const cleanCode = promoCode.trim().toUpperCase();
      const promo = await prisma.promoCode.findUnique({
        where: { code: cleanCode }
      });

      if (promo && promo.active) {
        if (promo.discountType === 'PERCENTAGE') {
          discount = subtotal * promo.value;
        } else {
          discount = Math.min(subtotal, promo.value);
        }
        promoDetails = {
          code: promo.code,
          label: promo.discountType === 'PERCENTAGE' ? `${(promo.value * 100).toFixed(0)}% OFF` : `₹${promo.value.toLocaleString('en-IN')} OFF`
        };
      }
    }

    const shippingFee = (subtotal - discount) >= FREE_SHIPPING_THRESHOLD ? 0 : 299.00;
    const total = Math.max(0, subtotal - discount + shippingFee);

    res.json({
      success: true,
      data: {
        subtotal: parseFloat(subtotal.toFixed(2)),
        discount: parseFloat(discount.toFixed(2)),
        shippingFee: parseFloat(shippingFee.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        freeShippingAchieved: shippingFee === 0,
        promoDetails,
        clientSecret: `mock_pi_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
