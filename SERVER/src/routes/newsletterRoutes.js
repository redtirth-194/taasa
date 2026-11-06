import { Router } from 'express';
import prisma from '../prisma/client.js';

const router = Router();

// POST /api/newsletter/subscribe
router.post('/subscribe', async (req, res, next) => {
  try {
    const { email, source = 'FOOTER_FORM' } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: cleanEmail }
    });

    if (existing) {
      return res.json({
        success: true,
        message: 'Welcome back, Muse! Your VIP discount code is MUSE15 ✨',
        code: 'MUSE15'
      });
    }

    await prisma.newsletterSubscriber.create({
      data: {
        email: cleanEmail,
        source,
        discountCodeSent: 'MUSE15'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Welcome to the #TaasaMuses VIP circle! 🌸 Use code MUSE15 for 15% off.',
      code: 'MUSE15'
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/newsletter - Admin get all subscribers
router.get('/', async (req, res, next) => {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      count: subscribers.length,
      data: subscribers
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/newsletter/:id - Admin delete subscriber
router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.newsletterSubscriber.delete({
      where: { id }
    });
    res.json({
      success: true,
      message: 'Subscriber removed successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
