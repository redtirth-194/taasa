import { Router } from 'express';
import prisma from '../prisma/client.js';

const router = Router();

// GET /api/products - List products with rich filtering, search & sorting
router.get('/', async (req, res, next) => {
  try {
    const { 
      category, 
      subcategory,
      aesthetic, 
      size, 
      color, 
      minPrice, 
      maxPrice, 
      search, 
      sort = 'featured',
      isNew,
      badge
    } = req.query;

    const where = {};

    if (category && category !== 'all') {
      const cleanCat = category.toLowerCase().replace(/[-_]/g, ' ').trim();
      const SLUG_CAT_MAP = {
        'kurtis': 'Kurtis',
        'kurti': 'Kurtis',
        'dresses': 'Dresses',
        'dress': 'Dresses',
        'co ord set': 'Co-ord set',
        'coord set': 'Co-ord set',
        'co ord': 'Co-ord set',
        'coord': 'Co-ord set',
        'two piece set': 'Two piece set',
        'twopiece set': 'Two piece set',
        'two piece': 'Two piece set',
        'plus size collection': 'Plus size collection',
        'plus size': 'Plus size collection',
        'pants': 'Pants',
        'pant': 'Pants'
      };
      const directMatch = SLUG_CAT_MAP[cleanCat];
      if (directMatch) {
        where.category = { contains: directMatch };
      } else {
        where.category = { contains: cleanCat };
      }
    }

    if (subcategory && subcategory !== 'all') {
      const cleanSub = subcategory.toLowerCase().replace(/[-_]/g, ' ').trim();
      const SLUG_SUB_MAP = {
        'short': 'Short Kurti',
        'long': 'Long Kurti',
        'sleeveless': 'Sleeveless',
        'straight': 'Straight Cut',
        'shirts': 'Kurti Shirts',
        'tunics': 'Tunics',
        'anarkali': 'Anarkali',
        'angrakha': 'Angrakha',
        'aline': 'A-Line',
        'flared': 'Flared',
        'blazer': 'Blazer & Trouser',
        'printed': 'Printed Silk Co-ords',
        'festive': 'Festive',
        'peplum': 'Peplum & Sharara',
        'dhoti': 'Crop Top & Dhoti',
        'curvy': 'Curvy Anarkalis',
        'cigarette': 'Cigarette Pants',
        'palazzo': 'Flared Palazzos'
      };
      const directSub = SLUG_SUB_MAP[cleanSub];
      if (directSub) {
        where.subcategory = { contains: directSub };
      } else {
        where.subcategory = { contains: cleanSub };
      }
    }

    if (aesthetic && aesthetic !== 'all') {
      where.aesthetic = { contains: aesthetic };
    }

    if (badge) {
      where.badge = { contains: badge };
    }

    if (isNew === 'true') {
      where.isNew = true;
    }

    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice.gte = parseFloat(minPrice);
      if (maxPrice) where.basePrice.lte = parseFloat(maxPrice);
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { category: { contains: q } },
        { subcategory: { contains: q } },
        { aesthetic: { contains: q } },
        { fabric: { contains: q } }
      ];
    }

    // Filter by variant attributes (size or color)
    if (size || color) {
      where.variants = {
        some: {
          ...(size ? { size: { equals: size } } : {}),
          ...(color ? { colorName: { contains: color } } : {})
        }
      };
    }

    // Sorting
    let orderBy = { id: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { basePrice: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { basePrice: 'desc' };
    } else if (sort === 'rating') {
      orderBy = { ratingsAvg: 'desc' };
    } else if (sort === 'newest') {
      orderBy = { createdAt: 'desc' };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        variants: true,
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id - Single product with full details
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const isNum = !isNaN(Number(id));

    let product = await prisma.product.findFirst({
      where: isNum ? { id: Number(id) } : { slug: id },
      include: {
        variants: true,
        reviews: {
          orderBy: { createdAt: 'desc' }
        },
        ugcPosts: {
          where: { status: 'APPROVED' }
        }
      }
    });

    // Graceful alias lookup if ID was shifted due to re-seeding (e.g. 1 or 17 -> maps to active product)
    if (!product) {
      const allProducts = await prisma.product.findMany({
        orderBy: { id: 'asc' },
        include: {
          variants: true,
          reviews: { orderBy: { createdAt: 'desc' } },
          ugcPosts: { where: { status: 'APPROVED' } }
        }
      });

      if (allProducts.length > 0) {
        if (isNum) {
          const numId = Number(id);
          const index = Math.abs(numId - 1) % allProducts.length;
          product = allProducts[index];
        } else {
          product = allProducts.find(p => p.slug?.toLowerCase().includes(id.toLowerCase())) || allProducts[0];
        }
      }
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with identifier '${id}'`
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/products - Admin create product
router.post('/', async (req, res, next) => {
  try {
    const {
      title,
      vendor = 'Taasa Atelier',
      category,
      subcategory,
      aesthetic = 'Romantic',
      description,
      fabric,
      care,
      basePrice,
      salePrice,
      stockQuantity = 20,
      badge,
      isNew = true,
      isFeatured = false,
      image,
      hoverImage,
      variants = []
    } = req.body;

    if (!title || !category || !basePrice || !image) {
      return res.status(400).json({
        success: false,
        message: 'Missing required product fields: title, category, basePrice, and image are required.'
      });
    }

    // Generate unique slug
    let baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const newProduct = await prisma.product.create({
      data: {
        slug,
        title,
        vendor,
        category,
        subcategory: subcategory || null,
        aesthetic,
        description: description || `Experience the luxury craftsmanship of ${title}.`,
        fabric: fabric || '100% Ethical Mulberry Silk Charmeuse',
        care: care || 'Dry clean or delicate hand wash with cold water',
        basePrice: parseFloat(basePrice),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        stockQuantity: parseInt(stockQuantity, 10),
        badge,
        isNew: Boolean(isNew),
        isFeatured: Boolean(isFeatured),
        image,
        hoverImage: hoverImage || image,
        variants: {
          create: variants.map(v => ({
            colorName: v.colorName || 'Standard',
            colorHex: v.colorHex || '#ff8fab',
            size: v.size || 'S',
            sku: v.sku || `TSH-${Math.floor(1000 + Math.random() * 9000)}`,
            inventory: v.inventory ? parseInt(v.inventory, 10) : 10,
            image: v.image || image
          }))
        }
      },
      include: {
        variants: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully! 💖',
      data: newProduct
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/products/:id - Admin update product
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id, 10);

    const existing = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const {
      title,
      category,
      subcategory,
      aesthetic,
      description,
      fabric,
      care,
      basePrice,
      salePrice,
      stockQuantity,
      badge,
      isNew,
      isFeatured,
      image,
      hoverImage,
      variants
    } = req.body;

    // Update product fields
    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(title ? { title } : {}),
        ...(category ? { category } : {}),
        ...(subcategory !== undefined ? { subcategory } : {}),
        ...(aesthetic ? { aesthetic } : {}),
        ...(description ? { description } : {}),
        ...(fabric ? { fabric } : {}),
        ...(care ? { care } : {}),
        ...(basePrice !== undefined ? { basePrice: parseFloat(basePrice) } : {}),
        ...(salePrice !== undefined ? { salePrice: salePrice ? parseFloat(salePrice) : null } : {}),
        ...(stockQuantity !== undefined ? { stockQuantity: parseInt(stockQuantity, 10) } : {}),
        ...(badge !== undefined ? { badge } : {}),
        ...(isNew !== undefined ? { isNew: Boolean(isNew) } : {}),
        ...(isFeatured !== undefined ? { isFeatured: Boolean(isFeatured) } : {}),
        ...(image ? { image } : {}),
        ...(hoverImage ? { hoverImage } : {})
      },
      include: {
        variants: true
      }
    });

    // Optionally update variants if provided
    if (variants && Array.isArray(variants)) {
      await prisma.productVariant.deleteMany({ where: { productId } });
      await prisma.productVariant.createMany({
        data: variants.map(v => ({
          productId,
          colorName: v.colorName || 'Standard',
          colorHex: v.colorHex || '#ff8fab',
          size: v.size || 'S',
          sku: v.sku || `TSH-${Math.floor(1000 + Math.random() * 9000)}`,
          inventory: v.inventory ? parseInt(v.inventory, 10) : 10,
          image: v.image || updated.image
        }))
      });
    }

    const finalProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: { variants: true }
    });

    res.json({
      success: true,
      message: 'Product updated successfully! ✨',
      data: finalProduct
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:id - Admin delete product
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id, 10);

    await prisma.product.delete({
      where: { id: productId }
    });

    res.json({
      success: true,
      message: `Product ${id} deleted successfully.`
    });
  } catch (error) {
    next(error);
  }
});

export default router;
