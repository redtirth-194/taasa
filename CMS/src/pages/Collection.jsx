import React, {  useState, useMemo, useEffect  } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  SlidersHorizontal, 
  ChevronDown, 
  X, 
  Grid2X2, 
  LayoutGrid, 
  Check
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';
import { formatINR } from '../utils/currency';
import './Collection.css';

const ALL_PRODUCTS = [
  // 1. KURTIS
  {
    id: 81,
    category: 'Kurtis',
    subcategory: 'Short Kurti',
    title: 'Noorani Ivory Threadwork Short Kurti',
    price: 2499.00,
    oldPrice: 3299.00,
    badge: '🌸 Short Kurti Bestseller',
    isNew: true,
    aesthetic: 'Pastel Poetry',
    size: ['S', 'M', 'L', 'XL'],
    color: 'Ivory',
    colors: ['Ivory Cream'],
    rating: '4.9 (88)',
    image: '/images/products/taasa-client-26.jpeg',
    hoverImage: '/images/products/taasa-client-25.jpeg',
    swatches: ['#fdfbf7', '#222222']
  },
  {
    id: 82,
    category: 'Kurtis',
    subcategory: 'Short Kurti',
    title: 'Parijaat Sage Green Floral Short Kurti',
    price: 2399.00,
    oldPrice: 3199.00,
    badge: '🌿 Everyday Floral',
    isNew: true,
    aesthetic: 'Pastel Poetry',
    size: ['S', 'M', 'L'],
    color: 'Green',
    colors: ['Sage Green'],
    rating: '4.8 (64)',
    image: '/images/products/taasa-client-43.jpeg',
    hoverImage: '/images/products/taasa-client-44.jpeg',
    swatches: ['#9bb0a5', '#f5f5dc']
  },
  {
    id: 83,
    category: 'Kurtis',
    subcategory: 'Long Kurti',
    title: 'Rajkumari Wine Pure Silk Straight Cut Kurti Suit',
    price: 6199.00,
    oldPrice: 7999.00,
    badge: '👑 Royal Silk Edit',
    isNew: true,
    aesthetic: 'Heritage Royalty',
    size: ['S', 'M', 'L', 'XL'],
    color: 'Burgundy',
    colors: ['Imperial Wine'],
    rating: '5.0 (95)',
    image: '/images/products/taasa-client-31.jpeg',
    hoverImage: '/images/products/taasa-client-33.jpeg',
    swatches: ['#4a154b', '#d4af37']
  },
  {
    id: 84,
    category: 'Kurtis',
    subcategory: 'Sleeveless',
    title: 'Haldi Sunshine Paisley Sleeveless Kurti',
    price: 2699.00,
    oldPrice: 3499.00,
    badge: '💛 Haldi Essential',
    isNew: true,
    aesthetic: 'Sangeet Radiance',
    size: ['S', 'M', 'L'],
    color: 'Yellow',
    colors: ['Haldi Yellow'],
    rating: '4.9 (72)',
    image: '/images/products/taasa-client-02.jpeg',
    hoverImage: '/images/products/taasa-client-04.jpeg',
    swatches: ['#f5b041', '#ffffff']
  },
  {
    id: 85,
    category: 'Kurtis',
    subcategory: 'Straight Cut',
    title: 'Rani Gulabi Color-Block Yoke Straight Kurti',
    price: 2799.00,
    oldPrice: 3699.00,
    badge: '✨ Straight Cut Pick',
    isNew: true,
    aesthetic: 'Sangeet Radiance',
    size: ['S', 'M', 'L'],
    color: 'Pink',
    colors: ['Rani Gulabi'],
    rating: '4.8 (45)',
    image: '/images/products/taasa-client-45.jpeg',
    hoverImage: '/images/products/taasa-client-32.jpeg',
    swatches: ['#c2185b', '#e0c068']
  },
  {
    id: 86,
    category: 'Kurtis',
    subcategory: 'Kurti Shirts',
    title: 'Neelambari Botanical Embroidered Kurti Shirt',
    price: 2999.00,
    oldPrice: 3899.00,
    badge: '🤍 Shirt Kurti Style',
    isNew: true,
    aesthetic: 'Pastel Poetry',
    size: ['S', 'M', 'L', 'XL'],
    color: 'Navy',
    colors: ['Midnight Navy'],
    rating: '4.9 (56)',
    image: '/images/products/taasa-client-40.jpeg',
    hoverImage: '/images/products/taasa-client-41.jpeg',
    swatches: ['#1b2a47', '#fdfbf7']
  },
  {
    id: 87,
    category: 'Kurtis',
    subcategory: 'Tunics',
    title: 'Kashish Plum Wine Gathered Button Kurti Tunic',
    price: 2299.00,
    oldPrice: 2999.00,
    badge: '🌸 Gathered Tunic',
    isNew: true,
    aesthetic: 'Pastel Poetry',
    size: ['S', 'M', 'L'],
    color: 'Burgundy',
    colors: ['Deep Plum Wine'],
    rating: '4.9 (78)',
    image: '/images/products/taasa-client-20.jpeg',
    hoverImage: '/images/products/taasa-client-24.jpeg',
    swatches: ['#581845', '#fdfbf7']
  },
  {
    id: 88,
    category: 'Kurtis',
    subcategory: 'Tunics',
    title: 'Avani Olive Green Gathered Peplum Kurti Tunic',
    price: 2299.00,
    oldPrice: 2999.00,
    badge: '🌿 Fresh Olive Edit',
    isNew: true,
    aesthetic: 'Heritage Royalty',
    size: ['S', 'M', 'L'],
    color: 'Green',
    colors: ['Olive Lime'],
    rating: '4.8 (52)',
    image: '/images/products/taasa-client-12.jpeg',
    hoverImage: '/images/products/taasa-client-13.jpeg',
    swatches: ['#808000', '#fdfbf7']
  },
  {
    id: 89,
    category: 'Kurtis',
    subcategory: 'Tunics',
    title: 'Kasturi Mocha Yoke Embroidered Kurti Tunic',
    price: 2699.00,
    oldPrice: 3499.00,
    badge: '☕ Earthy Tones',
    isNew: true,
    aesthetic: 'Heritage Royalty',
    size: ['S', 'M', 'L'],
    color: 'Brown',
    colors: ['Mocha Brown'],
    rating: '4.9 (61)',
    image: '/images/products/taasa-client-28.jpeg',
    hoverImage: '/images/products/taasa-client-29.jpeg',
    swatches: ['#4e3629', '#fdfbf7']
  },

  // 2. DRESSES
  {
    id: 90,
    category: 'Dresses',
    subcategory: 'Anarkali',
    title: 'Noor Rust Orange Handcrafted Flared Anarkali Dress',
    price: 5499.00,
    oldPrice: 6999.00,
    badge: '👑 Royal Flare Masterpiece',
    isNew: true,
    aesthetic: 'Heritage Royalty',
    size: ['S', 'M', 'L', 'XL'],
    color: 'Rust',
    colors: ['Rust Terracotta'],
    rating: '5.0 (114)',
    image: '/images/products/taasa-client-01.jpeg',
    hoverImage: '/images/products/taasa-client-06.jpeg',
    swatches: ['#c05c36', '#d4af37']
  },
  {
    id: 91,
    category: 'Dresses',
    subcategory: 'Anarkali',
    title: 'Neelambari Royal Blue Mirror-Work Anarkali Dress',
    price: 6899.00,
    oldPrice: 8499.00,
    badge: '✨ Royal Blue Edition',
    isNew: true,
    aesthetic: 'Heritage Royalty',
    size: ['S', 'M', 'L'],
    color: 'Blue',
    colors: ['Royal Blue'],
    rating: '4.9 (79)',
    image: '/images/products/taasa-client-05.jpeg',
    hoverImage: '/images/products/taasa-client-03.jpeg',
    swatches: ['#1e3d59', '#e0e0e0']
  },
  {
    id: 92,
    category: 'Dresses',
    subcategory: 'Anarkali',
    title: 'Noorani Midnight Black Mirror-Work Flared Anarkali',
    price: 7299.00,
    oldPrice: 8999.00,
    badge: '💎 Evening Opulence',
    isNew: true,
    aesthetic: 'Bridal Opulence',
    size: ['S', 'M', 'L'],
    color: 'Black',
    colors: ['Midnight Black'],
    rating: '5.0 (92)',
    image: '/images/products/taasa-client-03.jpeg',
    hoverImage: '/images/products/taasa-client-05.jpeg',
    swatches: ['#111111', '#cccccc']
  },
  {
    id: 93,
    category: 'Dresses',
    subcategory: 'Angrakha',
    title: 'Indigo Neel Block-Print Flared Angrakha Dress',
    price: 4199.00,
    oldPrice: 5499.00,
    badge: '✨ Handblock Angrakha',
    isNew: true,
    aesthetic: 'Heritage Royalty',
    size: ['S', 'M', 'L'],
    color: 'Blue',
    colors: ['Indigo Dabu Blue'],
    rating: '4.9 (68)',
    image: '/images/products/taasa-client-17.jpeg',
    hoverImage: '/images/products/taasa-client-15.jpeg',
    swatches: ['#23395d', '#fdfbf7']
  },
  {
    id: 94,
    category: 'Dresses',
    subcategory: 'Angrakha',
    title: 'Kesariya Floral Angrakha Flared Dress',
    price: 3999.00,
    oldPrice: 5299.00,
    badge: '🌸 Sunlit Festive',
    isNew: true,
    aesthetic: 'Sangeet Radiance',
    size: ['S', 'M', 'L'],
    color: 'Yellow',
    colors: ['Mustard Floral'],
    rating: '4.8 (51)',
    image: '/images/products/taasa-client-16.jpeg',
    hoverImage: '/images/products/taasa-client-21.jpeg',
    swatches: ['#e5a93c', '#d81b60']
  },
  {
    id: 95,
    category: 'Dresses',
    subcategory: 'A-Line',
    title: 'Bagh-e-Khaas Floral Booti A-Line Festive Dress',
    price: 4499.00,
    oldPrice: 5899.00,
    badge: '👑 Structured A-Line',
    isNew: true,
    aesthetic: 'Sangeet Radiance',
    size: ['S', 'M', 'L'],
    color: 'Burgundy',
    colors: ['Crimson Booti'],
    rating: '4.9 (43)',
    image: '/images/products/taasa-client-10.jpeg',
    hoverImage: '/images/products/taasa-client-09.jpeg',
    swatches: ['#9c27b0', '#f5b041']
  },
  {
    id: 96,
    category: 'Dresses',
    subcategory: 'Long Flared Tunics',
    title: 'Mitti Mocha Handblock Flared Angrakha Tunic',
    price: 3799.00,
    oldPrice: 4999.00,
    badge: '🌸 Long Flared Tunic',
    isNew: true,
    aesthetic: 'Pastel Poetry',
    size: ['S', 'M', 'L'],
    color: 'Brown',
    colors: ['Earthy Mocha'],
    rating: '4.8 (39)',
    image: '/images/products/taasa-client-18.jpeg',
    hoverImage: '/images/products/taasa-client-19.jpeg',
    swatches: ['#6d4c41', '#e0c068']
  },

  // 3. CO-ORD SET
  {
    id: 97,
    category: 'Co-ord set',
    subcategory: 'Blazer & Trouser',
    title: 'Terracotta Rust Embroidered Peplum Co-ord Set',
    price: 3899.00,
    oldPrice: 4999.00,
    badge: '✨ Trending Co-ord',
    isNew: true,
    aesthetic: 'Mughal Grace',
    size: ['S', 'M', 'L', 'XL'],
    color: 'Rust',
    colors: ['Terracotta Rust'],
    rating: '5.0 (86)',
    image: '/images/products/taasa-client-08.jpeg',
    hoverImage: '/images/products/taasa-client-34.jpeg',
    swatches: ['#bf4e30', '#fdfbf7']
  },
  {
    id: 98,
    category: 'Co-ord set',
    subcategory: 'Printed Silk Co-ords',
    title: 'Royal Purple Pleated Silhouette Co-ord Set',
    price: 3999.00,
    oldPrice: 5199.00,
    badge: '👑 Royal Purple Edit',
    isNew: true,
    aesthetic: 'Pastel Poetry',
    size: ['S', 'M', 'L'],
    color: 'Purple',
    colors: ['Imperial Purple'],
    rating: '4.9 (53)',
    image: '/images/products/taasa-client-38.jpeg',
    hoverImage: '/images/products/taasa-client-42.jpeg',
    swatches: ['#5e35b1', '#ffffff']
  },

  // 4. TWO PIECE SET
  {
    id: 99,
    category: 'Two piece set',
    subcategory: 'Peplum & Sharara',
    title: 'Purple Elegance Pleated Kurti & Trouser Two-Piece Set',
    price: 3499.00,
    oldPrice: 4499.00,
    badge: '💜 Signature Duo',
    isNew: true,
    aesthetic: 'Pastel Poetry',
    size: ['S', 'M', 'L'],
    color: 'Purple',
    colors: ['Violet Kurti & White Pants'],
    rating: '4.9 (67)',
    image: '/images/products/taasa-client-22.jpeg',
    hoverImage: '/images/products/taasa-client-23.jpeg',
    swatches: ['#7b1fa2', '#ffffff']
  },
  {
    id: 100,
    category: 'Two piece set',
    subcategory: 'Crop Top & Dhoti',
    title: 'Marigold Paisley Sleeveless Kurti & Flared Pant Set',
    price: 3199.00,
    oldPrice: 4199.00,
    badge: '✨ Festive Duo',
    isNew: true,
    aesthetic: 'Sangeet Radiance',
    size: ['S', 'M', 'L'],
    color: 'Yellow',
    colors: ['Marigold & White'],
    rating: '4.8 (49)',
    image: '/images/products/taasa-client-27.jpeg',
    hoverImage: '/images/products/taasa-client-30.jpeg',
    swatches: ['#fbc02d', '#ffffff']
  },
  {
    id: 101,
    category: 'Two piece set',
    subcategory: 'Two Piece Kurti Set',
    title: 'Lime Olive Gathered Kurti & White Trouser Duo',
    price: 3299.00,
    oldPrice: 4299.00,
    badge: '🌿 Olive Duo',
    isNew: true,
    aesthetic: 'Heritage Royalty',
    size: ['S', 'M', 'L'],
    color: 'Green',
    colors: ['Olive & White'],
    rating: '4.9 (42)',
    image: '/images/products/taasa-client-11.jpeg',
    hoverImage: '/images/products/taasa-client-14.jpeg',
    swatches: ['#689f38', '#ffffff']
  },

  // 5. PLUS SIZE COLLECTION
  {
    id: 102,
    category: 'Plus size collection',
    subcategory: 'Curvy Anarkalis',
    title: 'Taasa Curve Noorani Mirror Flared Anarkali (Sizes L - 5XL)',
    price: 7499.00,
    oldPrice: 9499.00,
    badge: '💖 Curve Inclusive (L - 5XL)',
    isNew: true,
    aesthetic: 'Bridal Opulence',
    size: ['L', 'XL', 'Custom'],
    color: 'Black',
    colors: ['Midnight Black'],
    rating: '5.0 (76)',
    image: '/images/products/taasa-client-03.jpeg',
    hoverImage: '/images/products/taasa-client-05.jpeg',
    swatches: ['#111111', '#cccccc']
  },
  {
    id: 103,
    category: 'Plus size collection',
    subcategory: 'Flowy Tunics',
    title: 'Taasa Curve Terracotta Flowy Festive Tunic (Sizes L - 5XL)',
    price: 3699.00,
    oldPrice: 4999.00,
    badge: '🌸 Flowy Curve Tunic',
    isNew: true,
    aesthetic: 'Heritage Royalty',
    size: ['L', 'XL', 'Custom'],
    color: 'Rust',
    colors: ['Terracotta'],
    rating: '4.9 (54)',
    image: '/images/products/taasa-client-07.jpeg',
    hoverImage: '/images/products/taasa-client-01.jpeg',
    swatches: ['#c05c36', '#d4af37']
  },

  // 6. PANTS
  {
    id: 104,
    category: 'Pants',
    subcategory: 'Cigarette Pants',
    title: 'Classic Ivory Tailored Cotton Cigarette Pants',
    price: 1499.00,
    oldPrice: 1999.00,
    badge: '💎 Atelier Tailored',
    isNew: true,
    aesthetic: 'Pastel Poetry',
    size: ['S', 'M', 'L'],
    color: 'Ivory',
    colors: ['Classic Ivory'],
    rating: '4.9 (142)',
    image: '/images/products/taasa-client-40.jpeg',
    hoverImage: '/images/products/taasa-client-26.jpeg',
    swatches: ['#fcfcfc', '#eeeeee']
  },
  {
    id: 105,
    category: 'Pants',
    subcategory: 'Flared Palazzos',
    title: 'Haldi Sunshine Flared Artisanal Palazzo Pants',
    price: 1899.00,
    oldPrice: 2499.00,
    badge: '✨ Flared Palazzo',
    isNew: true,
    aesthetic: 'Sangeet Radiance',
    size: ['Free Size'],
    color: 'Yellow',
    colors: ['Sunshine Mustard', 'Pure White'],
    rating: '4.8 (68)',
    image: '/images/products/taasa-client-02.jpeg',
    hoverImage: '/images/products/taasa-client-04.jpeg',
    swatches: ['#fbc02d', '#ffffff']
  }
];

const QUICK_FILTER_PILLS = [
  'All Silhouettes',
  '🌸 Kurtis',
  '👑 Dresses',
  '✨ Co-ord Sets',
  '💃 Two Piece Sets',
  '💖 Plus Size',
  '💎 Pants',
  'Under ₹15,000'
];

const PILL_CATEGORY_MAP = {
  '🌸 Kurtis': 'kurtis',
  '👑 Dresses': 'dresses',
  '✨ Co-ord Sets': 'co-ord-set',
  '💃 Two Piece Sets': 'two-piece-set',
  '💖 Plus Size': 'plus-size-collection',
  '💎 Pants': 'pants'
};

const STORE_CATEGORIES = [
  {
    name: 'Kurtis',
    slug: 'kurtis',
    icon: '🌸',
    label: 'Kurtis & Tunics',
    subtypes: [
      { name: 'Short Kurti', slug: 'short' },
      { name: 'Long Kurti', slug: 'long' },
      { name: 'Sleeveless', slug: 'sleeveless' },
      { name: 'Straight Cut', slug: 'straight' },
      { name: 'Kurti Shirts', slug: 'shirts' },
      { name: 'Tunics', slug: 'tunics' }
    ]
  },
  {
    name: 'Dresses',
    slug: 'dresses',
    icon: '👑',
    label: 'Dresses & Anarkalis',
    subtypes: [
      { name: 'Anarkali', slug: 'anarkali' },
      { name: 'Angrakha', slug: 'angrakha' },
      { name: 'A-Line', slug: 'aline' },
      { name: 'Long Flared Tunics', slug: 'flared' }
    ]
  },
  {
    name: 'Co-ord set',
    slug: 'co-ord-set',
    icon: '✨',
    label: 'Co-ord Sets',
    subtypes: [
      { name: 'Blazer & Trouser', slug: 'blazer' },
      { name: 'Cape & Palazzo', slug: 'cape' },
      { name: 'Printed Silk Co-ords', slug: 'printed' },
      { name: 'Festive Sets', slug: 'festive' }
    ]
  },
  {
    name: 'Two piece set',
    slug: 'two-piece-set',
    icon: '💃',
    label: 'Two Piece Sets',
    subtypes: [
      { name: 'Peplum & Sharara', slug: 'peplum' },
      { name: 'Crop Top & Dhoti', slug: 'dhoti' },
      { name: 'Kurti & Gharara', slug: 'gharara' },
      { name: 'Satin Pairings', slug: 'satin' }
    ]
  },
  {
    name: 'Plus size collection',
    slug: 'plus-size-collection',
    icon: '💖',
    label: 'Plus Size Collection',
    subtypes: [
      { name: 'Curvy Anarkalis', slug: 'curvy' },
      { name: 'Plus Kaftans', slug: 'kaftan' },
      { name: 'Flowy Tunics', slug: 'flowy' },
      { name: 'Comfort Silks', slug: 'comfort' }
    ]
  },
  {
    name: 'Pants',
    slug: 'pants',
    icon: '💎',
    label: 'Luxury Pants',
    subtypes: [
      { name: 'Cigarette Pants', slug: 'cigarette' },
      { name: 'Flared Palazzos', slug: 'palazzo' },
      { name: 'Dhoti Pants', slug: 'dhoti' },
      { name: 'Velvet Trousers', slug: 'velvet' }
    ]
  }
];

const isCategoryMatch = (itemOrSlugCat, targetSlug) => {
  if (!itemOrSlugCat || !targetSlug) return false;
  const c = itemOrSlugCat.toLowerCase().trim();
  const t = targetSlug.toLowerCase().trim();
  if (t === 'kurtis' || t === 'kurti') return c.includes('kurti') || c.includes('kurta') || c === 'kurtis';
  if (t === 'dresses' || t === 'dress') return c.includes('dress') || c.includes('anarkali') || c === 'dresses';
  if (t === 'co-ord-set' || t === 'co-ord' || t === 'coord') return c.includes('co-ord') || c.includes('coord') || c === 'co-ord-set';
  if (t === 'two-piece-set' || t === 'two-piece' || t === 'twopiece') return c.includes('two piece') || c.includes('two-piece') || c === 'two-piece-set';
  if (t === 'plus-size-collection' || t === 'plus-size' || t === 'plus') return c.includes('plus') || c === 'plus-size-collection';
  if (t === 'pants' || t === 'pant') return c.includes('pant') || c.includes('trouser') || c.includes('palazzo') || c === 'pants';
  return c === t;
};

const isSubtypeMatch = (item, subSlug) => {
  if (!item || !subSlug) return false;
  const cleanSub = subSlug.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanItemSub = (item.subcategory || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanTitle = (item.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleanItemSub.includes(cleanSub) || cleanTitle.includes(cleanSub);
};

const Collection = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const subtypeParam = searchParams.get('subtype');
  const [productsList, setProductsList] = useState(ALL_PRODUCTS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortOption, setSortOption] = useState('Featured');
  const [gridColumns, setGridColumns] = useState(4); // 4 or 2 for editorial
  
  // Filter States
  const [selectedSilhouette, setSelectedSilhouette] = useState('All');
  const [selectedAesthetic, setSelectedAesthetic] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [selectedColor, setSelectedColor] = useState('All');
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(100000);
  const [expandedCategories, setExpandedCategories] = useState({});

  // Auto-expand active category in sidebar accordion
  useEffect(() => {
    if (category && category !== 'all') {
      const matchCat = STORE_CATEGORIES.find(c => isCategoryMatch(category, c.slug));
      if (matchCat) {
        setExpandedCategories(prev => ({ ...prev, [matchCat.slug]: true }));
      }
    }
  }, [category]);

  const getCategoryProductCount = (slug) => {
    return productsList.filter(p => isCategoryMatch(p.category, slug)).length;
  };

  const getSubtypeProductCount = (catSlug, subSlug) => {
    return productsList.filter(p => isCategoryMatch(p.category, catSlug) && isSubtypeMatch(p, subSlug)).length;
  };

  // Reset filters automatically when navigation category changes
  useEffect(() => {
    setSelectedAesthetic('All');
    setSelectedSize('All');
    setSelectedColor('All');
    setSelectedSilhouette('All');
    setSelectedMaxPrice(100000);
  }, [category, subtypeParam]);

  // Load products dynamically from REST API
  useEffect(() => {
    getProducts().then(res => {
      if (res?.data && res.data.length > 0) {
        const formatted = res.data.map(p => ({
          id: p.id,
          category: p.category,
          subcategory: p.subcategory || null,
          title: p.title,
          price: p.salePrice || p.basePrice,
          oldPrice: p.salePrice ? p.basePrice : null,
          badge: p.badge,
          isNew: p.isNew !== undefined ? p.isNew : true,
          aesthetic: p.aesthetic || 'Heritage Royalty',
          size: p.variants?.length ? [...new Set(p.variants.map(v => v.size))] : ['Free Size', 'S', 'M', 'L'],
          color: p.variants?.length ? p.variants[0].colorName : 'Pink',
          colors: p.variants?.length ? p.variants.map(v => v.colorName) : ['Pink'],
          rating: `${p.ratingsAvg || '4.9'} (${p.reviewsCount || 100})`,
          image: p.image,
          hoverImage: p.hoverImage || p.image,
          swatches: p.variants?.length 
            ? p.variants.filter((v, i, arr) => arr.findIndex(x => x.colorHex === v.colorHex) === i).map(v => v.colorHex)
            : ['#d81b60', '#880e4f', '#004d40']
        }));
        setProductsList(formatted);
      }
    }).catch(() => {});
  }, []);

  const filteredProducts = useMemo(() => {
    return productsList.filter(item => {
      // 1. Category Filter from Route URL (/collections/:category)
      if (category && category !== 'all') {
        const catLower = category.toLowerCase().trim();
        const itemCatLower = (item.category || '').toLowerCase();
        const itemTitleLower = (item.title || '').toLowerCase();
        const itemBadgeLower = (item.badge || '').toLowerCase();

        if (catLower === 'new' || catLower === 'new-drops' || catLower === 'drops') {
          // If viewing new drops, all products marked isNew
          if (item.isNew === false) return false;
        } else if (catLower === 'sarees') {
          if (!itemCatLower.includes('saree') && !itemTitleLower.includes('saree')) return false;
        } else if (catLower === 'lehengas') {
          if (!itemCatLower.includes('lehenga') && !itemTitleLower.includes('lehenga')) return false;
        } else if (catLower === 'kurtis' || catLower === 'kurti') {
          if (!itemCatLower.includes('kurti') && !itemCatLower.includes('kurta') && !itemTitleLower.includes('kurti') && !itemTitleLower.includes('kurta') && !itemTitleLower.includes('tunic')) return false;
        } else if (catLower === 'dresses' || catLower === 'dress') {
          if (!itemCatLower.includes('dress') && !itemCatLower.includes('anarkali') && !itemCatLower.includes('angrakha') && !itemTitleLower.includes('dress') && !itemTitleLower.includes('anarkali') && !itemTitleLower.includes('angrakha')) return false;
        } else if (catLower === 'co-ord-set' || catLower === 'co-ord' || catLower === 'coord') {
          if (!itemCatLower.includes('co-ord') && !itemCatLower.includes('coord') && !itemTitleLower.includes('co-ord') && !itemTitleLower.includes('blazer')) return false;
        } else if (catLower === 'two-piece-set' || catLower === 'two-piece' || catLower === 'twopiece') {
          if (!itemCatLower.includes('two piece') && !itemCatLower.includes('two-piece') && !itemCatLower.includes('sharara') && !itemTitleLower.includes('two piece') && !itemTitleLower.includes('two-piece')) return false;
        } else if (catLower === 'plus-size-collection' || catLower === 'plus-size' || catLower === 'plus') {
          if (!itemCatLower.includes('plus') && !itemBadgeLower.includes('plus') && !itemBadgeLower.includes('curve') && !itemTitleLower.includes('plus size') && !itemTitleLower.includes('kaftan')) return false;
        } else if (catLower === 'pants' || catLower === 'pant') {
          if (!itemCatLower.includes('pant') && !itemCatLower.includes('trouser') && !itemCatLower.includes('palazzo') && !itemTitleLower.includes('pant') && !itemTitleLower.includes('palazzo') && !itemTitleLower.includes('trouser')) return false;
        } else if (catLower === 'suits') {
          if (
            !itemCatLower.includes('suit') && 
            !itemCatLower.includes('anarkali') && 
            !itemCatLower.includes('kurta') && 
            !itemCatLower.includes('sharara') &&
            !itemTitleLower.includes('suit') && 
            !itemTitleLower.includes('anarkali')
          ) return false;
        } else if (catLower === 'festive') {
          if (
            !itemCatLower.includes('festive') && 
            !itemBadgeLower.includes('festive') && 
            !itemBadgeLower.includes('shaadi') && 
            !itemBadgeLower.includes('heritage')
          ) return false;
        } else if (catLower === 'sale') {
          if (!item.oldPrice && !itemBadgeLower.includes('off') && !itemBadgeLower.includes('%') && !itemBadgeLower.includes('sale')) return false;
        } else {
          if (!itemCatLower.includes(catLower) && !itemTitleLower.includes(catLower)) return false;
        }
      }

      // 2. Quick Silhouette Filter (only applies when viewing all collections without specific category route)
      if ((!category || category === 'all') && selectedSilhouette !== 'All') {
        const silLower = selectedSilhouette.toLowerCase();
        const itemCatLower = (item.category || '').toLowerCase();
        const itemTitleLower = (item.title || '').toLowerCase();
        if (silLower.includes('kurti') && !itemCatLower.includes('kurti') && !itemCatLower.includes('kurta') && !itemTitleLower.includes('kurti') && !itemTitleLower.includes('tunic')) return false;
        if (silLower.includes('dress') && !itemCatLower.includes('dress') && !itemCatLower.includes('anarkali') && !itemTitleLower.includes('dress') && !itemTitleLower.includes('anarkali')) return false;
        if (silLower.includes('co-ord') && !itemCatLower.includes('co-ord') && !itemTitleLower.includes('co-ord')) return false;
        if (silLower.includes('two piece') && !itemCatLower.includes('two piece') && !itemCatLower.includes('two-piece') && !itemCatLower.includes('sharara') && !itemTitleLower.includes('two piece')) return false;
        if (silLower.includes('plus') && !itemCatLower.includes('plus') && !itemTitleLower.includes('plus size') && !itemTitleLower.includes('kaftan')) return false;
        if (silLower.includes('pant') && !itemCatLower.includes('pant') && !itemTitleLower.includes('pant') && !itemTitleLower.includes('palazzo')) return false;
        if (silLower.includes('saree') && !itemCatLower.includes('saree') && !itemTitleLower.includes('saree')) return false;
        if (silLower.includes('lehenga') && !itemCatLower.includes('lehenga') && !itemTitleLower.includes('lehenga')) return false;
      }

      // 2b. Subtype / Subcategory Query Param Filter (e.g. ?subtype=straight or ?subtype=short)
      if (subtypeParam) {
        const cleanSub = subtypeParam.toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanItemSub = (item.subcategory || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanTitle = (item.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!cleanItemSub.includes(cleanSub) && !cleanTitle.includes(cleanSub)) {
          return false;
        }
      }

      // 3. Aesthetic Filter
      if (selectedAesthetic !== 'All' && item.aesthetic !== selectedAesthetic) return false;

      // 4. Size Filter (handles rich sizes like "Free Size (Saree + Blouse)", "S (US 4-6)")
      if (selectedSize !== 'All') {
        const sLower = selectedSize.toLowerCase();
        const itemSizes = Array.isArray(item.size) ? item.size : [item.size];
        const hasSizeMatch = itemSizes.some(sz => {
          const szLower = (sz || '').toLowerCase();
          if (sLower === 'free size') return szLower.includes('free size') || szLower.includes('unstitched');
          if (sLower === 'custom') return szLower.includes('custom') || szLower.includes('bespoke');
          return szLower === sLower || szLower.startsWith(`${sLower} `) || szLower.startsWith(`${sLower}(`) || szLower.includes(` ${sLower} `);
        });
        if (!hasSizeMatch) return false;
      }

      // 5. Color Filter (handles rich names like "Gulabi Rani Pink", "Sindoor Crimson Red")
      if (selectedColor !== 'All') {
        const cLower = selectedColor.toLowerCase();
        const allColors = [
          item.color,
          ...(Array.isArray(item.colors) ? item.colors : [])
        ].filter(Boolean);
        const hasColorMatch = allColors.some(c => (c || '').toLowerCase().includes(cLower));
        if (!hasColorMatch) return false;
      }

      // 6. Price Slider Filter (defaults to 1 Lakh, ignores stale USD values < 5000)
      const effectiveMaxPrice = (selectedMaxPrice && selectedMaxPrice >= 5000) ? selectedMaxPrice : 100000;
      if (item.price > effectiveMaxPrice) return false;

      return true;
    }).sort((a, b) => {
      if (sortOption === 'Price: Low to High') return a.price - b.price;
      if (sortOption === 'Price: High to Low') return b.price - a.price;
      if (sortOption === 'Bestsellers') return b.rating.localeCompare(a.rating);
      return 0;
    });
  }, [productsList, category, subtypeParam, selectedSilhouette, selectedAesthetic, selectedSize, selectedColor, selectedMaxPrice, sortOption]);

  const clearFilters = () => {
    setSelectedAesthetic('All');
    setSelectedSize('All');
    setSelectedColor('All');
    setSelectedSilhouette('All');
    setSelectedMaxPrice(100000);
    if (subtypeParam) {
      navigate(`/collections/${category || 'all'}`);
    }
  };

  const hasActiveFilters = 
    selectedAesthetic !== 'All' || 
    selectedSize !== 'All' || 
    selectedColor !== 'All' || 
    selectedSilhouette !== 'All' || 
    Boolean(subtypeParam) ||
    (selectedMaxPrice && selectedMaxPrice < 100000 && selectedMaxPrice >= 5000);

  const handlePillClick = (pill) => {
    if (pill === 'All Silhouettes') {
      setSelectedSilhouette('All');
      setSelectedMaxPrice(100000);
      navigate('/collections/all');
      return;
    }

    if (pill.includes('Under ₹15,000')) {
      setSelectedMaxPrice(prev => (prev === 15000 ? 100000 : 15000));
      return;
    }

    const targetCat = PILL_CATEGORY_MAP[pill];
    if (targetCat) {
      const currentCatLower = (category || '').toLowerCase();
      const isCurrentlyActive = 
        (targetCat === 'kurtis' && (currentCatLower === 'kurtis' || currentCatLower === 'kurti')) ||
        (targetCat === 'dresses' && (currentCatLower === 'dresses' || currentCatLower === 'dress')) ||
        (targetCat === 'co-ord-set' && (currentCatLower === 'co-ord-set' || currentCatLower === 'co-ord' || currentCatLower === 'coord')) ||
        (targetCat === 'two-piece-set' && (currentCatLower === 'two-piece-set' || currentCatLower === 'two-piece' || currentCatLower === 'twopiece')) ||
        (targetCat === 'plus-size-collection' && (currentCatLower === 'plus-size-collection' || currentCatLower === 'plus-size' || currentCatLower === 'plus')) ||
        (targetCat === 'pants' && (currentCatLower === 'pants' || currentCatLower === 'pant'));

      if (isCurrentlyActive) {
        if (subtypeParam) {
          // Clear subcategory filter to view all items in this category
          navigate(`/collections/${targetCat}`);
        } else {
          // Toggle off back to all silhouettes
          navigate('/collections/all');
        }
      } else {
        // Switch cleanly to the chosen category
        navigate(`/collections/${targetCat}`);
      }
    }
  };

  const getIsPillActive = (pill) => {
    if (pill === 'All Silhouettes') {
      return (!category || category === 'all') && selectedSilhouette === 'All' && selectedMaxPrice >= 100000;
    }
    if (pill.includes('Under ₹15,000')) {
      return selectedMaxPrice === 15000;
    }
    const targetCat = PILL_CATEGORY_MAP[pill];
    if (!targetCat || !category) return false;
    const currentCatLower = category.toLowerCase();
    if (targetCat === 'kurtis') return currentCatLower === 'kurtis' || currentCatLower === 'kurti';
    if (targetCat === 'dresses') return currentCatLower === 'dresses' || currentCatLower === 'dress';
    if (targetCat === 'co-ord-set') return currentCatLower === 'co-ord-set' || currentCatLower === 'co-ord' || currentCatLower === 'coord';
    if (targetCat === 'two-piece-set') return currentCatLower === 'two-piece-set' || currentCatLower === 'two-piece' || currentCatLower === 'twopiece';
    if (targetCat === 'plus-size-collection') return currentCatLower === 'plus-size-collection' || currentCatLower === 'plus-size' || currentCatLower === 'plus';
    if (targetCat === 'pants') return currentCatLower === 'pants' || currentCatLower === 'pant';
    return currentCatLower === targetCat;
  };

  const getPageTitle = () => {
    if (!category || category === 'all') return 'All Royal Silhouettes';
    if (category === 'new' || category === 'new-drops') return "Royal New Drops '26";
    if (category === 'sale') return 'Festive Couture Sale';
    if (category === 'sarees') return 'Pure Handloom Sarees';
    if (category === 'lehengas') return 'Bridal & Shaadi Lehengas';
    if (category === 'kurtis') return 'Luxury Kurtis & Tunics Collection';
    if (category === 'dresses') return 'Artisanal Dresses & Anarkalis';
    if (category === 'co-ord-set' || category === 'coord') return 'Modern Silk Co-ord Sets';
    if (category === 'two-piece-set') return 'Two Piece Luxury Ensembles';
    if (category === 'plus-size-collection' || category === 'plus-size') return 'Plus Size Couture Collection';
    if (category === 'pants') return 'Artisanal Luxury Pants & Bottoms';
    if (category === 'suits') return 'Silk Anarkalis & Festive Suits';
    if (category === 'festive') return 'The Royal Festive Edit';
    return `${category.charAt(0).toUpperCase() + category.slice(1)} Collection`;
  };

  return (
    <div className="collection-page">
      
      {/* 1. Aesthetic Banner Header */}
      <div className="collection-banner-header">
        <div className="container text-center">
          <span className="collection-tag">👑 THE ROYAL SHAADI & TROUSSEAU EDIT 2026</span>
          <h1 className="collection-main-title">
            {getPageTitle()}
          </h1>
          <p className="collection-subtitle">
            Handcrafted pure Banarasi Katan silks, regal heirloom bridal lehengas, and artisanal zardozi ensembles for the modern Indian queen.
          </p>

          {/* Quick Filter Tag Pills */}
          <div className="quick-tags-container">
            {QUICK_FILTER_PILLS.map((pill) => {
              const isPillActive = getIsPillActive(pill);

              return (
                <button 
                  key={pill} 
                  className={`quick-pill ${isPillActive ? 'active' : ''}`}
                  onClick={() => handlePillClick(pill)}
                >
                  {pill}
                </button>
              );
            })}
          </div>

          {/* Subcategory Filter Indicator (if active) */}
          {subtypeParam && (
            <div>
              <div className="active-subtype-bar">
                <span className="active-subtype-text">
                  Filtered by Subcategory: <strong>{subtypeParam.replace('-', ' ').toUpperCase()}</strong>
                </span>
                <button 
                  className="clear-subtype-pill"
                  onClick={() => navigate(`/collections/${category || 'all'}`)}
                  title="Clear subcategory filter"
                >
                  <X size={13} />
                  <span>Show All {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Pieces'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Main Collection Catalog */}
      <div className="container collection-layout-container">
        
        {/* Sidebar Filters */}
        <aside className={`collection-filter-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-mobile-header">
            <h3>Filter Royal Attires</h3>
            <button className="icon-btn" onClick={() => setIsSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {hasActiveFilters && (
            <div className="active-filters-summary">
              <span>Filters applied</span>
              <button onClick={clearFilters} className="btn-clear-all">Reset All</button>
            </div>
          )}

          {/* 1. Category & Subcategory Sidebar Tree */}
          <div className="filter-block">
            <div className="filter-heading-between">
              <h4 className="filter-heading">Categories & Styles</h4>
              {category && category !== 'all' && (
                <button 
                  onClick={() => {
                    clearFilters();
                    navigate('/collections/all');
                  }} 
                  className="btn-clear-all"
                  title="View all categories"
                >
                  View All
                </button>
              )}
            </div>

            <div className="category-tree-list">
              {/* All Categories Option */}
              <div className={`category-tree-row ${(!category || category === 'all') ? 'active' : ''}`}>
                <button 
                  className="category-tree-btn"
                  onClick={() => {
                    clearFilters();
                    navigate('/collections/all');
                  }}
                >
                  <span className="category-tree-label">
                    <span>✨</span>
                    <span>All Categories</span>
                  </span>
                  <span className="category-count-badge">{productsList.length}</span>
                </button>
              </div>

              {/* Individual Categories with Subcategory Accordion */}
              {STORE_CATEGORIES.map(cat => {
                const isCatActive = category && isCategoryMatch(category, cat.slug);
                const isExpanded = expandedCategories[cat.slug] || isCatActive;
                const catCount = getCategoryProductCount(cat.slug);

                return (
                  <div key={cat.slug} className="category-tree-group">
                    <div className={`category-tree-row ${isCatActive ? 'active' : ''}`}>
                      <button 
                        className="category-tree-btn"
                        onClick={() => {
                          if (isCatActive && !subtypeParam) {
                            navigate('/collections/all');
                          } else {
                            navigate(`/collections/${cat.slug}`);
                            setExpandedCategories(prev => ({ ...prev, [cat.slug]: true }));
                          }
                        }}
                      >
                        <span className="category-tree-label">
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </span>
                        <span className="category-count-badge">{catCount}</span>
                      </button>

                      <button 
                        className="category-chevron-toggle"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedCategories(prev => ({ ...prev, [cat.slug]: !isExpanded }));
                        }}
                        aria-label={`Toggle ${cat.name} subcategories`}
                      >
                        <ChevronDown 
                          size={14} 
                          style={{ 
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s' 
                          }} 
                        />
                      </button>
                    </div>

                    {/* Subcategories Accordion Content */}
                    {isExpanded && cat.subtypes && cat.subtypes.length > 0 && (
                      <div className="subcategory-tree-list">
                        <button 
                          className={`subcategory-tree-btn ${isCatActive && !subtypeParam ? 'active' : ''}`}
                          onClick={() => navigate(`/collections/${cat.slug}`)}
                        >
                          <span>• All {cat.name}</span>
                          <span className="subcategory-count-badge">({catCount})</span>
                        </button>

                        {cat.subtypes.map(sub => {
                          const isSubActive = isCatActive && subtypeParam && (
                            subtypeParam.toLowerCase().replace(/[^a-z0-9]/g, '') === sub.slug.replace(/[^a-z0-9]/g, '') ||
                            sub.name.toLowerCase().includes(subtypeParam.toLowerCase())
                          );
                          const subCount = getSubtypeProductCount(cat.slug, sub.slug);

                          return (
                            <button 
                              key={sub.slug}
                              className={`subcategory-tree-btn ${isSubActive ? 'active' : ''}`}
                              onClick={() => {
                                if (isSubActive) {
                                  navigate(`/collections/${cat.slug}`);
                                } else {
                                  navigate(`/collections/${cat.slug}?subtype=${sub.slug}`);
                                }
                              }}
                            >
                              <span>{sub.name}</span>
                              <span className="subcategory-count-badge">
                                {isSubActive ? <Check size={12} /> : `(${subCount})`}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Aesthetic Vibe Filter */}
          <div className="filter-block">
            <h4 className="filter-heading">Royal Aesthetic</h4>
            <div className="aesthetic-filter-list">
              {['All', 'Heritage Royalty', 'Bridal Opulence', 'Mughal Grace', 'Pastel Poetry', 'Sangeet Radiance'].map(a => (
                <button 
                  key={a}
                  className={`aesthetic-btn ${selectedAesthetic === a ? 'active' : ''}`}
                  onClick={() => setSelectedAesthetic(a)}
                >
                  <span>{a === 'All' ? '✨ All Royal Aesthetics' : a}</span>
                  {selectedAesthetic === a && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="filter-block">
            <h4 className="filter-heading">Size & Fitting</h4>
            <div className="size-filter-grid">
              {['All', 'Free Size', 'XS', 'S', 'M', 'L', 'XL', 'Custom'].map(s => (
                <button 
                  key={s}
                  className={`size-filter-btn ${selectedSize === s ? 'active' : ''}`}
                  onClick={() => setSelectedSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="filter-block">
            <h4 className="filter-heading">Color Palette</h4>
            <div className="color-swatches-grid">
              {[
                { name: 'All', hex: '#ffffff', label: 'All' },
                { name: 'Pink', hex: '#e91e63', label: 'Rani Pink' },
                { name: 'Red', hex: '#880e4f', label: 'Crimson Red' },
                { name: 'Green', hex: '#004d40', label: 'Emerald' },
                { name: 'Yellow', hex: '#fbc02d', label: 'Haldi Gold' },
                { name: 'Ivory', hex: '#fffaf0', label: 'Ivory Zari' },
                { name: 'Burgundy', hex: '#4a0e17', label: 'Royal Wine' }
              ].map(c => (
                <button 
                  key={c.name}
                  className={`color-filter-swatch ${selectedColor === c.name ? 'active' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  title={c.label}
                  onClick={() => setSelectedColor(c.name)}
                >
                  {selectedColor === c.name && <Check size={12} color={c.name === 'Ivory' || c.name === 'Yellow' || c.name === 'All' ? '#1a1118' : '#fff'} />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="filter-block">
            <div className="filter-heading-between">
              <h4 className="filter-heading">Max Budget</h4>
              <span className="price-tag-val">{formatINR(selectedMaxPrice >= 5000 ? selectedMaxPrice : 100000)}</span>
            </div>
            <input 
              type="range" 
              min="5000" 
              max="100000" 
              step="1000"
              value={selectedMaxPrice >= 5000 ? selectedMaxPrice : 100000} 
              onChange={(e) => setSelectedMaxPrice(Number(e.target.value))}
              className="price-slider"
            />
          </div>

        </aside>

        {/* Product Catalog Grid & Top Controls */}
        <div className="collection-main-content">
          
          <div className="collection-controls-bar">
            
            {/* Filter Toggle Mobile */}
            <button 
              className="btn btn-secondary filter-open-trigger"
              onClick={() => setIsSidebarOpen(true)}
            >
              <SlidersHorizontal size={16} /> Filters {hasActiveFilters && '(Active)'}
            </button>

            <span className="products-count-label">
              Showing <strong>{filteredProducts.length}</strong> styles
            </span>

            {/* Layout switchers & sorting */}
            <div className="controls-right-group">
              
              {/* Grid Column Switcher (Desktop) */}
              <div className="grid-switcher desktop-only">
                <button 
                  className={`grid-icon-btn ${gridColumns === 2 ? 'active' : ''}`}
                  onClick={() => setGridColumns(2)}
                  title="Editorial 2-Column View"
                >
                  <Grid2X2 size={18} />
                </button>
                <button 
                  className={`grid-icon-btn ${gridColumns === 4 ? 'active' : ''}`}
                  onClick={() => setGridColumns(4)}
                  title="Compact 4-Column Grid"
                >
                  <LayoutGrid size={18} />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="sort-dropdown-wrap">
                <select 
                  value={sortOption} 
                  onChange={(e) => setSortOption(e.target.value)}
                  className="sort-select"
                >
                  <option value="Featured">Featured ✨</option>
                  <option value="Bestsellers">Bestseller Rating 💖</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                </select>
                <ChevronDown size={14} className="sort-chevron" />
              </div>

            </div>

          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="no-products-state">
              <span className="no-products-sparkle">🌸</span>
              <h3>No styles match your filters</h3>
              <p>Try adjusting your color, size, or price filters to see more cute pieces.</p>
              <div className="empty-state-actions">
                <button 
                  className="btn btn-cute-pink" 
                  onClick={() => {
                    clearFilters();
                    navigate(`/collections/${category && category !== 'all' ? category : 'all'}`);
                  }}
                >
                  Reset Active Filters 💖
                </button>
                {category && category !== 'all' && (
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => {
                      clearFilters();
                      navigate('/collections/all');
                    }}
                  >
                    View All Collections ✨
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className={`grid ${gridColumns === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-6 mt-6`}>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Collection;
