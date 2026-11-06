import { Router } from 'express';
import prisma from '../prisma/client.js';

const router = Router();

// GET /api/reviews/:productId
router.get('/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { productId: parseInt(productId, 10) },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/reviews
router.post('/', async (req, res, next) => {
  try {
    const {
      productId,
      authorName,
      authorEmail,
      rating = 5,
      title,
      body
    } = req.body;

    if (!productId || !authorName || !body) {
      return res.status(400).json({
        success: false,
        message: 'productId, authorName, and review body are required.'
      });
    }

    const newReview = await prisma.review.create({
      data: {
        productId: parseInt(productId, 10),
        authorName,
        authorEmail,
        rating: Math.min(5, Math.max(1, parseInt(rating, 10))),
        title: title || 'Loved this piece! ✨',
        body,
        verifiedBuyer: true
      }
    });

    // Recalculate average rating for product
    const allReviews = await prisma.review.findMany({
      where: { productId: parseInt(productId, 10) }
    });

    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.product.update({
      where: { id: parseInt(productId, 10) },
      data: {
        ratingsAvg: parseFloat(avg.toFixed(1)),
        reviewsCount: allReviews.length
      }
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully! Thank you for sharing your feedback 💖',
      data: newReview
    });
  } catch (error) {
    next(error);
  }
});

export default router;
