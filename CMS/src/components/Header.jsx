import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Heart, User, ChevronDown, Menu, X, Shield, LogOut, Gift, Package, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getProducts } from '../services/api';
import { formatINR } from '../utils/currency';
import './Header.css';

const QUICK_SEARCH_ITEMS = [
  { id: 81, title: 'Noorani Ivory Threadwork Short Kurti', price: 2499, category: 'Kurtis', image: '/images/products/taasa-client-26.jpeg' },
  { id: 90, title: 'Noor Rust Orange Flared Anarkali Dress', price: 5499, category: 'Dresses', image: '/images/products/taasa-client-01.jpeg' },
  { id: 97, title: 'Terracotta Rust Embroidered Peplum Co-ord Set', price: 3899, category: 'Co-ord set', image: '/images/products/taasa-client-08.jpeg' },
  { id: 99, title: 'Purple Elegance Pleated Two-Piece Set', price: 3499, category: 'Two piece set', image: '/images/products/taasa-client-22.jpeg' }
];

const Header = ({ onOpenWheel }) => {
  const { toggleCart, itemCount, wishlist } = useCart();
  const { user, isAdmin, openLoginModal, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [popularItems, setPopularItems] = useState(QUICK_SEARCH_ITEMS);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Load initial popular search recommendations from REST API
  useEffect(() => {
    getProducts({ limit: 4 }).then(res => {
      if (res?.data && res.data.length > 0) {
        setPopularItems(res.data.map(p => ({
          id: p.id,
          title: p.title,
          price: p.salePrice || p.basePrice,
          category: p.category,
          image: p.image
        })));
      }
    }).catch(() => {});
  }, []);

  // Debounced live search from database
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await getProducts({ search: searchQuery.trim(), limit: 8 });
        if (res?.success && res.data) {
          setSearchResults(res.data);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.warn('Search query fallback:', err.message);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Scroll effect for glassy floating header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  return (
    <>
      {/* 1. Cute Announcement Marquee Bar */}
      <div className="announcement-bar">
        <div className="announcement-ticker">
          <div className="ticker-track">
            <span>👑 ROYAL SHAADI EDIT '26: HANDWOVEN HERITAGE SILKS & BRIDAL LEHENGAS</span>
            <span className="ticker-dot">•</span>
            <span>✨ COMPLIMENTARY ROYAL BRIDAL DUST BAG & EXPRESS DISPATCH WORLDWIDE</span>
            <span className="ticker-dot">•</span>
            <span>🌸 USE CODE <strong className="promo-highlight">RANI20</strong> FOR 20% OFF COUTURE PIECES</span>
            <span className="ticker-dot">•</span>
            <span>💖 COD AVAILABLE ACROSS INDIA • BESPOKE BLOUSE TAILORING INCLUDED</span>
            <span className="ticker-dot">•</span>
            <span>👑 ROYAL SHAADI EDIT '26: HANDWOVEN HERITAGE SILKS & BRIDAL LEHENGAS</span>
            <span className="ticker-dot">•</span>
            <span>✨ COMPLIMENTARY ROYAL BRIDAL DUST BAG & EXPRESS DISPATCH WORLDWIDE</span>
            <span className="ticker-dot">•</span>
          </div>
        </div>
      </div>

      {/* 2. Main Luxury Sticky Header */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container header-container">
          
          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Mobile Menu"
          >
            <Menu size={22} />
          </button>

          {/* Left: Brand Logo */}
          <div className="header-logo">
            <Link to="/">
              <span className="logo-sparkle">✨</span>
              <h1 className="logo-text">Taasa<span>.</span></h1>
            </Link>
          </div>

          {/* Center: Navigation */}
          <nav className="header-nav desktop-only">
            <ul className="nav-links">
              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>

              <li className="nav-item has-badge">
                <Link to="/collections/new" className="nav-link">
                  New Drops <span className="nav-pill-badge">✨ Royal '26</span>
                </Link>
              </li>

              {/* Category: Kurtis (short, long, sleeveless, straight cut, shirts, Tunics) */}
              <li className="nav-item">
                <Link to="/collections/kurtis" className="nav-link">
                  Kurtis <ChevronDown size={14} className="chevron-icon" />
                </Link>
                <div className="nav-dropdown">
                  <Link to="/collections/kurtis" className="nav-dropdown-link">
                    <span>All Kurtis</span>
                    <span className="nav-dropdown-badge">Popular</span>
                  </Link>
                  <Link to="/collections/kurtis?subtype=short" className="nav-dropdown-link">
                    <span>Short Kurtis</span>
                  </Link>
                  <Link to="/collections/kurtis?subtype=long" className="nav-dropdown-link">
                    <span>Long Kurtis</span>
                  </Link>
                  <Link to="/collections/kurtis?subtype=sleeveless" className="nav-dropdown-link">
                    <span>Sleeveless Kurtis</span>
                  </Link>
                  <Link to="/collections/kurtis?subtype=straight" className="nav-dropdown-link">
                    <span>Straight Cut</span>
                  </Link>
                  <Link to="/collections/kurtis?subtype=shirts" className="nav-dropdown-link">
                    <span>Kurti Shirts</span>
                  </Link>
                  <Link to="/collections/kurtis?subtype=tunics" className="nav-dropdown-link">
                    <span>Tunics</span>
                  </Link>
                </div>
              </li>

              {/* Category: Dresses (Anarkali, Angrakha, A line, long flared tunics) */}
              <li className="nav-item">
                <Link to="/collections/dresses" className="nav-link">
                  Dresses <ChevronDown size={14} className="chevron-icon" />
                </Link>
                <div className="nav-dropdown">
                  <Link to="/collections/dresses" className="nav-dropdown-link">
                    <span>All Dresses</span>
                    <span className="nav-dropdown-badge">Atelier</span>
                  </Link>
                  <Link to="/collections/dresses?subtype=anarkali" className="nav-dropdown-link">
                    <span>Anarkali Dresses</span>
                  </Link>
                  <Link to="/collections/dresses?subtype=angrakha" className="nav-dropdown-link">
                    <span>Angrakha Dresses</span>
                  </Link>
                  <Link to="/collections/dresses?subtype=aline" className="nav-dropdown-link">
                    <span>A-Line Silhouettes</span>
                  </Link>
                  <Link to="/collections/dresses?subtype=flared" className="nav-dropdown-link">
                    <span>Long Flared Tunics</span>
                  </Link>
                </div>
              </li>

              {/* Category: Sets & Co-ords */}
              <li className="nav-item">
                <Link to="/collections/co-ord-set" className="nav-link">
                  Sets & Co-ords <ChevronDown size={14} className="chevron-icon" />
                </Link>
                <div className="nav-dropdown">
                  <Link to="/collections/co-ord-set" className="nav-dropdown-link">
                    <span>Co-ord Sets</span>
                    <span className="nav-dropdown-badge">Trending</span>
                  </Link>
                  <Link to="/collections/two-piece-set" className="nav-dropdown-link">
                    <span>Two Piece Sets</span>
                  </Link>
                </div>
              </li>

              {/* Category: Plus Size Collection */}
              <li className="nav-item has-badge">
                <Link to="/collections/plus-size-collection" className="nav-link">
                  Plus Size <span className="nav-pill-badge">💖 Curve</span>
                </Link>
              </li>

              {/* Category: Pants */}
              <li className="nav-item">
                <Link to="/collections/pants" className="nav-link">Pants</Link>
              </li>
            </ul>
          </nav>

          {/* Right: Actions */}
          <div className="header-actions">
            {isAdmin && (
              <Link to="/admin" className="admin-quick-pill">
                <span>👑 Admin Studio</span>
              </Link>
            )}

            <button 
              className="action-btn" 
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search items"
            >
              <Search size={20} />
            </button>

            {/* VIP Wheel Gift Trigger */}
            <button 
              className="action-btn" 
              onClick={onOpenWheel}
              title="Spin Secret VIP Drop Wheel 🎡"
              aria-label="Secret Drop Wheel"
            >
              <Gift size={19} className="text-rose-deep animate-float" />
            </button>

            <Link to="/collections/all" className="action-btn desktop-only" aria-label="Wishlist">
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="badge-count">{wishlist.length}</span>
              )}
            </Link>

            {/* User Account Button with Dropdown */}
            <div className="user-account-dropdown-wrap">
              <button 
                className={`action-btn ${user ? 'user-logged-in' : ''}`}
                onClick={() => user ? setIsUserMenuOpen(!isUserMenuOpen) : openLoginModal()}
                aria-label="User Account"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt="Profile" className="header-avatar-img" />
                ) : (
                  <User size={20} />
                )}
              </button>

              {user && isUserMenuOpen && (
                <div className="user-dropdown-menu animate-fade-in" onClick={() => setIsUserMenuOpen(false)}>
                  <div className="dropdown-user-header">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                    <span className={`user-role-badge ${user.role}`}>
                      {user.role === 'admin' ? '👑 Store Administrator' : '💖 VIP Muse'}
                    </span>
                  </div>

                  <div className="dropdown-links">
                    {user.role === 'admin' && (
                      <Link to="/admin" className="dropdown-item admin-item">
                        <Shield size={15} /> Admin Studio Dashboard
                      </Link>
                    )}
                    <Link to="/track-order" className="dropdown-item">
                      <Package size={15} /> Track Royal Order
                    </Link>
                    <Link to="/collections/all" className="dropdown-item">
                      <Heart size={15} /> My Wishlist ({wishlist.length})
                    </Link>
                    <button className="dropdown-item logout-item" onClick={logout}>
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button 
              className="action-btn cart-btn-bubble" 
              onClick={toggleCart} 
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="badge-count animate-bounce">{itemCount}</span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* 3. Search Overlay Modal */}
      {isSearchOpen && (
        <div className="search-modal-backdrop" onClick={() => setIsSearchOpen(false)}>
          <div className="search-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="search-bar-header">
              <div className="search-input-field">
                <Search size={22} className="search-icon-input" />
                <input 
                  type="text" 
                  placeholder="Search handwoven sarees, bridal lehengas, anarkalis..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              <button className="search-close-btn" onClick={() => setIsSearchOpen(false)}>
                <X size={22} />
              </button>
            </div>

            <div className="search-modal-body">
              <div className="quick-tags-wrap">
                <span className="quick-tag-label">Popular Searches:</span>
                {['Banarasi Sarees', 'Bridal Lehengas', 'Chanderi Anarkali', 'Mirror Sharara', 'Pre-draped Sarees', 'Haldi Kurta'].map(tag => (
                  <button 
                    key={tag} 
                    className="quick-tag-pill"
                    onClick={() => setSearchQuery(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="search-results-section mt-6">
                <div className="search-results-header">
                  <h4 className="search-section-title">
                    {searchQuery 
                      ? `Search Results for &ldquo;${searchQuery}&rdquo;`
                      : 'Royal Festive Silhouettes 👑'}
                  </h4>
                  {isSearching && (
                    <span className="search-loading-tag">
                      <Sparkles size={13} className="text-rose-deep animate-spin" /> Searching Ateliers...
                    </span>
                  )}
                </div>

                {searchQuery && !isSearching && searchResults.length === 0 ? (
                  <div className="search-empty-state text-center py-10">
                    <p className="text-muted mb-4">No royal heirlooms found matching &ldquo;{searchQuery}&rdquo;.</p>
                    <div className="empty-quick-links">
                      <Link to="/collections/sarees" className="btn btn-outline-pink" onClick={() => setIsSearchOpen(false)}>
                        Explore Sarees
                      </Link>
                      <Link to="/collections/lehengas" className="btn btn-outline-pink" onClick={() => setIsSearchOpen(false)}>
                        Explore Lehengas
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="search-grid">
                    {(searchQuery ? searchResults : popularItems).map(item => (
                      <Link 
                        key={item.id} 
                        to={`/products/${item.id}`} 
                        className="search-item-card"
                        onClick={() => setIsSearchOpen(false)}
                      >
                        <img src={item.image || (item.images && item.images[0]) || '/images/products/taasa-client-26.jpeg'} alt={item.title} />
                        <div className="search-item-info">
                          <span className="search-item-cat">{item.category}</span>
                          <h5>{item.title}</h5>
                          <span className="search-item-price">
                            {formatINR(item.price)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Mobile Menu Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-backdrop" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <div className="mobile-brand">
                <span>✨</span>
                <h2>Taasa.</h2>
              </div>
              <button className="icon-btn" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="mobile-menu-links">
              <Link to="/" className="mobile-link">Home</Link>
              <Link to="/collections/new" className="mobile-link">
                New Drops <span className="nav-pill-badge">✨ Royal '26</span>
              </Link>
              <Link to="/collections/kurtis" className="mobile-link">Kurtis (Short, Long, Shirts, Tunics) 🌸</Link>
              <Link to="/collections/dresses" className="mobile-link">Dresses & Anarkalis 👑</Link>
              <Link to="/collections/co-ord-set" className="mobile-link">Co-ord Sets ✨</Link>
              <Link to="/collections/two-piece-set" className="mobile-link">Two Piece Sets 💃</Link>
              <Link to="/collections/plus-size-collection" className="mobile-link">Plus Size Collection 💖</Link>
              <Link to="/collections/pants" className="mobile-link">Luxury Pants & Trousers 💎</Link>
              <Link to="/track" className="mobile-link">Track Royal Order 📦</Link>
              <Link to="/collections/sale" className="mobile-link text-rose-deep">Festive Sale (25% Off) 🏷️</Link>
            </div>

            <div className="mobile-menu-footer">
              <p className="mobile-promo-banner">👑 Use code <strong>RANI20</strong> for 20% OFF</p>
              <Link to="/collections/all" className="btn btn-cute-pink" style={{ width: '100%' }}>
                <span>Explore Royal Catalog 🌸</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
