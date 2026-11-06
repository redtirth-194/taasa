import React, {  useState, useEffect  } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Star, 
  Play, 
  Truck, 
  RotateCcw, 
  Headphones, 
  CheckCircle2, 
  X,
  Plus
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getProducts, getUgcPosts } from '../services/api';
import './Home.css';

// 1. Curated Indian Authentic Categories
const AESTHETIC_CATEGORIES = [
  { id: 1, name: 'Kurtis & Tunics', count: 'Short, Long & Shirts', tag: '🌸 Handloom Chic', image: '/images/products/taasa-client-26.jpeg', link: '/collections/kurtis' },
  { id: 2, name: 'Dresses & Anarkalis', count: 'Angrakha & A-Line', tag: '👑 Royal Flare', image: '/images/products/taasa-client-01.jpeg', link: '/collections/dresses' },
  { id: 3, name: 'Co-ord Sets', count: 'Modern Runway', tag: '✨ Tailored Elegance', image: '/images/products/taasa-client-08.jpeg', link: '/collections/co-ord-set' },
  { id: 4, name: 'Two Piece Sets', count: 'Peplum & Trousers', tag: '💃 Poised Combos', image: '/images/products/taasa-client-22.jpeg', link: '/collections/two-piece-set' },
  { id: 5, name: 'Plus Size Collection', count: 'L to 5XL Fit', tag: '💖 Queen Curves', image: '/images/products/taasa-client-03.jpeg', link: '/collections/plus-size-collection' },
  { id: 6, name: 'Luxury Pants', count: 'Cigarette & Palazzos', tag: '💎 Atelier Tailoring', image: '/images/products/taasa-client-40.jpeg', link: '/collections/pants' }
];

// 2. Hero Slides
const HERO_SLIDES = [
  {
    id: 1,
    tagline: '🌸 THE ROYAL BOUTIQUE EDIT 2026',
    title: 'Artisanal Kurtis & Sweeping Dresses,\nHandcrafted For Timeless Poise.',
    description: 'Discover breathable slub cotton kurtis, regal flared anarkalis, handblock printed angrakhas, and contemporary co-ord sets designed by Taasa.',
    image: '/images/products/taasa-client-01.jpeg',
    accentTag: '✨ 100% PURE BREATHABLE FABRICS',
    bgColor: 'linear-gradient(135deg, #fef4f6 0%, #fff0f5 50%, #fdfbf9 100%)',
    btnText: 'Explore Flared Dresses 🌸',
    btnLink: '/collections/dresses'
  },
  {
    id: 2,
    tagline: '✨ ATELIER PEPLUM & CO-ORD SETS',
    title: 'Effortless Co-ords &\nBotanical Sleeve Embroidery.',
    description: 'Contemporary styling meets artisanal handwork. Explore relaxed pleated peplums paired with comfortable straight-leg trousers.',
    image: '/images/products/taasa-client-08.jpeg',
    accentTag: '👑 SIGNATURE TAASA ATELIER',
    bgColor: 'linear-gradient(135deg, #fff2f2 0%, #fef7db 50%, #fdfbf9 100%)',
    btnText: 'Discover Co-ord Sets 💖',
    btnLink: '/collections/co-ord-set'
  },
  {
    id: 3,
    tagline: '💃 PURE SILK & INDIGO PRINTS',
    title: 'Mulberry Silk Suits &\nHandblock Angrakha Dresses.',
    description: 'Twirl with graceful ease in dabu handblock angrakhas, wine purple silk straight kurtis with antique gold zari borders, and playful festive duos.',
    image: '/images/products/taasa-client-31.jpeg',
    accentTag: '✨ PURE MULBERRY SILK & ZARI',
    bgColor: 'linear-gradient(135deg, #fce4ec 0%, #fff9e6 50%, #fdfbf9 100%)',
    btnText: 'Shop Silk & Kurtis ✨',
    btnLink: '/collections/kurtis'
  }
];

// 3. Curated Authentic Indian Products
const VIRAL_PRODUCTS = [
  {
    id: 81,
    category: 'Kurtis',
    title: 'Noorani Ivory Threadwork Short Kurti',
    price: 2499.00,
    oldPrice: 3299.00,
    badge: '🌸 Short Kurti Bestseller',
    isNew: true,
    rating: '4.9 (88)',
    image: '/images/products/taasa-client-26.jpeg',
    hoverImage: '/images/products/taasa-client-25.jpeg',
    swatches: ['#fdfbf7', '#222222']
  },
  {
    id: 90,
    category: 'Dresses',
    title: 'Noor Rust Orange Flared Anarkali Dress',
    price: 5499.00,
    oldPrice: 6999.00,
    badge: '👑 Royal Flare Masterpiece',
    isNew: true,
    rating: '5.0 (114)',
    image: '/images/products/taasa-client-01.jpeg',
    hoverImage: '/images/products/taasa-client-06.jpeg',
    swatches: ['#c05c36', '#d4af37']
  },
  {
    id: 97,
    category: 'Co-ord set',
    title: 'Terracotta Rust Embroidered Peplum Co-ord Set',
    price: 3899.00,
    oldPrice: 4999.00,
    badge: '✨ Trending Co-ord',
    isNew: true,
    rating: '5.0 (86)',
    image: '/images/products/taasa-client-08.jpeg',
    hoverImage: '/images/products/taasa-client-34.jpeg',
    swatches: ['#bf4e30', '#fdfbf7']
  },
  {
    id: 99,
    category: 'Two piece set',
    title: 'Purple Elegance Pleated Kurti & Trouser Set',
    price: 3499.00,
    oldPrice: 4499.00,
    badge: '💜 Signature Duo',
    isNew: true,
    rating: '4.9 (67)',
    image: '/images/products/taasa-client-22.jpeg',
    hoverImage: '/images/products/taasa-client-23.jpeg',
    swatches: ['#7b1fa2', '#ffffff']
  },
  {
    id: 83,
    category: 'Kurtis',
    title: 'Rajkumari Wine Silk Straight Cut Kurti Suit',
    price: 6199.00,
    oldPrice: 7999.00,
    badge: '👑 Royal Silk Edit',
    isNew: true,
    rating: '5.0 (95)',
    image: '/images/products/taasa-client-31.jpeg',
    hoverImage: '/images/products/taasa-client-33.jpeg',
    swatches: ['#4a154b', '#d4af37']
  },
  {
    id: 93,
    category: 'Dresses',
    title: 'Indigo Neel Block-Print Flared Angrakha Dress',
    price: 4199.00,
    oldPrice: 5499.00,
    badge: '✨ Handblock Angrakha',
    isNew: true,
    rating: '4.9 (68)',
    image: '/images/products/taasa-client-17.jpeg',
    hoverImage: '/images/products/taasa-client-15.jpeg',
    swatches: ['#23395d', '#fdfbf7']
  },
  {
    id: 86,
    category: 'Kurtis',
    title: 'Neelambari Botanical Embroidered Kurti Shirt',
    price: 2999.00,
    oldPrice: 3899.00,
    badge: '🤍 Shirt Kurti Style',
    isNew: true,
    rating: '4.9 (56)',
    image: '/images/products/taasa-client-40.jpeg',
    hoverImage: '/images/products/taasa-client-41.jpeg',
    swatches: ['#1b2a47', '#fdfbf7']
  },
  {
    id: 82,
    category: 'Kurtis',
    title: 'Parijaat Sage Green Floral Short Kurti',
    price: 2399.00,
    oldPrice: 3199.00,
    badge: '🌿 Everyday Floral',
    isNew: true,
    rating: '4.8 (64)',
    image: '/images/products/taasa-client-43.jpeg',
    hoverImage: '/images/products/taasa-client-44.jpeg',
    swatches: ['#9bb0a5', '#f5f5dc']
  }
];

// 4. UGC Social Reels (Royal Muses)
const SOCIAL_REELS = [
  { id: 1, handle: '@ananya.couture', views: '2.4M', likes: '185K', title: 'Twirling in pure poetry with the Noor Rust Orange Anarkali 🌸', image: '/images/products/taasa-client-01.jpeg' },
  { id: 2, handle: '@meera.kapoor', views: '1.9M', likes: '294K', title: 'Weekend vibes in Indigo Neel Handblock Angrakha ❤️', image: '/images/products/taasa-client-17.jpeg' },
  { id: 3, handle: '@radhika_deshmukh', views: '1.7M', likes: '142K', title: 'Terracotta Rust Peplum Co-ord set for Sunday high tea 💃', image: '/images/products/taasa-client-08.jpeg' },
  { id: 4, handle: '@sanya.grover', views: '1.1M', likes: '98K', title: 'Purple Elegance kurti and trouser set: simple, stylish, elegant! ✨', image: '/images/products/taasa-client-22.jpeg' }
];

// 5. Authentic Indian Testimonials
const TESTIMONIALS = [
  {
    id: 1,
    name: 'Ananya Mukherjee',
    location: 'Kolkata, India',
    outfit: 'Noor Rust Orange Flared Anarkali',
    text: "The flare is magnificent! Twirled like a dream at our family Sangeet in Jaipur. The slub cotton feels so light and breathable in warm evenings.",
    avatar: '/images/products/taasa-client-01.jpeg',
    rating: 5
  },
  {
    id: 2,
    name: 'Tanvi Agarwal',
    location: 'New Delhi, India',
    outfit: 'Terracotta Rust Peplum Co-ord Set',
    text: "The embroidery on the sleeves is so crisp and intricate. Both the peplum top and trousers fit like they were custom-made for me.",
    avatar: '/images/products/taasa-client-08.jpeg',
    rating: 5
  },
  {
    id: 3,
    name: 'Priya Sharma',
    location: 'Bengaluru, India',
    outfit: 'Noorani Ivory Threadwork Kurti',
    text: "Super comfortable for long workdays and casual dinners. The fabric quality and black yoke threadwork are exceptional. Worth every rupee!",
    avatar: '/images/products/taasa-client-26.jpeg',
    rating: 5
  }
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('Bestselling Kurtis & Sets 👑');
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [liveToast, setLiveToast] = useState(null);
  const [productsList, setProductsList] = useState(VIRAL_PRODUCTS);
  const [reelsList, setReelsList] = useState(SOCIAL_REELS);

  // Dynamically fetch products & UGC social reels from REST API
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
          badge: p.badge || (p.isNew ? '✨ New Royal Drop' : '👑 Handcrafted Heirloom'),
          isNew: p.isNew,
          rating: `${p.ratingsAvg || '4.9'} (${p.reviewsCount || 80})`,
          image: p.image,
          hoverImage: p.hoverImage || p.image,
          swatches: p.variants?.length 
            ? p.variants.filter((v, i, arr) => arr.findIndex(x => x.colorHex === v.colorHex) === i).map(v => v.colorHex)
            : ['#d81b60', '#880e4f', '#004d40']
        }));
        setProductsList(formatted);
      }
    }).catch(() => {});

    getUgcPosts().then(res => {
      if (res?.data && res.data.length > 0) {
        const formattedReels = res.data.slice(0, 4).map(post => ({
          id: post.id,
          handle: post.creator,
          views: `${post.likes ? Math.round(post.likes * 12.5) : 150}K`,
          likes: `${post.likes || 120}K`,
          title: post.caption,
          image: post.image
        }));
        setReelsList(formattedReels);
      }
    }).catch(() => {});
  }, []);

  // Auto advance hero slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Live social proof toast loop
  useEffect(() => {
    const buyers = [
      { name: 'Ananya from Mumbai', item: 'Gulabi Noor Banarasi Silk Saree', time: '2m ago' },
      { name: 'Radhika from New Delhi', item: 'Mastani Zardozi Bridal Lehenga', time: '4m ago' },
      { name: 'Pooja from London (UK)', item: 'Sitara Rani Pink Sharara Set', time: '1m ago' },
      { name: 'Meera from Bengaluru', item: 'Noor-E-Chanderi Ivory Anarkali', time: 'Just now' }
    ];

    let i = 0;
    const toastInterval = setInterval(() => {
      setLiveToast(buyers[i % buyers.length]);
      i++;
      setTimeout(() => setLiveToast(null), 4500);
    }, 12000);

    // Initial toast
    const initTimer = setTimeout(() => {
      setLiveToast(buyers[0]);
      setTimeout(() => setLiveToast(null), 4500);
    }, 3500);

    return () => {
      clearInterval(toastInterval);
      clearTimeout(initTimer);
    };
  }, []);

  // Intersection observer for smooth reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Filter products dynamically based on active tab
  const getFilteredProducts = () => {
    if (activeTab === 'Bestselling Kurtis & Sets 👑') {
      return productsList.slice(0, 4);
    }
    if (activeTab === 'New Royal Drops 🌸') {
      const news = productsList.filter(p => p.isNew);
      return news.length >= 4 ? news.slice(0, 4) : productsList.slice(2, 6);
    }
    if (activeTab === 'Festive Dresses & Co-ords ✨') {
      const festive = productsList.filter(p => 
        (p.category || '').toLowerCase().includes('dress') || 
        (p.category || '').toLowerCase().includes('co-ord') ||
        (p.badge || '').toLowerCase().includes('royal')
      );
      return festive.length >= 4 ? festive.slice(0, 4) : productsList.slice(4, 8);
    }
    return productsList;
  };

  return (
    <div className="home-page">
      
      {/* 1. Dreamy Hero Slider */}
      <section 
        className="hero-slider-section" 
        style={{ background: HERO_SLIDES[currentSlide].bgColor }}
      >
        <div className="container hero-slider-container">
          
          <div className="hero-text-col" key={`hero-text-${currentSlide}`}>
            <div className="hero-sticker-badge">
              <span>{HERO_SLIDES[currentSlide].accentTag}</span>
            </div>
            <span className="hero-tagline">{HERO_SLIDES[currentSlide].tagline}</span>
            <h1 className="hero-main-title">{HERO_SLIDES[currentSlide].title}</h1>
            <p className="hero-subtext">{HERO_SLIDES[currentSlide].description}</p>
            
            <div className="hero-cta-buttons">
              <Link to={HERO_SLIDES[currentSlide].btnLink} className="btn btn-cute-pink hero-primary-btn">
                <span>{HERO_SLIDES[currentSlide].btnText}</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/collections/all" className="btn btn-secondary hero-secondary-btn">
                <span>View Royal Lookbook ✨</span>
              </Link>
            </div>

            {/* Micro Social Proof */}
            <div className="hero-customer-rating">
              <div className="avatar-stack">
                <img src="/images/products/taasa-client-26.jpeg" alt="Customer" />
                <img src="/images/products/taasa-client-01.jpeg" alt="Customer" />
                <img src="/images/products/taasa-client-22.jpeg" alt="Customer" />
              </div>
              <div className="rating-info">
                <div className="stars-row">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="#ffb703" color="#ffb703" />
                  ))}
                </div>
                <span>Loved by <strong>45,000+</strong> women worldwide 💖</span>
              </div>
            </div>

          </div>

          <div className="hero-visual-col" key={`hero-visual-${currentSlide}`}>
            <div className="hero-visual-frame">
              <img 
                src={HERO_SLIDES[currentSlide].image} 
                alt="Taasa Royal Model" 
                className="hero-main-image" 
              />
              
              {/* Floating Aesthetic Sticker Badges */}
              <div className="floating-sticker sticker-top">
                <span>🌸 Royal Heritage Edit</span>
              </div>
              <div className="floating-sticker sticker-bottom">
                <span>✨ 100% Certified Pure Silk</span>
              </div>
            </div>
          </div>

        </div>

        {/* Slider Controls */}
        <div className="hero-dots-nav">
          {HERO_SLIDES.map((slide, idx) => (
            <button 
              key={slide.id} 
              className={`hero-dot-btn ${currentSlide === idx ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. Perks & Guarantees Strip */}
      <section className="perks-strip">
        <div className="container perks-container">
          <div className="perk-item">
            <div className="perk-icon-wrap"><Truck size={20} /></div>
            <div>
              <h5>Express Insured Shipping</h5>
              <p>Across India on orders ₹4,999+</p>
            </div>
          </div>
          <div className="perk-item">
            <div className="perk-icon-wrap"><Sparkles size={20} /></div>
            <div>
              <h5>100% Pure Certified Silk</h5>
              <p>Authentic Silk Mark & Handcrafted Zari</p>
            </div>
          </div>
          <div className="perk-item">
            <div className="perk-icon-wrap"><RotateCcw size={20} /></div>
            <div>
              <h5>Custom Blouse Tailoring</h5>
              <p>Bespoke necklines, sleeves & padding</p>
            </div>
          </div>
          <div className="perk-item">
            <div className="perk-icon-wrap"><Headphones size={20} /></div>
            <div>
              <h5>Royal Trousseau Stylist</h5>
              <p>24/7 video bridal consultations</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Shop by Aesthetic Categories */}
      <section className="category-showcase-section container mt-20 reveal">
        <div className="text-center">
          <span className="section-tag">🌸 ROYAL SILHOUETTES</span>
          <h2 className="section-title">Shop By Indian Heritage</h2>
          <p className="section-subtitle">Discover handcrafted heirlooms curated for weddings, sangeet, and festive celebrations.</p>
        </div>

        <div className="aesthetic-categories-grid mt-12">
          {AESTHETIC_CATEGORIES.map(cat => (
            <Link to={cat.link} key={cat.id} className="aesthetic-category-card group">
              <div className="cat-img-box">
                <img src={cat.image} alt={cat.name} />
                <span className="cat-floating-pill">{cat.tag}</span>
              </div>
              <div className="cat-info-box">
                <h3 className="cat-title">{cat.name}</h3>
                <span className="cat-count">{cat.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Tabbed Trending Drops (The Royal Trousseau) */}
      <section className="trending-showcase-section container mt-24 reveal">
        <div className="section-header-row">
          <div>
            <span className="section-tag">👑 ROYAL TROUSSEAU</span>
            <h2 className="section-title">Handcrafted Masterpieces</h2>
          </div>
          <div className="aesthetic-tabs">
            {['Bestselling Kurtis & Sets 👑', 'New Royal Drops 🌸', 'Festive Dresses & Co-ords ✨'].map(tab => (
              <button 
                key={tab} 
                className={`tab-pill-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mt-10">
          {getFilteredProducts().map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/collections/all" className="btn btn-secondary btn-explore-all">
            <span>Explore All Drops & Silhouettes 🌸</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* 5. Editorial Promo Split Banners */}
      <section className="promo-duo-section container mt-24 reveal">
        <div className="promo-duo-grid">
          
          <div className="promo-banner-card banner-pink">
            <div className="promo-text-wrap">
              <span className="promo-badge-tag">🌸 ARTISANAL KURTIS EDIT</span>
              <h3 className="promo-heading">Pure Slub Cotton &<br/>Threadwork Tunics</h3>
              <p className="promo-desc">Breathable natural cottons, intricate monochrome thread embroidery, and tailored silhouettes crafted for everyday and festive poise.</p>
              <Link to="/collections/kurtis" className="btn btn-primary btn-promo-cta">
                <span>Shop The Kurtis <ArrowRight size={14} /></span>
              </Link>
            </div>
            <div className="promo-image-box">
              <img src="/images/products/taasa-client-26.jpeg" alt="Artisanal Kurtis Edit" />
            </div>
          </div>

          <div className="promo-banner-card banner-butter">
            <div className="promo-text-wrap">
              <span className="promo-badge-tag">✨ ATELIER CO-ORD SUITS</span>
              <h3 className="promo-heading">Embroidered Peplums &<br/>Tailored Trousers</h3>
              <p className="promo-desc">Rich terracotta rust ensembles with botanical sleeve embroidery and tailored straight-leg trousers for modern Indian elegance.</p>
              <Link to="/collections/co-ord-set" className="btn btn-primary btn-promo-cta">
                <span>Explore Co-ord Sets <ArrowRight size={14} /></span>
              </Link>
            </div>
            <div className="promo-image-box">
              <img src="/images/products/taasa-client-08.jpeg" alt="Co-ord Couture Edit" />
            </div>
          </div>

        </div>
      </section>

      {/* 6. Interactive "Shop The Royal Look" Editorial Lookbook */}
      <section className="lookbook-section container mt-24 reveal">
        <div className="text-center mb-8">
          <span className="section-tag">✨ ROYAL TROUSSEAU LOOKBOOK</span>
          <h2 className="section-title">Shop The Royal Look</h2>
          <p className="section-subtitle">Click the glowing pins on our muse to discover the handcrafted heirloom details.</p>
        </div>

        <div className="lookbook-interactive-stage">
          <img 
            src="/images/products/taasa-client-01.jpeg" 
            alt="Taasa Royal Lookbook" 
            className="lookbook-stage-bg"
          />

          {/* Hotspot Pin 1: Neckline Embroidery */}
          <div className="hotspot-pin pin-1" style={{ top: '32%', left: '48%' }}>
            <button 
              className="hotspot-trigger-btn animate-pulse-glow"
              onClick={() => setActiveHotspot(activeHotspot === 1 ? null : 1)}
              aria-label="View Neckline Embroidery"
            >
              <Plus size={16} />
            </button>
            
            {activeHotspot === 1 && (
              <div className="hotspot-popover animate-fade-in">
                <img src="/images/products/taasa-client-06.jpeg" alt="Handcrafted Neckline Detail" />
                <div className="hotspot-details">
                  <h5>Zardozi Neckline Detail</h5>
                  <span>₹5,499</span>
                  <Link to="/collections/dresses" className="hotspot-link">View Details 💖</Link>
                </div>
              </div>
            )}
          </div>

          {/* Hotspot Pin 2: Sweeping Flared Dress */}
          <div className="hotspot-pin pin-2" style={{ top: '65%', left: '52%' }}>
            <button 
              className="hotspot-trigger-btn animate-pulse-glow"
              onClick={() => setActiveHotspot(activeHotspot === 2 ? null : 2)}
              aria-label="View Flared Dress"
            >
              <Plus size={16} />
            </button>
            
            {activeHotspot === 2 && (
              <div className="hotspot-popover animate-fade-in">
                <img src="/images/products/taasa-client-01.jpeg" alt="Noor Rust Orange Anarkali" />
                <div className="hotspot-details">
                  <h5>Noor Flared Anarkali Dress</h5>
                  <span>₹5,499</span>
                  <Link to="/collections/dresses" className="hotspot-link">View Dress 💖</Link>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 7. As Seen On TikTok & Instagram UGC Gallery */}
      <section className="ugc-gallery-section container mt-24 reveal">
        <div className="text-center">
          <span className="section-tag">🎀 #TAASAMUSES</span>
          <h2 className="section-title">As Seen On TikTok & Instagram</h2>
          <p className="section-subtitle">Tag @taasaofficial on social to be featured on our viral feed!</p>
        </div>

        <div className="ugc-grid mt-12">
          {reelsList.map(reel => (
            <div key={reel.id} className="ugc-card group">
              <img src={reel.image} alt={reel.handle} className="ugc-img" />
              <div className="ugc-overlay">
                <div className="ugc-play-bubble">
                  <Play size={20} fill="#fff" color="#fff" />
                </div>
                <div className="ugc-meta">
                  <span className="ugc-handle">{reel.handle}</span>
                  <p className="ugc-caption">{reel.title}</p>
                  <div className="ugc-stats">
                    <span>❤️ {reel.likes}</span>
                    <span>👀 {reel.views}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Glowing Verified Reviews */}
      <section className="reviews-section container mt-24 pb-20 reveal">
        <div className="text-center">
          <span className="section-tag">💖 CUSTOMER LOVE</span>
          <h2 className="section-title">From Our Muses</h2>
          <p className="section-subtitle">Read why over 45,000 fashionistas adore their Taasa pieces.</p>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-12">
          {TESTIMONIALS.map(item => (
            <div key={item.id} className="testimonial-card">
              <div className="stars-row mb-4">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#ffb703" color="#ffb703" />
                ))}
              </div>
              <p className="testimonial-text">"{item.text}"</p>
              
              <div className="testimonial-footer">
                <img src={item.avatar} alt={item.name} className="reviewer-avatar" />
                <div>
                  <h5 className="reviewer-name">
                    {item.name} <CheckCircle2 size={13} className="verified-icon" />
                  </h5>
                  <span className="reviewer-meta">{item.location} • Verified Buyer</span>
                  <span className="reviewer-product">Purchased: {item.outfit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Live Social Proof Toast */}
      {liveToast && (
        <div className="live-social-toast animate-fade-in">
          <span className="toast-sparkle">🌸</span>
          <div className="toast-info">
            <p><strong>{liveToast.name}</strong> just purchased</p>
            <span className="toast-item-name">{liveToast.item}</span>
            <span className="toast-time">{liveToast.time}</span>
          </div>
          <button className="toast-close" onClick={() => setLiveToast(null)}>
            <X size={14} />
          </button>
        </div>
      )}

    </div>
  );
};

export default Home;
