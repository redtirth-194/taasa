import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES_DATA = [
  {
    name: 'Kurtis',
    slug: 'kurtis',
    description: 'Bespoke handloom and slub cotton kurtis across short, long, sleeveless, straight cut, shirts, and tunics.',
    subtypes: JSON.stringify(['Short Kurti', 'Long Kurti', 'Sleeveless', 'Straight Cut', 'Kurti Shirts', 'Tunics']),
    image: '/images/products/taasa-client-26.jpeg',
    badge: '🌸 Everyday & Festive Luxury',
    sortOrder: 1
  },
  {
    name: 'Dresses',
    slug: 'dresses',
    description: 'Sweeping festive dresses including grand Anarkalis, regal Angrakhas, structured A-line, and long flared tunics.',
    subtypes: JSON.stringify(['Anarkali', 'Angrakha', 'A-Line', 'Long Flared Tunics']),
    image: '/images/products/taasa-client-01.jpeg',
    badge: '👑 Royal Flare & Poise',
    sortOrder: 2
  },
  {
    name: 'Co-ord set',
    slug: 'co-ord-set',
    description: 'Chic modern Indian two-piece blazers, embroidered peplums, and trouser sets crafted in fluid cotton and linen.',
    subtypes: JSON.stringify(['Blazer & Trouser', 'Printed Silk Co-ords', 'Festive Sets']),
    image: '/images/products/taasa-client-08.jpeg',
    badge: '✨ Trending Runway',
    sortOrder: 3
  },
  {
    name: 'Two piece set',
    slug: 'two-piece-set',
    description: 'Effortless luxury pairs featuring peplum tops, crop blouses, pleated tunics, and draped trousers.',
    subtypes: JSON.stringify(['Peplum & Sharara', 'Crop Top & Dhoti', 'Two Piece Kurti Set']),
    image: '/images/products/taasa-client-22.jpeg',
    badge: '💃 Sangeet & Soiree',
    sortOrder: 4
  },
  {
    name: 'Plus size collection',
    slug: 'plus-size-collection',
    description: 'Opulent couture crafted to celebrate curves with flattering cuts up to size 5XL.',
    subtypes: JSON.stringify(['Curvy Anarkalis', 'Plus Kaftans', 'Flowy Tunics']),
    image: '/images/products/taasa-client-03.jpeg',
    badge: '💖 Size Inclusive (XS to 5XL)',
    sortOrder: 5
  },
  {
    name: 'Pants',
    slug: 'pants',
    description: 'Artisanal bottoms including tailored cotton cigarette pants, flared palazzos, and comfort trousers.',
    subtypes: JSON.stringify(['Cigarette Pants', 'Flared Palazzos', 'Trousers']),
    image: '/images/products/taasa-client-40.jpeg',
    badge: '💎 Atelier Tailoring',
    sortOrder: 6
  }
];

const PRODUCTS_DATA = [
  // ==========================================
  // 1. KURTIS
  // ==========================================
  {
    slug: 'noorani-ivory-threadwork-short-kurti',
    title: 'Noorani Ivory Threadwork Short Kurti',
    vendor: 'Taasa Atelier',
    category: 'Kurtis',
    subcategory: 'Short Kurti',
    aesthetic: 'Pastel Poetry',
    description: 'Crafted in breathable textured slub cotton with intricate monochrome black thread embroidery along the notch collar, front placket, and three-quarter sleeves. Features comfortable side slits and relaxed comfort fit.',
    fabric: '100% Breathable Textured Slub Cotton with Hand Embroidered Yoke',
    care: 'Gentle machine wash cold or dry clean. Warm iron on reverse side.',
    basePrice: 3299.00,
    salePrice: 2499.00,
    stockQuantity: 35,
    ratingsAvg: 4.9,
    reviewsCount: 88,
    badge: '🌸 Short Kurti Bestseller',
    isNew: true,
    isFeatured: true,
    image: '/images/products/taasa-client-26.jpeg',
    hoverImage: '/images/products/taasa-client-25.jpeg',
    variants: [
      { colorName: 'Ivory Cream', colorHex: '#fdfbf7', size: 'S', sku: 'TSH-KRT-IVR-S', inventory: 10 },
      { colorName: 'Ivory Cream', colorHex: '#fdfbf7', size: 'M', sku: 'TSH-KRT-IVR-M', inventory: 14 },
      { colorName: 'Ivory Cream', colorHex: '#fdfbf7', size: 'L', sku: 'TSH-KRT-IVR-L', inventory: 8 },
      { colorName: 'Ivory Cream', colorHex: '#fdfbf7', size: 'XL', sku: 'TSH-KRT-IVR-XL', inventory: 5 }
    ],
    reviews: [
      { authorName: 'Priya Sharma', rating: 5, title: 'Super comfortable and chic!', body: 'Wore this with white trousers to work and got so many compliments. Fabric feels amazing in hot weather.', verifiedBuyer: true },
      { authorName: 'Divya Nair', rating: 5, title: 'Exquisite embroidery detail', body: 'The black threadwork on the neckline is so clean and neat. Truly boutique quality.', verifiedBuyer: true }
    ]
  },
  {
    slug: 'parijaat-sage-green-floral-short-kurti',
    title: 'Parijaat Sage Green Floral Short Kurti',
    vendor: 'Taasa Atelier',
    category: 'Kurtis',
    subcategory: 'Short Kurti',
    aesthetic: 'Pastel Poetry',
    description: 'Subtle sage and mint green short kurti adorned with soft botanical floral prints, buttoned placket, and breezy everyday silhouette. Designed for effortless brunches and daily styling.',
    fabric: 'Pure Combed Cotton with Breathable Weave',
    care: 'Hand wash with mild detergent or machine wash gentle.',
    basePrice: 3199.00,
    salePrice: 2399.00,
    stockQuantity: 40,
    ratingsAvg: 4.8,
    reviewsCount: 64,
    badge: '🌿 Everyday Floral',
    isNew: true,
    isFeatured: true,
    image: '/images/products/taasa-client-43.jpeg',
    hoverImage: '/images/products/taasa-client-44.jpeg',
    variants: [
      { colorName: 'Sage Green', colorHex: '#9bb0a5', size: 'S', sku: 'TSH-KRT-SGE-S', inventory: 12 },
      { colorName: 'Sage Green', colorHex: '#9bb0a5', size: 'M', sku: 'TSH-KRT-SGE-M', inventory: 15 },
      { colorName: 'Sage Green', colorHex: '#9bb0a5', size: 'L', sku: 'TSH-KRT-SGE-L', inventory: 10 }
    ],
    reviews: [
      { authorName: 'Megha Singhal', rating: 5, title: 'Lovely pastel green', body: 'The floral print is subtle and classy. Looks lovely paired with beige cigarette pants.', verifiedBuyer: true }
    ]
  },
  {
    slug: 'rajkumari-wine-silk-straight-kurti-suit',
    title: 'Rajkumari Wine Pure Silk Straight Cut Kurti Suit',
    vendor: 'Taasa Atelier',
    category: 'Kurtis',
    subcategory: 'Long Kurti',
    aesthetic: 'Heritage Royalty',
    description: 'Lustrous deep purple mulberry silk long straight kurti embellished with intricate antique gold zari borders on daman, neckline, and sleeves. Accompanied by a matching sheer dupatta.',
    fabric: 'Pure Mulberry Silk with Antique Gold Zari Weave & Mulmul Lining',
    care: 'Strictly dry clean only. Store wrapped in unbleached cotton muslin.',
    basePrice: 7999.00,
    salePrice: 6199.00,
    stockQuantity: 22,
    ratingsAvg: 5.0,
    reviewsCount: 95,
    badge: '👑 Royal Silk Edit',
    isNew: true,
    isFeatured: true,
    image: '/images/products/taasa-client-31.jpeg',
    hoverImage: '/images/products/taasa-client-33.jpeg',
    variants: [
      { colorName: 'Imperial Wine', colorHex: '#4a154b', size: 'S', sku: 'TSH-KRT-WIN-S', inventory: 6 },
      { colorName: 'Imperial Wine', colorHex: '#4a154b', size: 'M', sku: 'TSH-KRT-WIN-M', inventory: 8 },
      { colorName: 'Imperial Wine', colorHex: '#4a154b', size: 'L', sku: 'TSH-KRT-WIN-L', inventory: 6 },
      { colorName: 'Imperial Wine', colorHex: '#4a154b', size: 'XL', sku: 'TSH-KRT-WIN-XL', inventory: 4 }
    ],
    reviews: [
      { authorName: 'Radhika Deshmukh', rating: 5, title: 'Looks regal and feels opulent', body: 'Wore it for Diwali pooja. The gold zari work against the deep purple silk looks so magnificent!', verifiedBuyer: true }
    ]
  },
  {
    slug: 'haldi-sunshine-paisley-sleeveless-kurti',
    title: 'Haldi Sunshine Paisley Sleeveless Kurti',
    vendor: 'Taasa Atelier',
    category: 'Kurtis',
    subcategory: 'Sleeveless',
    aesthetic: 'Sangeet Radiance',
    description: 'Vibrant turmeric yellow pure cotton sleeveless kurti featuring artisanal paisley floral handblock prints, pleated bodice, playful shoulder tassel ties, and a flared hemline.',
    fabric: '100% Breathable Cambric Cotton with Natural Dyes',
    care: 'Gentle hand wash cold. Dry in shade.',
    basePrice: 3499.00,
    salePrice: 2699.00,
    stockQuantity: 32,
    ratingsAvg: 4.9,
    reviewsCount: 72,
    badge: '💛 Haldi Essential',
    isNew: true,
    isFeatured: false,
    image: '/images/products/taasa-client-02.jpeg',
    hoverImage: '/images/products/taasa-client-04.jpeg',
    variants: [
      { colorName: 'Haldi Yellow', colorHex: '#f5b041', size: 'S', sku: 'TSH-KRT-HLD-S', inventory: 10 },
      { colorName: 'Haldi Yellow', colorHex: '#f5b041', size: 'M', sku: 'TSH-KRT-HLD-M', inventory: 12 },
      { colorName: 'Haldi Yellow', colorHex: '#f5b041', size: 'L', sku: 'TSH-KRT-HLD-L', inventory: 8 }
    ],
    reviews: [
      { authorName: 'Ananya Mehra', rating: 5, title: 'Breezy and bright', body: 'The shoulder tassels are so cute and playful. Perfect for summer events and mehendi!', verifiedBuyer: true }
    ]
  },
  {
    slug: 'rani-gulabi-colorblock-yoke-kurti',
    title: 'Rani Gulabi Color-Block Yoke Straight Kurti',
    vendor: 'Taasa Atelier',
    category: 'Kurtis',
    subcategory: 'Straight Cut',
    aesthetic: 'Sangeet Radiance',
    description: 'Eye-catching rani pink and magenta straight cut kurti with artisan geometric color-block yoke, gold piped seams, and flattering vertical silhouette.',
    fabric: 'Handloom Cotton Silk Blend with Pure Cotton Lining',
    care: 'Dry clean recommended or gentle hand wash.',
    basePrice: 3699.00,
    salePrice: 2799.00,
    stockQuantity: 28,
    ratingsAvg: 4.8,
    reviewsCount: 45,
    badge: '✨ Straight Cut Pick',
    isNew: true,
    isFeatured: false,
    image: '/images/products/taasa-client-45.jpeg',
    hoverImage: '/images/products/taasa-client-32.jpeg',
    variants: [
      { colorName: 'Rani Gulabi', colorHex: '#c2185b', size: 'S', sku: 'TSH-KRT-RNI-S', inventory: 8 },
      { colorName: 'Rani Gulabi', colorHex: '#c2185b', size: 'M', sku: 'TSH-KRT-RNI-M', inventory: 10 },
      { colorName: 'Rani Gulabi', colorHex: '#c2185b', size: 'L', sku: 'TSH-KRT-RNI-L', inventory: 6 }
    ],
    reviews: [
      { authorName: 'Tanvi Joshi', rating: 5, title: 'Bold festive colors', body: 'The magenta tone is vibrant and cheerful. The yoke detailing is very flattering.', verifiedBuyer: true }
    ]
  },
  {
    slug: 'neelambari-botanical-kurti-shirt',
    title: 'Neelambari Botanical Embroidered Kurti Shirt',
    vendor: 'Taasa Atelier',
    category: 'Kurtis',
    subcategory: 'Kurti Shirts',
    aesthetic: 'Pastel Poetry',
    description: 'Modern tailored kurti shirt in midnight navy cotton with delicate white botanical floral embroidery down the button placket, point collar, and turned cuffs. Perfect for casual business and weekend brunches.',
    fabric: 'Premium 100% Long-Staple Cotton with White Resham Thread Embroidery',
    care: 'Machine wash cold on gentle cycle. Medium iron.',
    basePrice: 3899.00,
    salePrice: 2999.00,
    stockQuantity: 34,
    ratingsAvg: 4.9,
    reviewsCount: 56,
    badge: '🤍 Shirt Kurti Style',
    isNew: true,
    isFeatured: true,
    image: '/images/products/taasa-client-40.jpeg',
    hoverImage: '/images/products/taasa-client-41.jpeg',
    variants: [
      { colorName: 'Midnight Navy', colorHex: '#1b2a47', size: 'S', sku: 'TSH-KRT-NVY-S', inventory: 10 },
      { colorName: 'Midnight Navy', colorHex: '#1b2a47', size: 'M', sku: 'TSH-KRT-NVY-M', inventory: 12 },
      { colorName: 'Midnight Navy', colorHex: '#1b2a47', size: 'L', sku: 'TSH-KRT-NVY-L', inventory: 8 },
      { colorName: 'Midnight Navy', colorHex: '#1b2a47', size: 'XL', sku: 'TSH-KRT-NVY-XL', inventory: 4 }
    ],
    reviews: [
      { authorName: 'Aishwarya Roy', rating: 5, title: 'Smart and elegant fusion', body: 'Pairs seamlessly with white trousers. The collar structure holds its shape cleanly all day.', verifiedBuyer: true }
    ]
  },
  {
    slug: 'kashish-plum-wine-gathered-tunic',
    title: 'Kashish Plum Wine Gathered Button Kurti Tunic',
    vendor: 'Taasa Atelier',
    category: 'Kurtis',
    subcategory: 'Tunics',
    aesthetic: 'Pastel Poetry',
    description: 'Rich wine cotton-linen tunic kurti designed with delicate center pleats, mandarin notch neckline, and soft cuffed sleeves. Pairs effortlessly with white cigarette trousers.',
    fabric: 'Pure Cotton Linen Blend with Natural Wooden Buttons',
    care: 'Gentle hand wash cold or delicate machine wash.',
    basePrice: 2999.00,
    salePrice: 2299.00,
    stockQuantity: 36,
    ratingsAvg: 4.9,
    reviewsCount: 78,
    badge: '🌸 Gathered Tunic',
    isNew: true,
    isFeatured: false,
    image: '/images/products/taasa-client-20.jpeg',
    hoverImage: '/images/products/taasa-client-24.jpeg',
    variants: [
      { colorName: 'Deep Plum Wine', colorHex: '#581845', size: 'S', sku: 'TSH-KRT-PLM-S', inventory: 10 },
      { colorName: 'Deep Plum Wine', colorHex: '#581845', size: 'M', sku: 'TSH-KRT-PLM-M', inventory: 12 },
      { colorName: 'Deep Plum Wine', colorHex: '#581845', size: 'L', sku: 'TSH-KRT-PLM-L', inventory: 10 }
    ],
    reviews: [
      { authorName: 'Shalini Verma', rating: 5, title: 'In love with this plum color!', body: 'Deep rich shade and the gathers give a very flattering silhouette. Fabric is feather light.', verifiedBuyer: true }
    ]
  },
  {
    slug: 'avani-olive-green-gathered-tunic',
    title: 'Avani Olive Green Gathered Peplum Kurti Tunic',
    vendor: 'Taasa Atelier',
    category: 'Kurtis',
    subcategory: 'Tunics',
    aesthetic: 'Heritage Royalty',
    description: 'Fresh lime-olive relaxed kurti tunic with pleated yoke detailing, notched neckline, and wooden button accents. Cut from lightweight breathable slub cotton.',
    fabric: '100% Slub Cotton with Soft Breathable Finish',
    care: 'Gentle hand wash with cold water.',
    basePrice: 2999.00,
    salePrice: 2299.00,
    stockQuantity: 30,
    ratingsAvg: 4.8,
    reviewsCount: 52,
    badge: '🌿 Fresh Olive Edit',
    isNew: true,
    isFeatured: false,
    image: '/images/products/taasa-client-12.jpeg',
    hoverImage: '/images/products/taasa-client-13.jpeg',
    variants: [
      { colorName: 'Olive Lime', colorHex: '#808000', size: 'S', sku: 'TSH-KRT-OLV-S', inventory: 8 },
      { colorName: 'Olive Lime', colorHex: '#808000', size: 'M', sku: 'TSH-KRT-OLV-M', inventory: 12 },
      { colorName: 'Olive Lime', colorHex: '#808000', size: 'L', sku: 'TSH-KRT-OLV-L', inventory: 8 }
    ],
    reviews: [
      { authorName: 'Kavita Chawla', rating: 5, title: 'Comfortable everyday essential', body: 'The olive tone is earthy and versatile. Looks crisp even after washing.', verifiedBuyer: true }
    ]
  },
  {
    slug: 'kasturi-mocha-yoke-embroidered-tunic',
    title: 'Kasturi Mocha Yoke Embroidered Kurti Tunic',
    vendor: 'Taasa Atelier',
    category: 'Kurtis',
    subcategory: 'Tunics',
    aesthetic: 'Heritage Royalty',
    description: 'Earthy coffee brown cotton tunic featuring dense geometric and floral white embroidery on yoke and cuffs with gentle gathered flare and notch neck.',
    fabric: 'Pure Cotton with Fine Hand-Guided Chikankari Inspired Embroidery',
    care: 'Hand wash in cold water or gentle machine wash.',
    basePrice: 3499.00,
    salePrice: 2699.00,
    stockQuantity: 28,
    ratingsAvg: 4.9,
    reviewsCount: 61,
    badge: '☕ Earthy Tones',
    isNew: true,
    isFeatured: false,
    image: '/images/products/taasa-client-28.jpeg',
    hoverImage: '/images/products/taasa-client-29.jpeg',
    variants: [
      { colorName: 'Mocha Brown', colorHex: '#4e3629', size: 'S', sku: 'TSH-KRT-MCH-S', inventory: 8 },
      { colorName: 'Mocha Brown', colorHex: '#4e3629', size: 'M', sku: 'TSH-KRT-MCH-M', inventory: 10 },
      { colorName: 'Mocha Brown', colorHex: '#4e3629', size: 'L', sku: 'TSH-KRT-MCH-L', inventory: 8 }
    ],
    reviews: [
      { authorName: 'Pooja Bhatia', rating: 5, title: 'Subtle and sophisticated', body: 'The white embroidery pops beautifully on the warm mocha base. Extremely comfortable!', verifiedBuyer: true }
    ]
  },

  // ==========================================
  // 2. DRESSES
  // ==========================================
  {
    slug: 'noor-rust-orange-flared-anarkali-dress',
    title: 'Noor Rust Orange Handcrafted Flared Anarkali Dress',
    vendor: 'Taasa Atelier',
    category: 'Dresses',
    subcategory: 'Anarkali',
    aesthetic: 'Heritage Royalty',
    description: 'Tailored in breathable pure festive slub cotton and chanderi silk with intricate zardozi threadwork on neckline and tiered sweeping flare. Ideal for royal celebrations and pujas.',
    fabric: 'Pure Slub Cotton Silk with Fine Gold Thread Zari & Cotton Mulmul Lining',
    care: 'Dry clean recommended to preserve flare and embroidery.',
    basePrice: 6999.00,
    salePrice: 5499.00,
    stockQuantity: 26,
    ratingsAvg: 5.0,
    reviewsCount: 114,
    badge: '👑 Royal Flare Masterpiece',
    isNew: true,
    isFeatured: true,
    image: '/images/products/taasa-client-01.jpeg',
    hoverImage: '/images/products/taasa-client-06.jpeg',
    variants: [
      { colorName: 'Rust Terracotta', colorHex: '#c05c36', size: 'S', sku: 'TSH-DRS-ANK-S', inventory: 6 },
      { colorName: 'Rust Terracotta', colorHex: '#c05c36', size: 'M', sku: 'TSH-DRS-ANK-M', inventory: 10 },
      { colorName: 'Rust Terracotta', colorHex: '#c05c36', size: 'L', sku: 'TSH-DRS-ANK-L', inventory: 6 },
      { colorName: 'Rust Terracotta', colorHex: '#c05c36', size: 'XL', sku: 'TSH-DRS-ANK-XL', inventory: 4 }
    ],
    reviews: [
      { authorName: 'Ananya Mukherjee', rating: 5, title: 'The flare is unbelievable!', body: 'Twirled like a dream at our family Sangeet in Jaipur. The rust orange color looks rich and royal.', verifiedBuyer: true },
      { authorName: 'Ritika Sengupta', rating: 5, title: 'Masterpiece craftsmanship', body: 'Quality of the embroidery is top tier. Worth every rupee.', verifiedBuyer: true }
    ]
  },
  {
    slug: 'neelambari-royal-blue-mirror-anarkali',
    title: 'Neelambari Royal Blue Mirror-Work Anarkali Dress',
    vendor: 'Taasa Atelier',
    category: 'Dresses',
    subcategory: 'Anarkali',
    aesthetic: 'Heritage Royalty',
    description: 'Regal royal blue floor-length anarkali accented with authentic foil mirror embroidery, scalloped borders, and voluminous gathered flare.',
    fabric: 'Pure Viscose Georgette with Real Glass Mirror Work & Silk Lining',
    care: 'Specialist dry clean only to protect delicate mirror work.',
    basePrice: 8499.00,
    salePrice: 6899.00,
    stockQuantity: 20,
    ratingsAvg: 4.9,
    reviewsCount: 79,
    badge: '✨ Royal Blue Edition',
    isNew: true,
    isFeatured: true,
    image: '/images/products/taasa-client-05.jpeg',
    hoverImage: '/images/products/taasa-client-03.jpeg',
    variants: [
      { colorName: 'Royal Blue', colorHex: '#1e3d59', size: 'S', sku: 'TSH-DRS-BLU-S', inventory: 6 },
      { colorName: 'Royal Blue', colorHex: '#1e3d59', size: 'M', sku: 'TSH-DRS-BLU-M', inventory: 8 },
      { colorName: 'Royal Blue', colorHex: '#1e3d59', size: 'L', sku: 'TSH-DRS-BLU-L', inventory: 4 }
    ],
    reviews: [
      { authorName: 'Zoya Qureshi', rating: 5, title: 'Dramatic and gorgeous', body: 'The mirrors sparkle brilliantly under evening banquet lights. Absolute showstopper.', verifiedBuyer: true }
    ]
  },
  {
    slug: 'noorani-midnight-black-mirror-anarkali',
    title: 'Noorani Midnight Black Mirror-Work Flared Anarkali',
    vendor: 'Taasa Atelier',
    category: 'Dresses',
    subcategory: 'Anarkali',
    aesthetic: 'Bridal Opulence',
    description: 'Dramatic full-flared anarkali dress in jet black with hand-embellished mirror work and silver thread embroidery along the hem and yoke.',
    fabric: 'Fine Viscose Silk Georgette with Heavy Mirror Embellishments',
    care: 'Dry clean only.',
    basePrice: 8999.00,
    salePrice: 7299.00,
    stockQuantity: 18,
    ratingsAvg: 5.0,
    reviewsCount: 92,
    badge: '💎 Evening Opulence',
    isNew: true,
    isFeatured: false,
    image: '/images/products/taasa-client-03.jpeg',
    hoverImage: '/images/products/taasa-client-05.jpeg',
    variants: [
      { colorName: 'Midnight Black', colorHex: '#111111', size: 'S', sku: 'TSH-DRS-BLK-S', inventory: 5 },
      { colorName: 'Midnight Black', colorHex: '#111111', size: 'M', sku: 'TSH-DRS-BLK-M', inventory: 8 },
      { colorName: 'Midnight Black', colorHex: '#111111', size: 'L', sku: 'TSH-DRS-BLK-L', inventory: 5 }
    ],
    reviews: [
      { authorName: 'Simran Jolly', rating: 5, title: 'Black magic!', body: 'Black ethnic wear done right. The mirror work is placed so tastefully along the borders.', verifiedBuyer: true }
    ]
  },
  {
    slug: 'indigo-neel-blockprint-angrakha-dress',
    title: 'Indigo Neel Block-Print Flared Angrakha Dress',
    vendor: 'Taasa Atelier',
    category: 'Dresses',
    subcategory: 'Angrakha',
    aesthetic: 'Heritage Royalty',
    description: 'Timeless Angrakha crossover silhouette in authentic indigo handblock dabu print with side tie-up tassel dori and tiered flare.',
    fabric: '100% Bagru Handblock Printed Pure Cotton with Natural Vegetable Indigo Dye',
    care: 'Dry clean for first wash, subsequent gentle cold washes separately.',
    basePrice: 5499.00,
    salePrice: 4199.00,
    stockQuantity: 25,
    ratingsAvg: 4.9,
    reviewsCount: 68,
    badge: '✨ Handblock Angrakha',
    isNew: true,
    isFeatured: true,
    image: '/images/products/taasa-client-17.jpeg',
    hoverImage: '/images/products/taasa-client-15.jpeg',
    variants: [
      { colorName: 'Indigo Dabu Blue', colorHex: '#23395d', size: 'S', sku: 'TSH-DRS-IND-S', inventory: 8 },
      { colorName: 'Indigo Dabu Blue', colorHex: '#23395d', size: 'M', sku: 'TSH-DRS-IND-M', inventory: 10 },
      { colorName: 'Indigo Dabu Blue', colorHex: '#23395d', size: 'L', sku: 'TSH-DRS-IND-L', inventory: 6 }
    ],
    reviews: [
      { authorName: 'Isha Trivedi', rating: 5, title: 'Authentic Indian craft', body: 'The overlapping Angrakha fit hugs the waist gracefully. Real handblock prints give it such unique character.', verifiedBuyer: true }
    ]
  },
  {
    slug: 'kesariya-floral-angrakha-flared-dress',
    title: 'Kesariya Floral Angrakha Flared Dress',
    vendor: 'Taasa Atelier',
    category: 'Dresses',
    subcategory: 'Angrakha',
    aesthetic: 'Sangeet Radiance',
    description: 'Sun-kissed mustard and cream floral print angrakha with delicate side tie-up, flared panels, and comfortable breathable cotton weave.',
    fabric: 'Soft Cambric Cotton with Hand-Blocked Floral Motifs',
    care: 'Gentle hand wash in cold water.',
    basePrice: 5299.00,
    salePrice: 3999.00,
    stockQuantity: 24,
    ratingsAvg: 4.8,
    reviewsCount: 51,
    badge: '🌸 Sunlit Festive',
    isNew: true,
    isFeatured: false,
    image: '/images/products/taasa-client-16.jpeg',
    hoverImage: '/images/products/taasa-client-21.jpeg',
    variants: [
      { colorName: 'Mustard Floral', colorHex: '#e5a93c', size: 'S', sku: 'TSH-DRS-MST-S', inventory: 8 },
      { colorName: 'Mustard Floral', colorHex: '#e5a93c', size: 'M', sku: 'TSH-DRS-MST-M', inventory: 10 },
      { colorName: 'Mustard Floral', colorHex: '#e5a93c', size: 'L', sku: 'TSH-DRS-MST-L', inventory: 6 }
    ],
    reviews: [
      { authorName: 'Rhea Patel', rating: 5, title: 'Warm and cheerful', body: 'Photographs beautifully in daylight outdoors. The flare swishes with every step.', verifiedBuyer: true }
    ]
  },
  {
    slug: 'bagh-e-khaas-floral-booti-aline-dress',
    title: 'Bagh-e-Khaas Floral Booti A-Line Festive Dress',
    vendor: 'Taasa Atelier',
    category: 'Dresses',
    subcategory: 'A-Line',
    aesthetic: 'Sangeet Radiance',
    description: 'Chanderi cotton blend flared A-line dress with rich crimson side panels, floral jaal booti motifs, and embellished tassel neck.',
    fabric: 'Chanderi Cotton Blend with Fine Zari Booti Work',
    care: 'Dry clean recommended.',
    basePrice: 5899.00,
    salePrice: 4499.00,
    stockQuantity: 20,
    ratingsAvg: 4.9,
    reviewsCount: 43,
    badge: '👑 Structured A-Line',
    isNew: true,
    isFeatured: false,
    image: '/images/products/taasa-client-10.jpeg',
    hoverImage: '/images/products/taasa-client-09.jpeg',
    variants: [
      { colorName: 'Crimson Booti', colorHex: '#9c27b0', size: 'S', sku: 'TSH-DRS-ALN-S', inventory: 6 },
      { colorName: 'Crimson Booti', colorHex: '#9c27b0', size: 'M', sku: 'TSH-DRS-ALN-M', inventory: 8 },
      { colorName: 'Crimson Booti', colorHex: '#9c27b0', size: 'L', sku: 'TSH-DRS-ALN-L', inventory: 6 }
    ],
    reviews: [
      { authorName: 'Bhavna Rathore', rating: 5, title: 'Flattering A-line cut', body: 'The structured fit gives a slender tall appearance. Rich festive fabric.', verifiedBuyer: true }
    ]
  },
  {
    slug: 'mitti-mocha-handblock-flared-tunic-dress',
    title: 'Mitti Mocha Handblock Flared Angrakha Tunic',
    vendor: 'Taasa Atelier',
    category: 'Dresses',
    subcategory: 'Long Flared Tunics',
    aesthetic: 'Pastel Poetry',
    description: 'Artisanal earth-toned brown floral Angrakha tunic dress featuring fine handblock bootis, side tie dori, and flowy silhouette.',
    fabric: 'Pure Artisanal Organic Cotton with Mineral Vegetable Dyes',
    care: 'Delicate hand wash cold.',
    basePrice: 4999.00,
    salePrice: 3799.00,
    stockQuantity: 25,
    ratingsAvg: 4.8,
    reviewsCount: 39,
    badge: '🌸 Long Flared Tunic',
    isNew: true,
    isFeatured: false,
    image: '/images/products/taasa-client-18.jpeg',
    hoverImage: '/images/products/taasa-client-19.jpeg',
    variants: [
      { colorName: 'Earthy Mocha', colorHex: '#6d4c41', size: 'S', sku: 'TSH-DRS-MCH-S', inventory: 8 },
      { colorName: 'Earthy Mocha', colorHex: '#6d4c41', size: 'M', sku: 'TSH-DRS-MCH-M', inventory: 10 },
      { colorName: 'Earthy Mocha', colorHex: '#6d4c41', size: 'L', sku: 'TSH-DRS-MCH-L', inventory: 7 }
    ],
    reviews: [
      { authorName: 'Sanya Kapoor', rating: 5, title: 'Understated elegance', body: 'The earth tones feel so organic and calm. Great craftsmanship on the side ties.', verifiedBuyer: true }
    ]
  },

  // ==========================================
  // 3. CO-ORD SET
  // ==========================================
  {
    slug: 'terracotta-rust-embroidered-peplum-coord-set',
    title: 'Terracotta Rust Embroidered Peplum Co-ord Set',
    vendor: 'Taasa Atelier',
    category: 'Co-ord set',
    subcategory: 'Blazer & Trouser',
    aesthetic: 'Mughal Grace',
    description: 'Contemporary two-piece set featuring a pleated peplum silhouette tunic with botanical white thread embroidery on flared sleeves paired with tailored straight-leg trousers.',
    fabric: 'Rich Slub Cotton Linen with Hand-Embroidery Accents',
    care: 'Dry clean or gentle hand wash.',
    basePrice: 4999.00,
    salePrice: 3899.00,
    stockQuantity: 30,
    ratingsAvg: 5.0,
    reviewsCount: 86,
    badge: '✨ Trending Co-ord',
    isNew: true,
    isFeatured: true,
    image: '/images/products/taasa-client-08.jpeg',
    hoverImage: '/images/products/taasa-client-34.jpeg',
    variants: [
      { colorName: 'Terracotta Rust', colorHex: '#bf4e30', size: 'S', sku: 'TSH-CRD-RST-S', inventory: 8 },
      { colorName: 'Terracotta Rust', colorHex: '#bf4e30', size: 'M', sku: 'TSH-CRD-RST-M', inventory: 12 },
      { colorName: 'Terracotta Rust', colorHex: '#bf4e30', size: 'L', sku: 'TSH-CRD-RST-L', inventory: 6 },
      { colorName: 'Terracotta Rust', colorHex: '#bf4e30', size: 'XL', sku: 'TSH-CRD-RST-XL', inventory: 4 }
    ],
    reviews: [
      { authorName: 'Tanvi Agarwal', rating: 5, title: 'Absolute perfection!', body: 'The fit of both the peplum top and trousers is custom-tailored level. Wore it to a high tea party!', verifiedBuyer: true }
    ]
  },
  {
    slug: 'royal-purple-pleated-coord-set',
    title: 'Royal Purple Pleated Silhouette Co-ord Set',
    vendor: 'Taasa Atelier',
    category: 'Co-ord set',
    subcategory: 'Printed Silk Co-ords',
    aesthetic: 'Pastel Poetry',
    description: 'Tailored matching co-ord ensemble in imperial purple with pleated chest detailing, 3/4 sleeves, and relaxed straight trousers.',
    fabric: 'Fine Cotton Twill Blend with Fluid Drape',
    care: 'Machine wash gentle cold or dry clean.',
    basePrice: 5199.00,
    salePrice: 3999.00,
    stockQuantity: 24,
    ratingsAvg: 4.9,
    reviewsCount: 53,
    badge: '👑 Royal Purple Edit',
    isNew: true,
    isFeatured: false,
    image: '/images/products/taasa-client-38.jpeg',
    hoverImage: '/images/products/taasa-client-42.jpeg',
    variants: [
      { colorName: 'Imperial Purple', colorHex: '#5e35b1', size: 'S', sku: 'TSH-CRD-PRP-S', inventory: 6 },
      { colorName: 'Imperial Purple', colorHex: '#5e35b1', size: 'M', sku: 'TSH-CRD-PRP-M', inventory: 10 },
      { colorName: 'Imperial Purple', colorHex: '#5e35b1', size: 'L', sku: 'TSH-CRD-PRP-L', inventory: 8 }
    ],
    reviews: [
      { authorName: 'Shruti Mathur', rating: 5, title: 'Chic matching co-ord', body: 'The color is so royal and the trousers have practical deep pockets. Highly recommend!', verifiedBuyer: true }
    ]
  },

  // ==========================================
  // 4. TWO PIECE SET
  // ==========================================
  {
    slug: 'purple-elegance-pleated-two-piece-set',
    title: 'Purple Elegance Pleated Kurti & Trouser Two-Piece Set',
    vendor: 'Taasa Atelier',
    category: 'Two piece set',
    subcategory: 'Peplum & Sharara',
    aesthetic: 'Pastel Poetry',
    description: 'Signature Taasa coordinated pair: graceful violet kurti with delicate bodice pleats and comfortable tailored white cotton pants.',
    fabric: 'Pure Cotton with Breathable Weave & Tailored Bottoms',
    care: 'Gentle machine wash cold. Warm iron.',
    basePrice: 4499.00,
    salePrice: 3499.00,
    stockQuantity: 28,
    ratingsAvg: 4.9,
    reviewsCount: 67,
    badge: '💜 Signature Duo',
    isNew: true,
    isFeatured: true,
    image: '/images/products/taasa-client-22.jpeg',
    hoverImage: '/images/products/taasa-client-23.jpeg',
    variants: [
      { colorName: 'Violet Kurti & White Pants', colorHex: '#7b1fa2', size: 'S', sku: 'TSH-TWO-PRP-S', inventory: 8 },
      { colorName: 'Violet Kurti & White Pants', colorHex: '#7b1fa2', size: 'M', sku: 'TSH-TWO-PRP-M', inventory: 12 },
      { colorName: 'Violet Kurti & White Pants', colorHex: '#7b1fa2', size: 'L', sku: 'TSH-TWO-PRP-L', inventory: 8 }
    ],
    reviews: [
      { authorName: 'Kriti Singhania', rating: 5, title: 'Flawless everyday elegance', body: 'The purple kurti and white pants combination looks so fresh and poised.', verifiedBuyer: true }
    ]
  },
  {
    slug: 'marigold-paisley-sleeveless-flared-pant-set',
    title: 'Marigold Paisley Sleeveless Kurti & Flared Pant Set',
    vendor: 'Taasa Atelier',
    category: 'Two piece set',
    subcategory: 'Crop Top & Dhoti',
    aesthetic: 'Sangeet Radiance',
    description: 'Vibrant mustard tunic with red paisley motifs and playful shoulder tassel ties, paired with crisp white comfort wide-leg trousers.',
    fabric: 'Pure Breathable Cotton with Natural Pigment Prints',
    care: 'Hand wash cold. Dry in shade.',
    basePrice: 4199.00,
    salePrice: 3199.00,
    stockQuantity: 26,
    ratingsAvg: 4.8,
    reviewsCount: 49,
    badge: '✨ Festive Duo',
    isNew: true,
    isFeatured: false,
    image: '/images/products/taasa-client-27.jpeg',
    hoverImage: '/images/products/taasa-client-30.jpeg',
    variants: [
      { colorName: 'Marigold & White', colorHex: '#fbc02d', size: 'S', sku: 'TSH-TWO-MST-S', inventory: 8 },
      { colorName: 'Marigold & White', colorHex: '#fbc02d', size: 'M', sku: 'TSH-TWO-MST-M', inventory: 10 },
      { colorName: 'Marigold & White', colorHex: '#fbc02d', size: 'L', sku: 'TSH-TWO-MST-L', inventory: 8 }
    ],
    reviews: [
      { authorName: 'Deepika Rao', rating: 5, title: 'Loved the shoulder ties', body: 'The flared white bottoms are super soft and the yellow kurti is cheerful!', verifiedBuyer: true }
    ]
  },
  {
    slug: 'lime-olive-gathered-pant-duo',
    title: 'Lime Olive Gathered Kurti & White Trouser Duo',
    vendor: 'Taasa Atelier',
    category: 'Two piece set',
    subcategory: 'Two Piece Kurti Set',
    aesthetic: 'Heritage Royalty',
    description: 'Relaxed lime-olive tunic with gentle front pleats and wood buttons, paired with tailored pure white cotton cigarette trousers.',
    fabric: '100% Breathable Slub Cotton',
    care: 'Machine wash cold.',
    basePrice: 4299.00,
    salePrice: 3299.00,
    stockQuantity: 25,
    ratingsAvg: 4.9,
    reviewsCount: 42,
    badge: '🌿 Olive Duo',
    isNew: true,
    isFeatured: false,
    image: '/images/products/taasa-client-11.jpeg',
    hoverImage: '/images/products/taasa-client-14.jpeg',
    variants: [
      { colorName: 'Olive & White', colorHex: '#689f38', size: 'S', sku: 'TSH-TWO-OLV-S', inventory: 8 },
      { colorName: 'Olive & White', colorHex: '#689f38', size: 'M', sku: 'TSH-TWO-OLV-M', inventory: 10 },
      { colorName: 'Olive & White', colorHex: '#689f38', size: 'L', sku: 'TSH-TWO-OLV-L', inventory: 7 }
    ],
    reviews: [
      { authorName: 'Priyanka Sen', rating: 5, title: 'Very stylish set', body: 'The olive tone pairs cleanly with the white trousers. Great fit.', verifiedBuyer: true }
    ]
  },

  // ==========================================
  // 5. PLUS SIZE COLLECTION
  // ==========================================
  {
    slug: 'taasa-curve-noorani-mirror-anarkali',
    title: 'Taasa Curve Noorani Mirror Flared Anarkali (Sizes L - 5XL)',
    vendor: 'Taasa Atelier',
    category: 'Plus size collection',
    subcategory: 'Curvy Anarkalis',
    aesthetic: 'Bridal Opulence',
    description: 'Specially graded curved cut crafted with flattering vertical flare panels, real mirror embellishment, and lightweight flowing drape.',
    fabric: 'Premium Viscose Silk Georgette with Pure Cotton Lining',
    care: 'Dry clean only to preserve mirror work.',
    basePrice: 9499.00,
    salePrice: 7499.00,
    stockQuantity: 20,
    ratingsAvg: 5.0,
    reviewsCount: 76,
    badge: '💖 Curve Inclusive (L - 5XL)',
    isNew: true,
    isFeatured: true,
    image: '/images/products/taasa-client-03.jpeg',
    hoverImage: '/images/products/taasa-client-05.jpeg',
    variants: [
      { colorName: 'Midnight Black', colorHex: '#111111', size: 'L', sku: 'TSH-CRV-ANK-L', inventory: 5 },
      { colorName: 'Midnight Black', colorHex: '#111111', size: 'XL', sku: 'TSH-CRV-ANK-XL', inventory: 6 },
      { colorName: 'Midnight Black', colorHex: '#111111', size: 'XXL', sku: 'TSH-CRV-ANK-2XL', inventory: 5 },
      { colorName: 'Midnight Black', colorHex: '#111111', size: '3XL', sku: 'TSH-CRV-ANK-3XL', inventory: 4 }
    ],
    reviews: [
      { authorName: 'Natasha Fernandez', rating: 5, title: 'Finally plus size ethnic wear done right!', body: 'The proportions around the bust and waist are impeccably tailored. I feel like royalty in this!', verifiedBuyer: true }
    ]
  },
  {
    slug: 'taasa-curve-terracotta-flowy-festive-tunic',
    title: 'Taasa Curve Terracotta Flowy Festive Tunic (Sizes L - 5XL)',
    vendor: 'Taasa Atelier',
    category: 'Plus size collection',
    subcategory: 'Flowy Tunics',
    aesthetic: 'Heritage Royalty',
    description: 'Comfort-fit regal silhouette designed for effortless elegance with delicate handwork on neck and breathable natural fabric.',
    fabric: 'Breathable Slub Cotton with Handwork Accents',
    care: 'Gentle hand wash cold.',
    basePrice: 4999.00,
    salePrice: 3699.00,
    stockQuantity: 22,
    ratingsAvg: 4.9,
    reviewsCount: 54,
    badge: '🌸 Flowy Curve Tunic',
    isNew: true,
    isFeatured: false,
    image: '/images/products/taasa-client-07.jpeg',
    hoverImage: '/images/products/taasa-client-01.jpeg',
    variants: [
      { colorName: 'Terracotta', colorHex: '#c05c36', size: 'L', sku: 'TSH-CRV-TNC-L', inventory: 6 },
      { colorName: 'Terracotta', colorHex: '#c05c36', size: 'XL', sku: 'TSH-CRV-TNC-XL', inventory: 8 },
      { colorName: 'Terracotta', colorHex: '#c05c36', size: 'XXL', sku: 'TSH-CRV-TNC-2XL', inventory: 5 },
      { colorName: 'Terracotta', colorHex: '#c05c36', size: '3XL', sku: 'TSH-CRV-TNC-3XL', inventory: 3 }
    ],
    reviews: [
      { authorName: 'Gurleen Kaur', rating: 5, title: 'So breathable and flattering', body: 'The vertical pleats create a beautiful long line. Perfect fit for curvy bodies.', verifiedBuyer: true }
    ]
  },

  // ==========================================
  // 6. PANTS
  // ==========================================
  {
    slug: 'classic-ivory-tailored-cotton-cigarette-pants',
    title: 'Classic Ivory Tailored Cotton Cigarette Pants',
    vendor: 'Taasa Atelier',
    category: 'Pants',
    subcategory: 'Cigarette Pants',
    aesthetic: 'Pastel Poetry',
    description: 'Versatile atelier-stitched pure combed cotton pants featuring elasticated back waist, front flat band, deep side pockets, and ankle slits.',
    fabric: '100% High-Grade Combed Cotton with Anti-Translucency Weave',
    care: 'Machine wash gentle cold. Warm iron.',
    basePrice: 1999.00,
    salePrice: 1499.00,
    stockQuantity: 50,
    ratingsAvg: 4.9,
    reviewsCount: 142,
    badge: '💎 Atelier Tailored',
    isNew: true,
    isFeatured: true,
    image: '/images/products/taasa-client-40.jpeg',
    hoverImage: '/images/products/taasa-client-26.jpeg',
    variants: [
      { colorName: 'Classic Ivory', colorHex: '#fcfcfc', size: 'S', sku: 'TSH-PNT-IVR-S', inventory: 15 },
      { colorName: 'Classic Ivory', colorHex: '#fcfcfc', size: 'M', sku: 'TSH-PNT-IVR-M', inventory: 20 },
      { colorName: 'Classic Ivory', colorHex: '#fcfcfc', size: 'L', sku: 'TSH-PNT-IVR-L', inventory: 15 }
    ],
    reviews: [
      { authorName: 'Simi Grover', rating: 5, title: 'The ultimate staple pants!', body: 'Not see-through at all! The fabric is thick yet breathable and fits all my kurtis.', verifiedBuyer: true }
    ]
  },
  {
    slug: 'haldi-sunshine-flared-palazzo-pants',
    title: 'Haldi Sunshine Flared Artisanal Palazzo Pants',
    vendor: 'Taasa Atelier',
    category: 'Pants',
    subcategory: 'Flared Palazzos',
    aesthetic: 'Sangeet Radiance',
    description: 'Flowy wide-leg palazzos in breathable cotton-silk blend with fluid drape, comfortable drawstring waistband, and concealed pocket.',
    fabric: 'Cotton-Silk Blend with Fluid Drape',
    care: 'Gentle hand wash in cold water.',
    basePrice: 2499.00,
    salePrice: 1899.00,
    stockQuantity: 35,
    ratingsAvg: 4.8,
    reviewsCount: 68,
    badge: '✨ Flared Palazzo',
    isNew: true,
    isFeatured: false,
    image: '/images/products/taasa-client-02.jpeg',
    hoverImage: '/images/products/taasa-client-04.jpeg',
    variants: [
      { colorName: 'Sunshine Mustard', colorHex: '#fbc02d', size: 'Free Size', sku: 'TSH-PNT-PLZ-FS', inventory: 20 },
      { colorName: 'Pure White', colorHex: '#ffffff', size: 'Free Size', sku: 'TSH-PNT-PLZ-WHT', inventory: 15 }
    ],
    reviews: [
      { authorName: 'Rashmi Dixit', rating: 5, title: 'Magnificent fluid flare', body: 'Feels like wearing air! Perfect volume and fall.', verifiedBuyer: true }
    ]
  }
];

const PROMOS_DATA = [
  { code: 'TAASA10', discountType: 'PERCENTAGE', value: 0.10, minOrder: 1500.00, active: true },
  { code: 'RANI20', discountType: 'PERCENTAGE', value: 0.20, minOrder: 3000.00, active: true },
  { code: 'FESTIVE25', discountType: 'PERCENTAGE', value: 0.25, minOrder: 5000.00, active: true },
  { code: 'FIRST500', discountType: 'FIXED', value: 500.00, minOrder: 2500.00, active: true },
  { code: 'UTSAV50', discountType: 'FIXED', value: 1000.00, minOrder: 4000.00, active: true }
];

const INITIAL_ORDERS = [
  {
    orderNumber: 'TSH-IND-9481',
    customerName: 'Ananya Deshmukh',
    customerEmail: 'ananya.deshmukh@gmail.com',
    customerPhone: '+91 98201 44521',
    shippingAddress: JSON.stringify({
      line1: 'B-402, Oberoi Sky Heights, Lokhandwala',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400053',
      country: 'India'
    }),
    items: JSON.stringify([
      {
        id: 1,
        title: 'Noor Rust Orange Handcrafted Flared Anarkali Dress',
        price: 5499.00,
        quantity: 1,
        color: 'Rust Terracotta',
        size: 'M',
        image: '/images/products/taasa-client-01.jpeg'
      }
    ]),
    subtotal: 5499.00,
    discount: 1099.80,
    shippingFee: 0.00,
    total: 4399.20,
    status: 'DELIVERED',
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    paymentId: 'upi_ref_mum_992819',
    promoCode: 'RANI20',
    giftPackaging: true,
    notes: 'Please pack in royal gift box with handwritten note.'
  },
  {
    orderNumber: 'TSH-IND-9482',
    customerName: 'Kriti Singhania',
    customerEmail: 'kriti.singhania@yahoo.co.in',
    customerPhone: '+91 97112 88390',
    shippingAddress: JSON.stringify({
      line1: '14, Golf Links Enclave',
      city: 'New Delhi',
      state: 'Delhi',
      postalCode: '110003',
      country: 'India'
    }),
    items: JSON.stringify([
      {
        id: 2,
        title: 'Terracotta Rust Embroidered Peplum Co-ord Set',
        price: 3899.00,
        quantity: 1,
        color: 'Terracotta Rust',
        size: 'M',
        image: '/images/products/taasa-client-08.jpeg'
      }
    ]),
    subtotal: 3899.00,
    discount: 500.00,
    shippingFee: 0.00,
    total: 3399.00,
    status: 'SHIPPED',
    paymentMethod: 'CARD',
    paymentStatus: 'PAID',
    paymentId: 'pi_3P_shaadi_delhi_9918',
    promoCode: 'FIRST500',
    giftPackaging: true,
    notes: 'Boutique order. Scheduled for delivery before weekend event.'
  }
];

const UGC_POSTS = [
  {
    creator: '@ananya.couture',
    creatorName: 'Ananya Singhania',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    location: 'Taj Falaknuma Palace, Hyderabad',
    verified: true,
    caption: 'Twirling in pure poetry with @TaasaAtelier Noor Rust Orange Anarkali. That full sweeping flare feels so royal! 👑✨',
    likes: 1842,
    aspectClass: 'aspect-portrait',
    image: '/images/products/taasa-client-01.jpeg',
    category: 'heritage',
    badge: '👑 Royal Look of the Week'
  },
  {
    creator: '@meera.kapoor',
    creatorName: 'Meera Kapoor',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    location: 'Umaid Bhawan Palace, Jodhpur',
    verified: true,
    caption: 'My weekend look in @TaasaAtelier Indigo Neel Handblock Angrakha. The dabu block print is pure artisanal perfection. ❤️',
    likes: 2410,
    aspectClass: 'aspect-tall',
    image: '/images/products/taasa-client-17.jpeg',
    category: 'festive',
    badge: '✨ Boutique Muse'
  },
  {
    creator: '@radhika_deshmukh',
    creatorName: 'Radhika Deshmukh',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    location: 'City Palace, Jaipur',
    verified: true,
    caption: 'Sunday brunching in @TaasaAtelier Terracotta Peplum Co-ord set! Clean lines and breathtaking sleeve embroidery. 🌸✨',
    likes: 1290,
    aspectClass: 'aspect-editorial',
    image: '/images/products/taasa-client-08.jpeg',
    category: 'festive',
    badge: '🌸 Festive Star'
  },
  {
    creator: '@sanya.grover',
    creatorName: 'Sanya Grover',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    location: 'Alila Fort Bishangarh',
    verified: true,
    caption: 'Effortless poise in @TaasaAtelier Purple Elegance pleated kurti and white trousers. Simple, stylish, elegant! 💃💜',
    likes: 3120,
    aspectClass: 'aspect-tall',
    image: '/images/products/taasa-client-22.jpeg',
    category: 'sangeet',
    badge: '💃 Sangeet Queen'
  }
];

const SUBSCRIBERS = [
  { email: 'priya.sharma@gmail.com', source: 'FOOTER_FORM', discountCodeSent: 'RANI20' },
  { email: 'divya.kapoor@gmail.com', source: 'SECRET_WHEEL', discountCodeSent: 'UTSAV50' },
  { email: 'ananya.mehra@outlook.com', source: 'FOOTER_POPUP', discountCodeSent: 'TAASA10' },
  { email: 'sneha.festive@gmail.com', source: 'SHOP_THE_FEED', discountCodeSent: 'RANI20' }
];

async function main() {
  console.log('🌸 Starting Taasa authentic Indian luxury women\'s wear database seeding...');

  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.uGCPost.deleteMany();
  await prisma.order.deleteMany();
  await prisma.promoCode.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // 1. Seed Categories (including client specified categories)
  for (const cat of CATEGORIES_DATA) {
    await prisma.category.create({ data: cat });
    console.log(`  📂 Seeded Category: ${cat.name} (${cat.slug})`);
  }

  // 2. Seed Products with Variants and Reviews
  const createdProducts = [];
  for (const pData of PRODUCTS_DATA) {
    const { variants, reviews, ...productFields } = pData;
    const createdProduct = await prisma.product.create({
      data: {
        ...productFields,
        variants: {
          create: variants.map(v => ({
            colorName: v.colorName,
            colorHex: v.colorHex,
            size: v.size,
            sku: v.sku,
            inventory: v.inventory,
            image: productFields.image
          }))
        },
        reviews: {
          create: reviews.map(r => ({
            authorName: r.authorName,
            rating: r.rating,
            title: r.title,
            body: r.body,
            verifiedBuyer: r.verifiedBuyer
          }))
        }
      }
    });
    createdProducts.push(createdProduct);
    console.log(`  ✨ Seeded Authentic Piece: [${createdProduct.category} / ${createdProduct.subcategory}] ${createdProduct.title} (ID: ${createdProduct.id})`);
  }

  // 3. Seed Promo Codes
  for (const promo of PROMOS_DATA) {
    await prisma.promoCode.create({ data: promo });
    console.log(`  🏷️ Seeded Promo Code: ${promo.code}`);
  }

  // 4. Seed Initial Orders
  for (const order of INITIAL_ORDERS) {
    await prisma.order.create({ data: order });
    console.log(`  📦 Seeded Order: ${order.orderNumber}`);
  }

  // 5. Seed UGC Posts
  for (let i = 0; i < UGC_POSTS.length; i++) {
    const ugc = UGC_POSTS[i];
    const linkedProduct = createdProducts[i % createdProducts.length];
    await prisma.uGCPost.create({
      data: {
        ...ugc,
        productId: linkedProduct ? linkedProduct.id : null
      }
    });
    console.log(`  📸 Seeded Indian Muse Look: ${ugc.creator}`);
  }

  // 6. Seed Subscribers
  for (const sub of SUBSCRIBERS) {
    await prisma.newsletterSubscriber.create({ data: sub });
  }

  // 7. Seed Admin
  await prisma.adminUser.create({
    data: {
      name: 'Taasa Creative Director',
      email: 'admin@taasa.com',
      role: 'SUPERADMIN'
    }
  });
  console.log('  👑 Seeded Royal Admin: admin@taasa.com');

  console.log(`💖 Taasa Indian Authentic Luxury Women's Wear database seeded: ${CATEGORIES_DATA.length} categories, ${createdProducts.length} pieces!`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
