import React, {  useState  } from 'react';
import { Heart, Star, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/currency';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors ? product.colors[0] : null);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  // Default secondary image or fallback
  const primaryImage = product.image || (product.images && product.images[0]);
  const hoverImage = product.hoverImage || (product.images && product.images[1]) || primaryImage;

  const handleQuickAdd = (e, size = 'S') => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, size, selectedColor?.name || 'Standard');
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1800);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="product-card group">
      
      {/* 1. Image & Overlays */}
      <div className="product-img-container">
        
        {/* Badges */}
        <div className="product-badges-wrap">
          {product.badge && (
            <span className={`product-badge ${product.badge.includes('Off') || product.badge.includes('%') ? 'badge-sale' : 'badge-viral'}`}>
              {product.badge}
            </span>
          )}
          {product.isNew && <span className="product-badge badge-new">🌸 New</span>}
        </div>

        {/* Floating Wishlist Button */}
        <button 
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={17} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        {/* Product Images with Hover Switch */}
        <Link to={`/products/${product.id}`} className="product-img-link">
          <img 
            src={primaryImage} 
            alt={product.title} 
            className="product-img primary-img" 
            loading="lazy" 
          />
          {hoverImage && hoverImage !== primaryImage && (
            <img 
              src={hoverImage} 
              alt={`${product.title} alternate`} 
              className="product-img hover-img" 
              loading="lazy" 
            />
          )}
        </Link>

        {/* Quick Size Picker on Hover */}
        <div className="product-quick-add-overlay">
          <span className="quick-add-title">Quick Add Size:</span>
          <div className="quick-sizes-row">
            {['XS', 'S', 'M', 'L'].map(size => (
              <button 
                key={size} 
                className="size-pill-btn"
                onClick={(e) => handleQuickAdd(e, size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Added Success Toast Overlay */}
        {addedSuccess && (
          <div className="added-success-toast">
            <Check size={14} /> Added to Bag 💖
          </div>
        )}

      </div>

      {/* 2. Product Information */}
      <div className="product-info-box">
        
        <div className="product-meta-row">
          <span className="product-tag">
            {product.category || 'Collection'}{product.subcategory ? ` • ${product.subcategory}` : ''}
          </span>
          {product.rating && (
            <div className="product-stars">
              <Star size={12} fill="#ffb703" color="#ffb703" />
              <span>{product.rating}</span>
            </div>
          )}
        </div>

        <h3 className="product-title">
          <Link to={`/products/${product.id}`}>{product.title}</Link>
        </h3>

        {/* Pricing */}
        <div className="product-price-row">
          <span className="current-price">{formatINR(product.price)}</span>
          {product.oldPrice && (
            <span className="old-price">{formatINR(product.oldPrice)}</span>
          )}
          {product.oldPrice && (
            <span className="discount-pct">
              Save {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Color Swatches */}
        {product.swatches && product.swatches.length > 0 && (
          <div className="product-swatches-wrap">
            {product.swatches.map((colorHex, idx) => (
              <button 
                key={idx} 
                className={`swatch-circle ${selectedColor?.hex === colorHex ? 'active' : ''}`}
                style={{ backgroundColor: colorHex }}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedColor({ hex: colorHex });
                }}
                aria-label={`Select color swatch ${idx + 1}`}
              />
            ))}
            <span className="swatch-text-more">+{product.swatches.length} colors</span>
          </div>
        )}

      </div>

    </div>
  );
};

export default ProductCard;
