import { Router } from 'express';
import prisma from '../prisma/client.js';

const router = Router();

// GET /api/categories - List all categories with product count
router.get('/', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' }
    });

    // Also get product count per category dynamically
    const products = await prisma.product.findMany({
      select: { category: true }
    });

    const categoriesWithCount = categories.map(cat => {
      const count = products.filter(p => 
        (p.category || '').toLowerCase().includes(cat.name.toLowerCase()) ||
        cat.name.toLowerCase().includes((p.category || '').toLowerCase())
      ).length;

      let parsedSubtypes = [];
      try {
        parsedSubtypes = cat.subtypes ? JSON.parse(cat.subtypes) : [];
      } catch {
        parsedSubtypes = cat.subtypes ? cat.subtypes.split(',').map(s => s.trim()) : [];
      }

      return {
        ...cat,
        subtypes: parsedSubtypes,
        productCount: count
      };
    });

    res.json({
      success: true,
      data: categoriesWithCount
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/categories/:slug - Get single category by slug or id
router.get('/:idOrSlug', async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const isNum = !isNaN(Number(idOrSlug));

    const category = await prisma.category.findFirst({
      where: isNum 
        ? { OR: [{ id: Number(idOrSlug) }, { slug: idOrSlug }] }
        : { slug: idOrSlug }
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    let parsedSubtypes = [];
    try {
      parsedSubtypes = category.subtypes ? JSON.parse(category.subtypes) : [];
    } catch {
      parsedSubtypes = category.subtypes ? category.subtypes.split(',').map(s => s.trim()) : [];
    }

    res.json({
      success: true,
      data: {
        ...category,
        subtypes: parsedSubtypes
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/categories - Create new category
router.post('/', async (req, res, next) => {
  try {
    const { name, slug, description, subtypes, image, badge, sortOrder } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const catSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const subtypesStr = Array.isArray(subtypes) ? JSON.stringify(subtypes) : (subtypes || null);

    const category = await prisma.category.create({
      data: {
        name,
        slug: catSlug,
        description: description || null,
        subtypes: subtypesStr,
        image: image || null,
        badge: badge || null,
        sortOrder: sortOrder || 0
      }
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/categories/:id - Update category
router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { name, slug, description, subtypes, image, badge, sortOrder } = req.body;

    const data = {};
    if (name !== undefined) data.name = name;
    if (slug !== undefined) data.slug = slug;
    if (description !== undefined) data.description = description;
    if (subtypes !== undefined) {
      data.subtypes = Array.isArray(subtypes) ? JSON.stringify(subtypes) : subtypes;
    }
    if (image !== undefined) data.image = image;
    if (badge !== undefined) data.badge = badge;
    if (sortOrder !== undefined) data.sortOrder = sortOrder;

    const updated = await prisma.category.update({
      where: { id },
      data
    });

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/categories/:id - Delete category
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.category.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

export default router;

