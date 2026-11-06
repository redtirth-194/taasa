import { Router } from 'express';
import prisma from '../prisma/client.js';

const router = Router();

// GET /api/ugc - Get approved UGC posts for storefront
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;

    const where = { status: 'APPROVED' };
    if (category && category !== 'all') {
      if (category === 'reels') {
        where.isReel = true;
      } else {
        where.category = category;
      }
    }

    const posts = await prisma.uGCPost.findMany({
      where,
      orderBy: { id: 'desc' },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            basePrice: true,
            salePrice: true,
            image: true,
            fabric: true,
            ratingsAvg: true,
            reviewsCount: true,
            variants: {
              select: {
                size: true,
                colorName: true,
                colorHex: true
              }
            }
          }
        }
      }
    });

    // Format for frontend
    const formatted = posts.map(post => {
      const price = post.product ? (post.product.salePrice || post.product.basePrice) : 68.00;
      const originalPrice = post.product?.salePrice ? post.product.basePrice : null;
      const sizes = post.product?.variants?.length 
        ? [...new Set(post.product.variants.map(v => v.size))]
        : ['XS', 'S', 'M', 'L', 'XL'];
      const colors = post.product?.variants?.length
        ? post.product.variants.filter((v, i, arr) => arr.findIndex(x => x.colorName === v.colorName) === i).map(v => ({ name: v.colorName, hex: v.colorHex }))
        : [{ name: 'Blush Rose', hex: '#ff8fab' }];

      return {
        id: post.id,
        creator: post.creator,
        creatorName: post.creatorName,
        avatar: post.avatar,
        location: post.location,
        verified: post.verified,
        caption: post.caption,
        likes: post.likes,
        aspectClass: post.aspectClass,
        image: post.image,
        isReel: post.isReel,
        reelDuration: post.reelDuration,
        category: post.category,
        badge: post.badge,
        status: post.status,
        product: post.product ? {
          id: post.product.id,
          title: post.product.title,
          price,
          originalPrice,
          rating: post.product.ratingsAvg,
          reviewsCount: post.product.reviewsCount,
          fabric: post.product.fabric,
          image: post.product.image,
          sizes,
          colors
        } : {
          id: 1,
          title: 'Silk Rosette Corset Top',
          price: 68.00,
          originalPrice: 85.00,
          rating: 4.9,
          reviewsCount: 142,
          fabric: '100% Mulberry Silk Charmeuse',
          image: post.image,
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          colors: [{ name: 'Blush Rose', hex: '#ff8fab' }]
        }
      };
    });

    res.json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/ugc/all - Admin get all UGC posts (including pending)
router.get('/all', async (req, res, next) => {
  try {
    const posts = await prisma.uGCPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: { product: true }
    });

    res.json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/ugc - Community submit look
router.post('/', async (req, res, next) => {
  try {
    const {
      creator,
      creatorName,
      caption,
      image,
      productId,
      category = 'coquette',
      location = 'Community Muse Submission'
    } = req.body;

    if (!creator || !caption) {
      return res.status(400).json({
        success: false,
        message: 'Creator handle and caption are required.'
      });
    }

    const cleanHandle = creator.startsWith('@') ? creator : `@${creator}`;

    const newPost = await prisma.uGCPost.create({
      data: {
        creator: cleanHandle,
        creatorName: creatorName || cleanHandle.replace('@', ''),
        avatar: image || 'https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg?auto=compress&cs=tinysrgb&w=150',
        location,
        verified: true,
        caption,
        likes: 1,
        aspectClass: 'aspect-tall',
        image: image || 'https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg?auto=compress&cs=tinysrgb&w=800',
        isReel: false,
        category,
        badge: '✨ Fresh Drop',
        status: 'APPROVED',
        productId: productId ? parseInt(productId, 10) : 1
      },
      include: {
        product: {
          include: {
            variants: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Look submitted and published to feed! 💖 $20 voucher unlocked.',
      voucherCode: 'MUSE20',
      data: newPost
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/ugc/:id/like - Toggle like count
router.post('/:id/like', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { increment = true } = req.body;
    const postId = parseInt(id, 10);

    const updated = await prisma.uGCPost.update({
      where: { id: postId },
      data: {
        likes: increment ? { increment: 1 } : { decrement: 1 }
      }
    });

    res.json({
      success: true,
      likes: updated.likes
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/ugc/:id/status - Admin update status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const postId = parseInt(id, 10);

    const updated = await prisma.uGCPost.update({
      where: { id: postId },
      data: { status }
    });

    res.json({
      success: true,
      message: `Post status updated to ${status}`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/ugc/:id - Admin delete UGC post
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const postId = parseInt(id, 10);

    await prisma.uGCPost.delete({
      where: { id: postId }
    });

    res.json({
      success: true,
      message: `UGC post ${id} deleted successfully.`
    });
  } catch (error) {
    next(error);
  }
});

export default router;
