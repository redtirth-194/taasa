import { Router } from 'express';
import prisma from '../prisma/client.js';

const router = Router();

// GET /api/promos - Admin list promo codes
router.get('/', async (req, res, next) => {
  try {
    const promos = await prisma.promoCode.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      count: promos.length,
      data: promos
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/promos - Admin create promo code
router.post('/', async (req, res, next) => {
  try {
    const {
      code,
      discountType = 'PERCENTAGE',
      value,
      minOrder = 0,
      active = true,
      expiryDays
    } = req.body;

    if (!code || value === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Code and value are required.'
      });
    }

    const cleanCode = code.trim().toUpperCase();

    // Check duplicate
    const existing = await prisma.promoCode.findUnique({
      where: { code: cleanCode }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Promo code ${cleanCode} already exists.`
      });
    }

    let expiryDate = null;
    if (expiryDays) {
      const d = new Date();
      d.setDate(d.getDate() + parseInt(expiryDays, 10));
      expiryDate = d;
    }

    const newPromo = await prisma.promoCode.create({
      data: {
        code: cleanCode,
        discountType,
        value: parseFloat(value),
        minOrder: parseFloat(minOrder || 0),
        active: Boolean(active),
        expiryDate
      }
    });

    res.status(201).json({
      success: true,
      message: `Promo code ${newPromo.code} created! ✨`,
      data: newPromo
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/promos/:id/toggle - Toggle active status
router.patch('/:id/toggle', async (req, res, next) => {
  try {
    const { id } = req.params;
    const promoId = parseInt(id, 10);

    const promo = await prisma.promoCode.findUnique({
      where: { id: promoId }
    });

    if (!promo) {
      return res.status(404).json({
        success: false,
        message: 'Promo code not found'
      });
    }

    const updated = await prisma.promoCode.update({
      where: { id: promoId },
      data: { active: !promo.active }
    });

    res.json({
      success: true,
      message: `Promo code ${updated.code} is now ${updated.active ? 'active' : 'inactive'}`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/promos/:id - Admin delete promo code
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const promoId = parseInt(id, 10);

    await prisma.promoCode.delete({
      where: { id: promoId }
    });

    res.json({
      success: true,
      message: 'Promo code deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
