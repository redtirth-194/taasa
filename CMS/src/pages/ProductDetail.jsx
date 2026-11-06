import React, {  useState, useEffect  } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  Heart, 
  Minus, 
  Plus, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Ruler, 
  X,
  Check
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import FitEstimatorDrawer from '../components/FitEstimatorDrawer';
import { useCart } from '../context/CartContext';
import { getProductById, submitReview, getProducts } from '../services/api';
import { formatINR } from '../utils/currency';
import './ProductDetail.css';

// Rich Product Catalog Fallback Data
const PRODUCTS_MAP = {
  81: {
    id: 81,
    title: 'Noorani Ivory Threadwork Short Kurti',
    category: 'Kurtis',
    price: 2499.00,
    oldPrice: 3299.00,
    rating: 4.9,
    reviewsCount: 88,
    badge: '🌸 Short Kurti Bestseller',
    stockLeft: 8,
    colors: [
      { name: 'Ivory Cream', hex: '#fdfbf7', image: '/images/products/taasa-client-26.jpeg' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      '/images/products/taasa-client-26.jpeg',
      '/images/products/taasa-client-25.jpeg'
    ],
    description: 'Crafted in breathable textured slub cotton with intricate monochrome black thread embroidery along the notch collar, front placket, and three-quarter sleeves. Features comfortable side slits and relaxed comfort fit.',
    stylingNotes: 'Pair with our tailored ivory cigarette pants or comfort palazzos and oxidised silver earrings for an effortless fusion look.',
    fabricCare: '100% Breathable Textured Slub Cotton. Gentle machine wash cold or dry clean. Warm iron on reverse side.'
  },
  90: {
    id: 90,
    title: 'Noor Rust Orange Handcrafted Flared Anarkali Dress',
    category: 'Dresses',
    price: 5499.00,
    oldPrice: 6999.00,
    rating: 5.0,
    reviewsCount: 114,
    badge: '👑 Royal Flare Masterpiece',
    stockLeft: 5,
    colors: [
      { name: 'Rust Terracotta', hex: '#c05c36', image: '/images/products/taasa-client-01.jpeg' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      '/images/products/taasa-client-01.jpeg',
      '/images/products/taasa-client-06.jpeg',
      '/images/products/taasa-client-07.jpeg'
    ],
    description: 'Tailored in breathable pure festive slub cotton and chanderi silk with intricate zardozi threadwork on neckline and tiered sweeping flare. Ideal for royal celebrations and pujas.',
    stylingNotes: 'Pair with chandbali earrings, embroidered juttis, and a raw silk clutch for festive evenings.',
    fabricCare: 'Pure Slub Cotton Silk with Fine Gold Thread Zari & Cotton Mulmul Lining. Dry clean recommended.'
  },
  97: {
    id: 97,
    title: 'Terracotta Rust Embroidered Peplum Co-ord Set',
    category: 'Co-ord set',
    price: 3899.00,
    oldPrice: 4999.00,
    rating: 5.0,
    reviewsCount: 86,
    badge: '✨ Trending Co-ord',
    stockLeft: 6,
    colors: [
      { name: 'Terracotta Rust', hex: '#bf4e30', image: '/images/products/taasa-client-08.jpeg' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      '/images/products/taasa-client-08.jpeg',
      '/images/products/taasa-client-34.jpeg',
      '/images/products/taasa-client-37.jpeg'
    ],
    description: 'Contemporary two-piece set featuring a pleated peplum silhouette tunic with botanical white thread embroidery on flared sleeves paired with tailored straight-leg trousers.',
    stylingNotes: 'Complete with nude kitten heels, delicate gold hoops, and a minimalist tote bag.',
    fabricCare: 'Rich Slub Cotton Linen with Hand-Embroidery Accents. Dry clean or gentle hand wash.'
  },
  99: {
    id: 99,
    title: 'Purple Elegance Pleated Kurti & Trouser Two-Piece Set',
    category: 'Two piece set',
    price: 3499.00,
    oldPrice: 4499.00,
    rating: 4.9,
    reviewsCount: 67,
    badge: '💜 Signature Duo',
    stockLeft: 7,
    colors: [
      { name: 'Violet Kurti & White Pants', hex: '#7b1fa2', image: '/images/products/taasa-client-22.jpeg' }
    ],
    sizes: ['S', 'M', 'L'],
    images: [
      '/images/products/taasa-client-22.jpeg',
      '/images/products/taasa-client-23.jpeg'
    ],
    description: 'Signature Taasa coordinated pair: graceful violet kurti with delicate bodice pleats and comfortable tailored white cotton pants.',
    stylingNotes: 'Simple, stylish, elegant. Accentuate with dainty lilac stone earrings and flat sandals.',
    fabricCare: 'Pure Cotton with Breathable Weave & Tailored Bottoms. Gentle machine wash cold.'
  },
  83: {
    id: 83,
    title: 'Rajkumari Wine Pure Silk Straight Cut Kurti Suit',
    category: 'Kurtis',
    price: 6199.00,
    oldPrice: 7999.00,
    rating: 5.0,
    reviewsCount: 95,
    badge: '👑 Royal Silk Edit',
    stockLeft: 4,
    colors: [
      { name: 'Imperial Wine', hex: '#4a154b', image: '/images/products/taasa-client-31.jpeg' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      '/images/products/taasa-client-31.jpeg',
      '/images/products/taasa-client-33.jpeg',
      '/images/products/taasa-client-32.jpeg'
    ],
    description: 'Lustrous deep purple mulberry silk long straight kurti embellished with intricate antique gold zari borders on daman, neckline, and sleeves. Accompanied by a matching sheer dupatta.',
    stylingNotes: 'Pair with Kundan polki jhumkas and gold block heels for formal evening banquets.',
    fabricCare: 'Pure Mulberry Silk with Antique Gold Zari Weave & Mulmul Lining. Strictly dry clean only.'
  },
  93: {
    id: 93,
    title: 'Indigo Neel Block-Print Flared Angrakha Dress',
    category: 'Dresses',
    price: 4199.00,
    oldPrice: 5499.00,
    rating: 4.9,
    reviewsCount: 68,
    badge: '✨ Handblock Angrakha',
    stockLeft: 5,
    colors: [
      { name: 'Indigo Dabu Blue', hex: '#23395d', image: '/images/products/taasa-client-17.jpeg' }
    ],
    sizes: ['S', 'M', 'L'],
    images: [
      '/images/products/taasa-client-17.jpeg',
      '/images/products/taasa-client-15.jpeg'
    ],
    description: 'Timeless Angrakha crossover silhouette in authentic indigo handblock dabu print with side tie-up tassel dori and tiered flare.',
    stylingNotes: 'Style with silver oxidised chokers, fabric kolhapuris, and a boho sling bag.',
    fabricCare: '100% Bagru Handblock Printed Pure Cotton. Gentle cold wash separately.'
  },
  86: {
    id: 86,
    title: 'Neelambari Botanical Embroidered Kurti Shirt',
    category: 'Kurtis',
    price: 2999.00,
    oldPrice: 3899.00,
    rating: 4.9,
    reviewsCount: 56,
    badge: '🤍 Shirt Kurti Style',
    stockLeft: 8,
    colors: [
      { name: 'Midnight Navy', hex: '#1b2a47', image: '/images/products/taasa-client-40.jpeg' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      '/images/products/taasa-client-40.jpeg',
      '/images/products/taasa-client-41.jpeg'
    ],
    description: 'Modern tailored kurti shirt in midnight navy cotton with delicate white botanical floral embroidery down the button placket, point collar, and turned cuffs.',
    stylingNotes: 'Pair with ivory cigarette trousers and loafers for crisp boardroom authority.',
    fabricCare: 'Premium 100% Long-Staple Cotton. Machine wash cold on gentle cycle.'
  },
  104: {
    id: 104,
    title: 'Classic Ivory Tailored Cotton Cigarette Pants',
    category: 'Pants',
    price: 1499.00,
    oldPrice: 1999.00,
    rating: 4.9,
    reviewsCount: 142,
    badge: '💎 Atelier Tailored',
    stockLeft: 15,
    colors: [
      { name: 'Classic Ivory', hex: '#fcfcfc', image: '/images/products/taasa-client-40.jpeg' }
    ],
    sizes: ['S', 'M', 'L'],
    images: [
      '/images/products/taasa-client-40.jpeg',
      '/images/products/taasa-client-26.jpeg'
    ],
    description: 'Versatile atelier-stitched pure combed cotton pants featuring elasticated back waist, front flat band, deep side pockets, and ankle slits.',
    stylingNotes: 'The foundational bottom piece that pairs effortlessly with all kurtis, shirts, and tunics.',
    fabricCare: '100% High-Grade Combed Cotton with Anti-Translucency Weave. Machine wash gentle cold.'
  }
};

// Aliases for fallback routing (both old and new IDs)
[1, 2, 3, 4, 5, 6, 7, 8, 17, 18, 19, 20, 21, 22, 23, 24].forEach((oldId, index) => {
  const targetIds = [81, 90, 97, 99, 83, 93, 86, 104];
  PRODUCTS_MAP[oldId] = PRODUCTS_MAP[targetIds[index % targetIds.length]];
});

const RELATED_PRODUCTS = [
  {
    id: 90,
    category: 'Dresses',
    title: 'Noor Rust Orange Flared Anarkali Dress',
    price: 5499.00,
    oldPrice: 6999.00,
    badge: '👑 Royal Flare Masterpiece',
    rating: '5.0 (114)',
    image: '/images/products/taasa-client-01.jpeg'
  },
  {
    id: 97,
    category: 'Co-ord set',
    title: 'Terracotta Rust Embroidered Peplum Co-ord Set',
    price: 3899.00,
    oldPrice: 4999.00,
    badge: '✨ Trending Co-ord',
    rating: '5.0 (86)',
    image: '/images/products/taasa-client-08.jpeg'
  },
  {
    id: 99,
    category: 'Two piece set',
    title: 'Purple Elegance Pleated Two-Piece Set',
    price: 3499.00,
    oldPrice: 4499.00,
    badge: '💜 Signature Duo',
    rating: '4.9 (67)',
    image: '/images/products/taasa-client-22.jpeg'
  },
  {
    id: 81,
    category: 'Kurtis',
    title: 'Noorani Ivory Threadwork Short Kurti',
    price: 2499.00,
    oldPrice: 3299.00,
    badge: '🌸 Short Kurti Bestseller',
    rating: '4.9 (88)',
    image: '/images/products/taasa-client-26.jpeg'
  }
];

const ProductDetail = () => {
  const { id } = useParams();
  const defaultProduct = PRODUCTS_MAP[id] || PRODUCTS_MAP[81] || PRODUCTS_MAP[90];
  const [product, setProduct] = useState(defaultProduct);
  const [relatedList, setRelatedList] = useState(RELATED_PRODUCTS);

  
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const isWishlisted = isInWishlist(product.id);

  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState('S');
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState('styling');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isFitEstimatorOpen, setIsFitEstimatorOpen] = useState(false);

  // Reviews Dynamic State
  const [reviews, setReviews] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewToast, setReviewToast] = useState(null);

  useEffect(() => {
    const fallback = PRODUCTS_MAP[id] || PRODUCTS_MAP[17];
    if (id) {
      getProductById(id).then(res => {
        if (res?.data) {
          const apiP = res.data;
          const colors = apiP.variants?.length
            ? apiP.variants.filter((v, i, arr) => arr.findIndex(x => x.colorName === v.colorName) === i).map(v => ({ name: v.colorName, hex: v.colorHex, image: v.image || apiP.image }))
            : fallback.colors;
          const sizes = apiP.variants?.length
            ? [...new Set(apiP.variants.map(v => v.size))]
            : fallback.sizes;
          const images = [apiP.image, apiP.hoverImage].filter(Boolean);

          const formatted = {
            id: apiP.id,
            title: apiP.title,
            category: apiP.category,
            subcategory: apiP.subcategory || null,
            price: apiP.salePrice || apiP.basePrice,
            oldPrice: apiP.salePrice ? apiP.basePrice : null,
            rating: apiP.ratingsAvg,
            reviewsCount: apiP.reviewsCount,
            badge: apiP.badge,
            stockLeft: apiP.stockQuantity,
            colors: colors.length ? colors : fallback.colors,
            sizes: sizes.length ? sizes : fallback.sizes,
            images: images.length ? images : fallback.images,
            description: apiP.description,
            stylingNotes: fallback.stylingNotes,
            fabricCare: apiP.fabric ? `${apiP.fabric}. ${apiP.care || ''}` : fallback.fabricCare
          };

          setProduct(formatted);
          if (apiP.reviews) {
            setReviews(apiP.reviews);
          }
          setActiveImage(formatted.images[0]);
          setSelectedColor(formatted.colors[0]);
          setSelectedSize(formatted.sizes[0] || 'S');
        }
      }).catch(() => {});

      getProducts().then(res => {
        if (res?.data && res.data.length > 0) {
          const others = res.data.filter(p => String(p.id) !== String(id)).slice(0, 4).map(p => ({
            id: p.id,
            category: p.category,
            title: p.title,
            price: p.salePrice || p.basePrice,
            oldPrice: p.salePrice ? p.basePrice : null,
            badge: p.badge,
            rating: `${p.ratingsAvg || '4.9'} (${p.reviewsCount || 80})`,
            image: p.image
          }));
          if (others.length > 0) setRelatedList(others);
        }
      }).catch(() => {});
    }
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewBody.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await submitReview({
        productId: product.id,
        authorName: reviewAuthor.trim(),
        authorEmail: reviewEmail.trim() || 'muse@taasa.com',
        rating: reviewRating,
        title: reviewTitle.trim() || 'Ethereal piece! ✨',
        body: reviewBody.trim()
      });

      if (res?.data) {
        setReviews([res.data, ...reviews]);
        setProduct(prev => {
          const newCount = (prev.reviewsCount || 0) + 1;
          const newAvg = Number((((prev.rating || 5) * (prev.reviewsCount || 1) + reviewRating) / (newCount)).toFixed(1));
          return {
            ...prev,
            reviewsCount: newCount,
            rating: newAvg
          };
        });
        setReviewToast('Thank you for sharing your experience, muse! 💖');
        setTimeout(() => setReviewToast(null), 3000);
      }
      setIsReviewModalOpen(false);
      setReviewAuthor('');
      setReviewEmail('');
      setReviewTitle('');
      setReviewBody('');
      setReviewRating(5);
    } catch (err) {
      alert(err.message || 'Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor.name);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const toggleAccordion = (tab) => {
    setActiveAccordion(activeAccordion === tab ? null : tab);
  };

  return (
    <div className="product-detail-page">
      
      {/* Breadcrumbs */}
      <div className="container breadcrumbs-nav">
        <Link to="/">Home</Link>
        <span className="crumb-sep">/</span>
        <Link to="/collections/all">Collections</Link>
        <span className="crumb-sep">/</span>
        <span className="crumb-active">{product.title}</span>
      </div>

      <div className="container pdp-main-grid">
        
        {/* Left: Sticky Media Gallery */}
        <div className="pdp-gallery-col">
          <div className="pdp-thumbnails-strip">
            {product.images.map((img, idx) => (
              <button 
                key={idx} 
                className={`thumb-btn ${activeImage === img ? 'active' : ''}`}
                onClick={() => setActiveImage(img)}
              >
                <img src={img} alt={`Preview ${idx + 1}`} />
              </button>
            ))}
          </div>

          <div className="pdp-hero-image-wrap">
            <span className="pdp-float-badge">{product.badge}</span>
            <button 
              className={`pdp-wishlist-float ${isWishlisted ? 'active' : ''}`}
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
            <img src={activeImage} alt={product.title} className="pdp-active-img" />
          </div>
        </div>

        {/* Right: Product Purchase Info */}
        <div className="pdp-info-col">
          
          <div className="pdp-header-meta">
            <span className="pdp-category-pill">
              {product.category}{product.subcategory ? ` • ${product.subcategory}` : ''}
            </span>
            <div className="pdp-rating-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#ffb703" color="#ffb703" />
              ))}
              <span>{product.rating} ({product.reviewsCount} reviews)</span>
            </div>
          </div>

          <h1 className="pdp-title">{product.title}</h1>

          {/* Pricing */}
          <div className="pdp-price-row">
            <span className="pdp-price">{formatINR(product.price)}</span>
            {product.oldPrice && <span className="pdp-old-price">{formatINR(product.oldPrice)}</span>}
            {product.oldPrice && (
              <span className="pdp-save-badge">
                Save {formatINR(product.oldPrice - product.price)}
              </span>
            )}
          </div>

          {/* Urgency Stock Alert */}
          {product.stockLeft && (
            <div className="stock-urgency-box">
              <span className="urgency-flame">🔥</span>
              <span>Selling fast! Only <strong>{product.stockLeft} pieces left</strong> in this colorway.</span>
            </div>
          )}

          <p className="pdp-short-desc">{product.description}</p>

          <div className="pdp-divider"></div>

          {/* Color Selector */}
          <div className="pdp-option-block">
            <div className="option-label-row">
              <span className="option-title">Color Shade:</span>
              <span className="option-selected-val">{selectedColor.name}</span>
            </div>
            <div className="color-options-row">
              {product.colors.map(color => (
                <button 
                  key={color.name}
                  className={`pdp-color-swatch ${selectedColor.name === color.name ? 'active' : ''}`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => {
                    setSelectedColor(color);
                    setActiveImage(color.image);
                  }}
                  title={color.name}
                >
                  {selectedColor.name === color.name && (
                    <Check size={14} color={color.hex === '#ffffff' ? '#1c141a' : '#fff'} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector with Size Guide */}
          <div className="pdp-option-block mt-4">
            <div className="option-label-row">
              <span className="option-title">Select Size:</span>
              <div className="size-actions-cluster">
                <button className="fit-finder-trigger-btn" onClick={() => setIsFitEstimatorOpen(true)}>
                  <Sparkles size={12} className="text-rose-deep animate-float" />
                  <span>AI Fit Finder</span>
                </button>
                <button className="size-guide-link" onClick={() => setIsSizeGuideOpen(true)}>
                  <Ruler size={13} /> Size Chart
                </button>
              </div>
            </div>
            <div className="size-options-row">
              {product.sizes.map(size => (
                <button 
                  key={size}
                  className={`pdp-size-btn ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Add to Cart Action */}
          <div className="pdp-action-group mt-6">
            
            <div className="quantity-counter-box">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity">
                <Minus size={16} />
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity">
                <Plus size={16} />
              </button>
            </div>

            <button className="btn btn-cute-pink pdp-add-bag-btn" onClick={handleAddToCart}>
              <span>ADD TO BAG 💖 • {formatINR(product.price * quantity)}</span>
            </button>

          </div>

          {/* Trust Guarantees */}
          <div className="pdp-perks-list mt-6">
            <div className="pdp-perk-item">
              <Truck size={18} className="text-rose" />
              <span>Free Express Delivery across India on ₹4,999+</span>
            </div>
            <div className="pdp-perk-item">
              <Sparkles size={18} className="text-rose" />
              <span>Complimentary luxury silk pouch with your order</span>
            </div>
            <div className="pdp-perk-item">
              <RotateCcw size={18} className="text-rose" />
              <span>30-Day Effortless Returns & Exchanges</span>
            </div>
          </div>

          <div className="pdp-divider"></div>

          {/* Accordion Information */}
          <div className="pdp-accordions-group">
            
            <div className="accordion-item">
              <button className="accordion-trigger" onClick={() => toggleAccordion('styling')}>
                <span>✨ Styling Notes & Aesthetic Vibe</span>
                {activeAccordion === 'styling' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {activeAccordion === 'styling' && (
                <div className="accordion-content animate-fade-in">
                  <p>{product.stylingNotes}</p>
                </div>
              )}
            </div>

            <div className="accordion-item">
              <button className="accordion-trigger" onClick={() => toggleAccordion('fabric')}>
                <span>🌿 Fabric, Materials & Care</span>
                {activeAccordion === 'fabric' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {activeAccordion === 'fabric' && (
                <div className="accordion-content animate-fade-in">
                  <p>{product.fabricCare}</p>
                </div>
              )}
            </div>

            <div className="accordion-item">
              <button className="accordion-trigger" onClick={() => toggleAccordion('shipping')}>
                <span>💌 Shipping & Express Delivery</span>
                {activeAccordion === 'shipping' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {activeAccordion === 'shipping' && (
                <div className="accordion-content animate-fade-in">
                  <p>All orders are hand-packaged in our signature gift box and dispatched within 24 hours. Express 2-day delivery available at checkout.</p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="size-guide-backdrop" onClick={() => setIsSizeGuideOpen(false)}>
          <div className="size-guide-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🌸 Women's Size & Fit Guide</h3>
              <button className="icon-btn" onClick={() => setIsSizeGuideOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-desc">All Taasa garments are crafted to standard US sizing with flexible tailoring.</p>
              <table className="size-chart-table">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Bust (in)</th>
                    <th>Waist (in)</th>
                    <th>Hips (in)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>XS (US 0-2)</td><td>31-33"</td><td>24-25"</td><td>34-35"</td></tr>
                  <tr><td>S (US 4-6)</td><td>34-35"</td><td>26-27"</td><td>36-37"</td></tr>
                  <tr><td>M (US 8-10)</td><td>36-37"</td><td>28-29"</td><td>38-39"</td></tr>
                  <tr><td>L (US 12)</td><td>38-40"</td><td>30-32"</td><td>40-42"</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* AI Fit & Size Finder Drawer */}
      <FitEstimatorDrawer 
        isOpen={isFitEstimatorOpen}
        onClose={() => setIsFitEstimatorOpen(false)}
        onSelectSize={(sz) => setSelectedSize(sz)}
        currentSelectedSize={selectedSize}
      />

      {/* Muse Reviews & Ratings Section */}
      <section className="container pdp-reviews-section mt-20">
        <div className="reviews-header-block">
          <div>
            <span className="section-tag">🌸 VERIFIED MUSE EXPERIENCES</span>
            <h2 className="section-title">Customer Reviews & Ratings</h2>
            <div className="aggregate-score-badge">
              <span className="huge-rating-num">{product.rating || '4.9'}</span>
              <div className="aggregate-stars-wrap">
                <div className="stars-cluster">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      fill={i < Math.round(product.rating || 5) ? "#ffb703" : "#e9ecef"} 
                      color={i < Math.round(product.rating || 5) ? "#ffb703" : "#ced4da"} 
                    />
                  ))}
                </div>
                <span className="aggregate-count">Based on {reviews.length || product.reviewsCount || 0} verified customer reviews</span>
              </div>
            </div>
          </div>

          <button 
            className="btn btn-primary btn-write-review"
            onClick={() => setIsReviewModalOpen(true)}
          >
            <Sparkles size={16} />
            <span>Write a Muse Review</span>
          </button>
        </div>

        {/* Review Cards Grid */}
        <div className="reviews-cards-list">
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <div key={rev.id} className="review-card">
                <div className="review-card-top">
                  <div className="review-stars-row">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        fill={i < rev.rating ? "#ffb703" : "#e9ecef"} 
                        color={i < rev.rating ? "#ffb703" : "#ced4da"} 
                      />
                    ))}
                  </div>
                  <span className="review-date">
                    {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <h4 className="review-card-title">{rev.title}</h4>
                <p className="review-card-body">{rev.body}</p>

                <div className="review-author-meta">
                  <span className="author-name">{rev.authorName}</span>
                  {rev.verifiedBuyer && (
                    <span className="verified-badge">
                      <ShieldCheck size={13} /> Verified Muse
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-reviews-card">
              <Sparkles size={28} className="empty-sparkle" />
              <p>Be the very first muse to leave a review for this silhouette!</p>
              <button 
                className="btn btn-outline btn-sm mt-3"
                onClick={() => setIsReviewModalOpen(true)}
              >
                Share Your Fit & Feedback
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Modal: Write a Muse Review */}
      {isReviewModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsReviewModalOpen(false)}>
          <div className="admin-modal-box review-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <div>
                <span className="section-tag" style={{ margin: 0 }}>🌸 SHARE YOUR THOUGHTS</span>
                <h3>Write a Review for {product.title}</h3>
              </div>
              <button className="icon-btn" onClick={() => setIsReviewModalOpen(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleReviewSubmit} className="modal-form">
              <div className="form-group">
                <label>Overall Rating</label>
                <div className="rating-selector-stars">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      key={starVal}
                      type="button"
                      className="star-select-btn"
                      onClick={() => setReviewRating(starVal)}
                    >
                      <Star 
                        size={24} 
                        fill={starVal <= reviewRating ? "#ffb703" : "none"} 
                        color={starVal <= reviewRating ? "#ffb703" : "#ced4da"} 
                      />
                    </button>
                  ))}
                  <span className="rating-val-hint">{reviewRating} out of 5 stars</span>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Your Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Camille Laurent"
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="camille@example.com"
                    value={reviewEmail}
                    onChange={(e) => setReviewEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Headline / Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ethereal silk drape, fitted perfectly!"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Your Review</label>
                <textarea 
                  rows="4"
                  className="admin-textarea"
                  placeholder="How did the fabric feel? How was the fit and craftsmanship?"
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-cute-pink" 
                disabled={submittingReview}
                style={{ width: '100%', marginTop: '10px' }}
              >
                <span>{submittingReview ? 'Submitting Review...' : 'Submit Muse Review 💖'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Review Toast */}
      {reviewToast && (
        <div className="admin-toast-badge animate-fade-in">
          <span>💖</span>
          <span>{reviewToast}</span>
        </div>
      )}

      {/* Related Products Carousel */}
      <section className="container mt-24 pb-20">
        <div className="text-center mb-10">
          <span className="section-tag">💖 COMPLETE THE VIBE</span>
          <h2 className="section-title">You Might Also Adore</h2>
        </div>
        <div className="grid grid-cols-4 gap-6">
          {relatedList.map(item => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

    </div>
  );
};

export default ProductDetail;
