import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Sparkles, 
  ShoppingBag, 
  UploadCloud, 
  CheckCircle2, 
  X, 
  Play, 
  Share2, 
  Check, 
  Flame, 
  Search, 
  Camera, 
  Star,
  ShieldCheck,
  Sparkle,
  Copy
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getUgcPosts, submitUgcLook, likeUgcPost } from '../services/api';
import { formatINR } from '../utils/currency';
import './ShopTheFeed.css';

// Master catalog items that creators wear
const AVAILABLE_CATALOG_PRODUCTS = [
  { 
    id: 90, 
    title: 'Noor Rust Orange Handcrafted Flared Anarkali Dress', 
    price: 5499.00, 
    originalPrice: 6999.00,
    rating: 5.0,
    reviewsCount: 114,
    fabric: 'Pure Slub Cotton Silk with Fine Gold Thread Zari & Cotton Mulmul Lining',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Rust Terracotta', hex: '#c05c36' }
    ],
    image: '/images/products/taasa-client-01.jpeg'
  },
  { 
    id: 97, 
    title: 'Terracotta Rust Embroidered Peplum Co-ord Set', 
    price: 3899.00, 
    originalPrice: 4999.00,
    rating: 5.0,
    reviewsCount: 86,
    fabric: 'Rich Slub Cotton Linen with Hand-Embroidery Accents',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Terracotta Rust', hex: '#bf4e30' }
    ],
    image: '/images/products/taasa-client-08.jpeg'
  },
  { 
    id: 81, 
    title: 'Noorani Ivory Threadwork Short Kurti', 
    price: 2499.00, 
    originalPrice: 3299.00,
    rating: 4.9,
    reviewsCount: 88,
    fabric: '100% Breathable Textured Slub Cotton with Hand Embroidered Yoke',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Ivory Cream', hex: '#fdfbf7' }
    ],
    image: '/images/products/taasa-client-26.jpeg'
  },
  { 
    id: 99, 
    title: 'Purple Elegance Pleated Two-Piece Set', 
    price: 3499.00, 
    originalPrice: 4499.00,
    rating: 4.9,
    reviewsCount: 67,
    fabric: 'Pure Cotton with Breathable Weave & Tailored Bottoms',
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Violet & White', hex: '#7b1fa2' }
    ],
    image: '/images/products/taasa-client-22.jpeg'
  },
  { 
    id: 83, 
    title: 'Rajkumari Wine Pure Silk Straight Cut Kurti Suit', 
    price: 6199.00, 
    originalPrice: 7999.00,
    rating: 5.0,
    reviewsCount: 95,
    fabric: 'Pure Mulberry Silk with Antique Gold Zari Weave & Mulmul Lining',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Imperial Wine', hex: '#4a154b' }
    ],
    image: '/images/products/taasa-client-31.jpeg'
  },
  { 
    id: 93, 
    title: 'Indigo Neel Block-Print Flared Angrakha Dress', 
    price: 4199.00, 
    originalPrice: 5499.00,
    rating: 4.9,
    reviewsCount: 68,
    fabric: '100% Bagru Handblock Printed Pure Cotton',
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Indigo Dabu Blue', hex: '#23395d' }
    ],
    image: '/images/products/taasa-client-17.jpeg'
  }
];

// Rich Curated UGC & Editorial Posts Data
const INITIAL_UGC_POSTS = [
  {
    id: 1,
    creator: '@ananya.couture',
    creatorName: 'Ananya Singhania',
    avatar: '/images/products/taasa-client-01.jpeg',
    location: 'Taj Falaknuma Palace, Hyderabad',
    verified: true,
    caption: 'Twirling in pure poetry with the Noor Rust Orange Anarkali 🌸 That full sweeping flare feels so royal! 👑✨',
    likes: 18540,
    aspectClass: 'aspect-tall', // 9:16
    image: '/images/products/taasa-client-01.jpeg',
    isReel: true,
    reelDuration: '0:22',
    category: 'dresses',
    badge: '👑 Royal Flare',
    product: AVAILABLE_CATALOG_PRODUCTS[0]
  },
  {
    id: 2,
    creator: '@meera.kapoor',
    creatorName: 'Meera Kapoor',
    avatar: '/images/products/taasa-client-17.jpeg',
    location: 'Umaid Bhawan Palace, Jodhpur',
    verified: true,
    caption: 'Weekend look in @TaasaAtelier Indigo Neel Handblock Angrakha. The dabu block print is pure artisanal perfection. ❤️',
    likes: 34940,
    aspectClass: 'aspect-portrait', // 3:4
    image: '/images/products/taasa-client-17.jpeg',
    isReel: false,
    category: 'dresses',
    badge: '✨ Boutique Muse',
    product: AVAILABLE_CATALOG_PRODUCTS[5]
  },
  {
    id: 3,
    creator: '@radhika_deshmukh',
    creatorName: 'Radhika Deshmukh',
    avatar: '/images/products/taasa-client-08.jpeg',
    location: 'City Palace, Jaipur',
    verified: true,
    caption: 'Sunday brunching in @TaasaAtelier Terracotta Peplum Co-ord set! Clean lines and breathtaking sleeve embroidery. 🌸✨',
    likes: 14210,
    aspectClass: 'aspect-editorial', // 4:5
    image: '/images/products/taasa-client-08.jpeg',
    isReel: true,
    reelDuration: '0:18',
    category: 'coords',
    badge: '🌸 Festive Star',
    product: AVAILABLE_CATALOG_PRODUCTS[1]
  },
  {
    id: 4,
    creator: '@sanya.grover',
    creatorName: 'Sanya Grover',
    avatar: '/images/products/taasa-client-22.jpeg',
    location: 'Alila Fort Bishangarh',
    verified: true,
    caption: 'Effortless poise in @TaasaAtelier Purple Elegance pleated kurti and white trousers. Simple, stylish, elegant! 💃💜',
    likes: 19120,
    aspectClass: 'aspect-tall', // 9:16
    image: '/images/products/taasa-client-22.jpeg',
    isReel: false,
    category: 'sets',
    badge: '💃 Signature Duo',
    product: AVAILABLE_CATALOG_PRODUCTS[3]
  },
  {
    id: 5,
    creator: '@priya.sharma_',
    creatorName: 'Priya Sharma',
    avatar: '/images/products/taasa-client-26.jpeg',
    location: 'Bandra Seaside, Mumbai',
    verified: true,
    caption: 'Workday to dinner in the Noorani ivory threadwork short kurti. Breathable slub cotton that feels weightless!',
    likes: 27650,
    aspectClass: 'aspect-portrait', // 3:4
    image: '/images/products/taasa-client-26.jpeg',
    isReel: false,
    category: 'kurtis',
    badge: '🌸 Short Kurti Chic',
    product: AVAILABLE_CATALOG_PRODUCTS[2]
  },
  {
    id: 6,
    creator: '@tanvi.joshi',
    creatorName: 'Tanvi Joshi',
    avatar: '/images/products/taasa-client-31.jpeg',
    location: 'Rambagh Palace, Jaipur',
    verified: false,
    caption: 'Festive pooja ready in Rajkumari wine pure silk straight suit with antique gold zari border. Pure luxury! ✨',
    likes: 12890,
    aspectClass: 'aspect-square', // 1:1
    image: '/images/products/taasa-client-31.jpeg',
    isReel: false,
    category: 'kurtis',
    badge: '👑 Royal Silk',
    product: AVAILABLE_CATALOG_PRODUCTS[4]
  }
];

const FILTER_CATEGORIES = [
  { key: 'all', label: '👑 All Taasa Muses' },
  { key: 'kurtis', label: '🌸 Kurtis & Tunics' },
  { key: 'dresses', label: '👑 Flared Dresses' },
  { key: 'coords', label: '✨ Co-ord Sets' },
  { key: 'sets', label: '💃 Two Piece Sets' },
  { key: 'reels', label: '🎬 Viral Reels Only' }
];

const ShopTheFeed = () => {
  const { addToCart, toggleCart } = useCart();
  
  // Feed state
  const [posts, setPosts] = useState(INITIAL_UGC_POSTS);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set([1, 4]));
  
  // Quick Shop Modal state
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedSize, setSelectedSize] = useState('S');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Upload Look Modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadHandle, setUploadHandle] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadProductTag, setUploadProductTag] = useState(1);
  const [uploadCategory, setUploadCategory] = useState('coquette');
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedSuccessPost, setUploadedSuccessPost] = useState(null);
  const [copiedVoucher, setCopiedVoucher] = useState(false);
  
  const fileInputRef = useRef(null);

  // Load UGC Posts dynamically from REST API
  useEffect(() => {
    getUgcPosts().then(res => {
      if (res?.data && res.data.length > 0) {
        setPosts(res.data);
      }
    }).catch(() => {});
  }, []);

  // Filter posts logic
  const filteredPosts = posts.filter(post => {
    // Category filter
    let matchesCategory = true;
    if (activeFilter === 'reels') {
      matchesCategory = post.isReel === true;
    } else if (activeFilter !== 'all') {
      matchesCategory = post.category === activeFilter;
    }

    // Search query filter
    let matchesSearch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      matchesSearch = 
        post.creator.toLowerCase().includes(q) ||
        post.creatorName?.toLowerCase().includes(q) ||
        post.caption.toLowerCase().includes(q) ||
        post.product.title.toLowerCase().includes(q);
    }

    return matchesCategory && matchesSearch;
  });

  // Like toggle handler with pop animation & backend persist
  const handleToggleLike = (e, postId) => {
    e.stopPropagation();
    const isAlreadyLiked = likedPosts.has(postId);

    // Call API in background
    likeUgcPost(postId, !isAlreadyLiked).catch(() => {});

    setLikedPosts(prev => {
      const next = new Set(prev);
      if (isAlreadyLiked) {
        next.delete(postId);
      } else {
        next.add(postId);
      }

      // Update post likes counter
      setPosts(currentPosts =>
        currentPosts.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              likes: isAlreadyLiked ? p.likes - 1 : p.likes + 1
            };
          }
          return p;
        })
      );

      return next;
    });
  };

  // Open Quick-Shop modal
  const handleOpenQuickShop = (post) => {
    setSelectedPost(post);
    setSelectedSize(post.product.sizes ? post.product.sizes[0] : 'S');
    setSelectedColor(post.product.colors ? post.product.colors[0].name : 'Default');
    setQuantity(1);
    setAddedToast(false);
    setCopiedShare(false);
  };

  // Add to Bag from Quick-Shop
  const handleQuickAdd = () => {
    if (!selectedPost) return;
    setIsAdding(true);

    const productPayload = {
      id: selectedPost.product.id,
      title: selectedPost.product.title,
      price: selectedPost.product.price,
      image: selectedPost.image || selectedPost.product.image
    };

    addToCart(productPayload, quantity, selectedSize, selectedColor);

    setTimeout(() => {
      setIsAdding(false);
      setAddedToast(true);
      setTimeout(() => {
        setAddedToast(false);
      }, 2500);
    }, 400);
  };

  // Share Look Link
  const handleShareLook = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  // Handle Image Upload selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
    }
  };

  // Drag & drop file handlers
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
    }
  };

  // Submit Look Form with REST API integration
  const handleSubmitLook = async (e) => {
    e.preventDefault();
    if (!uploadHandle.trim() || !uploadCaption.trim()) return;

    setIsSubmitting(true);

    const cleanHandle = uploadHandle.startsWith('@') ? uploadHandle : `@${uploadHandle}`;
    const taggedProduct = AVAILABLE_CATALOG_PRODUCTS.find(p => p.id === Number(uploadProductTag)) || AVAILABLE_CATALOG_PRODUCTS[0];

    try {
      const res = await submitUgcLook({
        creator: cleanHandle,
        creatorName: cleanHandle.replace('@', ''),
        caption: uploadCaption,
        image: previewImage || 'https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg?auto=compress&cs=tinysrgb&w=800',
        productId: Number(uploadProductTag) || 1,
        category: uploadCategory,
        location: 'Community Muse Submission'
      });

      const newPost = res?.data || {
        id: Date.now(),
        creator: cleanHandle,
        creatorName: cleanHandle.replace('@', ''),
        avatar: previewImage || 'https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg?auto=compress&cs=tinysrgb&w=150',
        location: 'Community Muse Submission',
        verified: true,
        caption: uploadCaption,
        likes: 1,
        aspectClass: 'aspect-tall',
        image: previewImage || 'https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg?auto=compress&cs=tinysrgb&w=800',
        isReel: false,
        category: uploadCategory,
        badge: '✨ Fresh Drop',
        product: taggedProduct
      };

      setIsSubmitting(false);
      setPosts([newPost, ...posts]);
      setUploadedSuccessPost(newPost);
      setLikedPosts(prev => new Set([...prev, newPost.id]));
    } catch {
      setIsSubmitting(false);
      // Fallback local
      const fallbackPost = {
        id: Date.now(),
        creator: cleanHandle,
        creatorName: cleanHandle.replace('@', ''),
        avatar: previewImage || 'https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg?auto=compress&cs=tinysrgb&w=150',
        location: 'Community Muse Submission',
        verified: true,
        caption: uploadCaption,
        likes: 1,
        aspectClass: 'aspect-tall',
        image: previewImage || 'https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg?auto=compress&cs=tinysrgb&w=800',
        isReel: false,
        category: uploadCategory,
        badge: '✨ Fresh Drop',
        product: taggedProduct
      };
      setPosts([fallbackPost, ...posts]);
      setUploadedSuccessPost(fallbackPost);
      setLikedPosts(prev => new Set([...prev, fallbackPost.id]));
    }
  };

  // Copy VIP voucher code
  const handleCopyVoucher = () => {
    navigator.clipboard?.writeText('MUSE20');
    setCopiedVoucher(true);
    setTimeout(() => setCopiedVoucher(false), 2200);
  };

  // Reset and close upload modal
  const handleCloseUploadModal = () => {
    setIsUploadOpen(false);
    setUploadedSuccessPost(null);
    setPreviewImage(null);
    setUploadHandle('');
    setUploadCaption('');
    setCopiedVoucher(false);
  };

  return (
    <div className="feed-page">
      
      {/* Editorial Hero Header */}
      <div className="feed-banner-header text-center">
        <div className="container">
          <div className="feed-tag-pill">
            <Sparkle size={13} className="sparkle-spin" />
            <span>👑 #TAASAMUSES • INDIAN ROYAL HERITAGE</span>
            <Sparkle size={13} className="sparkle-spin" />
          </div>
          
          <h1 className="feed-main-title">Shop The Royal Feed</h1>
          <p className="feed-subtitle">
            Regal Indian bridal opulence and festive twirls captured in real life. Discover how modern queens drape their Taasa Banarasi silks, bridal lehengas, and mirror-work shararas across royal palace weddings and celebrations worldwide.
          </p>

          <div className="feed-header-actions">
            <button 
              className="btn btn-cute-pink upload-trigger-btn"
              onClick={() => setIsUploadOpen(true)}
            >
              <Camera size={16} />
              <span>Submit Your Royal Look & Get 20% Voucher 👑</span>
            </button>
            
            <span className="feed-header-stat">
              ✨ <strong>12.4K+</strong> brides & muses styled worldwide
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="feed-controls-sticky">
        <div className="container">
          <div className="feed-controls-wrapper">
            
            {/* Horizontal Filter Tabs */}
            <div className="feed-filter-tabs">
              {FILTER_CATEGORIES.map(cat => {
                const count = cat.key === 'all' 
                  ? posts.length 
                  : cat.key === 'reels' 
                    ? posts.filter(p => p.isReel).length 
                    : posts.filter(p => p.category === cat.key).length;

                return (
                  <button
                    key={cat.key}
                    className={`feed-filter-pill ${activeFilter === cat.key ? 'active' : ''}`}
                    onClick={() => setActiveFilter(cat.key)}
                  >
                    <span>{cat.label}</span>
                    <span className="pill-count">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Search */}
            <div className="feed-search-box">
              <Search size={15} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search by muse, city, or style..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
                  <X size={13} />
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Pinterest-Style Masonry Waterfall Grid */}
      <div className="container feed-masonry-wrapper mt-8 pb-24">
        {filteredPosts.length === 0 ? (
          <div className="feed-empty-state text-center">
            <Sparkles size={40} className="empty-sparkle mb-3" />
            <h3>No muses found matching &ldquo;{searchQuery}&rdquo;</h3>
            <p>Try searching for &ldquo;corset&rdquo;, &ldquo;Paris&rdquo;, or switch back to All Muses.</p>
            <button className="btn btn-outline-rose mt-4" onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}>
              Reset Filters ✨
            </button>
          </div>
        ) : (
          <div className="feed-masonry-waterfall">
            {filteredPosts.map(post => {
              const isLiked = likedPosts.has(post.id);

              return (
                <div 
                  key={post.id} 
                  className={`feed-masonry-item ${post.aspectClass}`}
                  onClick={() => handleOpenQuickShop(post)}
                >
                  <div className="feed-image-container">
                    <img 
                      src={post.image} 
                      alt={post.caption} 
                      className="feed-card-image"
                      loading="lazy" 
                    />

                    {/* Top Badges */}
                    <div className="feed-card-top-bar">
                      <div className="feed-creator-badge">
                        <img src={post.avatar} alt={post.creator} className="creator-avatar-mini" />
                        <span className="creator-handle-text">{post.creator}</span>
                        {post.verified && <span className="verified-check" title="Verified Muse">✓</span>}
                      </div>

                      {post.isReel ? (
                        <div className="feed-reel-pill" title="Viral Video Reel">
                          <Play size={10} fill="currentColor" />
                          <span>{post.reelDuration || 'REEL'}</span>
                        </div>
                      ) : post.badge ? (
                        <div className="feed-custom-badge">
                          <span>{post.badge}</span>
                        </div>
                      ) : null}
                    </div>

                    {/* Interactive Like Button */}
                    <button 
                      className={`feed-like-action-btn ${isLiked ? 'liked' : ''}`}
                      onClick={(e) => handleToggleLike(e, post.id)}
                      title={isLiked ? 'Unlike look' : 'Like look'}
                    >
                      <Heart 
                        size={17} 
                        fill={isLiked ? '#ff8fab' : 'none'} 
                        color={isLiked ? '#ff8fab' : '#ffffff'} 
                      />
                    </button>

                    {/* Gradient Info Overlay */}
                    <div className="feed-hover-overlay">
                      {post.location && (
                        <span className="feed-location-text">📍 {post.location}</span>
                      )}
                      <p className="feed-caption-text">{post.caption}</p>
                      
                      {/* Product Preview Tag Box */}
                      <div className="feed-product-quick-tag">
                        <div className="product-tag-img-wrap">
                          <img src={post.product.image} alt={post.product.title} />
                        </div>
                        <div className="product-tag-details">
                          <span className="product-tag-name">{post.product.title}</span>
                          <span className="product-tag-price">{formatINR(post.product.price)}</span>
                        </div>
                        <span className="product-tag-action">
                          <ShoppingBag size={12} />
                          <span>Quick Shop</span>
                        </span>
                      </div>

                      {/* Bottom stats row */}
                      <div className="feed-card-stats-row">
                        <span className="feed-card-likes-count">
                          ❤️ {post.likes.toLocaleString()} likes
                        </span>
                        <span className="feed-tap-hint">Tap to view look ➔</span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* LUXE QUICK-SHOP MODAL */}
      {selectedPost && (
        <div className="quick-shop-backdrop animate-fade-in" onClick={() => setSelectedPost(null)}>
          <div className="quick-shop-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="quick-shop-close" 
              onClick={() => setSelectedPost(null)}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="quick-shop-grid">
              
              {/* Media Left Column */}
              <div className="quick-shop-media">
                <img src={selectedPost.image} alt={selectedPost.creator} />
                
                {/* Creator Card Floating on Media */}
                <div className="quick-shop-creator-card">
                  <img src={selectedPost.avatar} alt={selectedPost.creator} className="qs-avatar" />
                  <div className="qs-creator-info">
                    <div className="qs-creator-name-row">
                      <strong>{selectedPost.creatorName || selectedPost.creator}</strong>
                      {selectedPost.verified && <span className="verified-check">✓</span>}
                    </div>
                    <span className="qs-handle">{selectedPost.creator}</span>
                    {selectedPost.location && <span className="qs-loc">📍 {selectedPost.location}</span>}
                  </div>
                </div>

                {selectedPost.isReel && (
                  <div className="quick-shop-reel-indicator">
                    <Play size={12} fill="#fff" />
                    <span>Watch Styling Reel ({selectedPost.reelDuration || '0:20'})</span>
                  </div>
                )}
              </div>

              {/* Shopping Panel Right Column */}
              <div className="quick-shop-info">
                
                <div className="qs-header-row">
                  <div className="qs-badge-wrap">
                    <span className="quick-tag">✨ AS SEEN ON VIRAL FEED</span>
                    {selectedPost.badge && (
                      <span className="qs-accent-badge">{selectedPost.badge}</span>
                    )}
                  </div>

                  <button 
                    className="qs-share-btn" 
                    onClick={handleShareLook}
                    title="Share this look"
                  >
                    {copiedShare ? <Check size={14} className="text-success" /> : <Share2 size={14} />}
                    <span>{copiedShare ? 'Copied Link!' : 'Share'}</span>
                  </button>
                </div>

                <h3 className="quick-title">{selectedPost.product.title}</h3>
                
                {/* Price & Rating */}
                <div className="qs-price-rating-row">
                  <div className="qs-pricing">
                    <span className="quick-price">{formatINR(selectedPost.product.price)}</span>
                    {selectedPost.product.originalPrice && (
                      <span className="qs-original-price">
                        {formatINR(selectedPost.product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <div className="qs-rating">
                    <Star size={13} fill="#d4a373" color="#d4a373" />
                    <span><strong>{selectedPost.product.rating || '4.9'}</strong> / 5.0</span>
                    <span className="qs-reviews">({selectedPost.product.reviewsCount || 120}+ reviews)</span>
                  </div>
                </div>

                {/* Muse Quote */}
                <div className="qs-quote-box">
                  <p>&ldquo;{selectedPost.caption}&rdquo;</p>
                </div>

                {/* Craftsmanship Note */}
                <div className="qs-fabric-note">
                  <ShieldCheck size={14} className="text-rose" />
                  <span><strong>Fabric:</strong> {selectedPost.product.fabric || '100% Ethical Mulberry Silk Charmeuse'}</span>
                </div>

                {/* Interactive Color Selector */}
                {selectedPost.product.colors && (
                  <div className="qs-option-group">
                    <div className="qs-option-label">
                      <span>Color: <strong>{selectedColor}</strong></span>
                    </div>
                    <div className="qs-color-options">
                      {selectedPost.product.colors.map(col => (
                        <button
                          key={col.name}
                          type="button"
                          className={`qs-color-circle ${selectedColor === col.name ? 'active' : ''}`}
                          style={{ backgroundColor: col.hex }}
                          onClick={() => setSelectedColor(col.name)}
                          title={col.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Interactive Size Selector */}
                <div className="qs-option-group">
                  <div className="qs-option-label">
                    <span>Select Size: <strong>{selectedSize}</strong></span>
                    <span className="qs-fit-hint">✨ True to size</span>
                  </div>
                  <div className="qs-size-selector">
                    {(selectedPost.product.sizes || ['XS', 'S', 'M', 'L', 'XL']).map(sz => (
                      <button
                        key={sz}
                        type="button"
                        className={`qs-size-btn ${selectedSize === sz ? 'active' : ''}`}
                        onClick={() => setSelectedSize(sz)}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity & Stock Urgency */}
                <div className="qs-quantity-stock-row">
                  <div className="qs-quantity-counter">
                    <button 
                      type="button" 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button 
                      type="button" 
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <span className="qs-urgency-badge">
                    <Flame size={13} className="flame-pulse" />
                    <span>Selling fast — Only 3 left in Size {selectedSize}!</span>
                  </span>
                </div>

                {/* Add to Bag Button */}
                <button 
                  className={`btn btn-cute-pink btn-quick-add ${isAdding ? 'loading' : ''} ${addedToast ? 'added-success' : ''}`}
                  onClick={handleQuickAdd}
                  disabled={isAdding}
                >
                  {addedToast ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>ADDED TO BAG! 💖</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      <span>ADD COMPLETE LOOK TO BAG • {formatINR(selectedPost.product.price * quantity)}</span>
                    </>
                  )}
                </button>

                <div className="qs-footer-links">
                  <Link 
                    to={`/products/${selectedPost.product.id}`}
                    className="quick-view-full"
                    onClick={() => setSelectedPost(null)}
                  >
                    View Full Product Details & Sizing Guide ➔
                  </Link>

                  <button 
                    type="button"
                    className="qs-open-cart-link"
                    onClick={() => { setSelectedPost(null); toggleCart(); }}
                  >
                    View Shopping Bag
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* AESTHETIC UPLOAD / SUBMIT YOUR LOOK MODAL */}
      {isUploadOpen && (
        <div className="quick-shop-backdrop animate-fade-in" onClick={handleCloseUploadModal}>
          <div className="upload-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <div className="modal-title-wrap">
                <span className="modal-pill-tag">✨ #TAASAMUSES VIP REWARD</span>
                <h3>Join The Official Style Feed</h3>
              </div>
              <button 
                className="icon-btn close-modal-btn" 
                onClick={handleCloseUploadModal}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {uploadedSuccessPost ? (
              /* Success Reward Screen */
              <div className="upload-success-state text-center animate-fade-in">
                <div className="success-sparkle-ring">
                  <Sparkles size={48} className="text-rose mb-2 animate-bounce" />
                </div>
                
                <h4 className="success-headline">Look Submitted to The Feed! 💖</h4>
                <p className="success-subtext">
                  Your look is now featured at the top of <strong>#TaasaMuses</strong>! As a thank you for inspiring the community, your <strong>20% VIP Voucher</strong> is unlocked:
                </p>

                {/* VIP Voucher Gift Box */}
                <div className="vip-voucher-box">
                  <div className="voucher-details">
                    <span className="voucher-title">VIP CREATOR REWARD</span>
                    <span className="voucher-code">MUSE20</span>
                    <span className="voucher-desc">20% off your entire next order • No minimum</span>
                  </div>
                  <button 
                    className="btn btn-cute-pink btn-copy-voucher"
                    onClick={handleCopyVoucher}
                  >
                    {copiedVoucher ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copiedVoucher ? 'COPIED TO CLIPBOARD! ✨' : 'COPY CODE'}</span>
                  </button>
                </div>

                <div className="success-action-buttons">
                  <button 
                    className="btn btn-cute-pink"
                    onClick={handleCloseUploadModal}
                  >
                    <span>View My Look on The Feed ✨</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Upload Form */
              <form onSubmit={handleSubmitLook} className="upload-form">
                <p className="upload-intro">
                  Tag <strong>@taasaofficial</strong> or drop your favorite outfit snap below. Every approved muse receives our exclusive <strong>20% MUSE20 voucher</strong> instantly!
                </p>

                {/* File Dropzone & Live Preview */}
                <div 
                  className={`upload-dropzone ${previewImage ? 'has-preview' : ''}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept="image/*" 
                    onChange={handleFileChange}
                    style={{ display: 'none' }} 
                  />

                  {previewImage ? (
                    <div className="preview-container">
                      <img src={previewImage} alt="Uploaded outfit preview" className="uploaded-preview-img" />
                      <div className="preview-change-overlay">
                        <Camera size={18} />
                        <span>Tap to change photo</span>
                      </div>
                    </div>
                  ) : (
                    <div className="dropzone-idle">
                      <div className="dropzone-icon-circle">
                        <UploadCloud size={28} className="text-rose-deep" />
                      </div>
                      <span className="dropzone-title">Click or drag outfit photo here</span>
                      <small className="dropzone-hint">High-res PNG, JPG or WEBP (up to 15MB)</small>
                      <span className="dropzone-badge">🌸 iPhone selfies & mirror snaps welcome</span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Your Instagram / TikTok Handle</label>
                  <div className="input-with-icon">
                    <span className="input-prefix">@</span>
                    <input 
                      type="text" 
                      placeholder="serena.style" 
                      value={uploadHandle}
                      onChange={(e) => setUploadHandle(e.target.value.replace('@', ''))}
                      required 
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Which Taasa Piece Are You Wearing?</label>
                    <select 
                      value={uploadProductTag} 
                      onChange={(e) => setUploadProductTag(Number(e.target.value))}
                      className="form-select"
                    >
                      {AVAILABLE_CATALOG_PRODUCTS.map(prod => (
                        <option key={prod.id} value={prod.id}>
                          {prod.title} ({formatINR(prod.price)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Aesthetic Category</label>
                    <select 
                      value={uploadCategory} 
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="form-select"
                    >
                      <option value="coquette">🎀 Coquette Romantic</option>
                      <option value="romantic">🌸 Silk Dresses</option>
                      <option value="butter-yellow">💛 Butter Yellow Edit</option>
                      <option value="cleangirl">🍸 Clean Girl Luxe</option>
                      <option value="evening">✨ Evening Siren</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Styling Notes or Location</label>
                  <textarea 
                    placeholder="e.g. Wore the Rosette Satin Corset for golden hour cocktails in Soho! Sculpted perfectly..."
                    rows={3} 
                    value={uploadCaption}
                    onChange={(e) => setUploadCaption(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className={`btn btn-cute-pink submit-look-btn ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Publishing Look to Feed... ✨</span>
                  ) : (
                    <span>Submit Look & Claim 20% Voucher 💖</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default ShopTheFeed;
