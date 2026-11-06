import { X, ShoppingBag, Plus, Minus, Trash2, Sparkles, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProducts } from '../services/api';
import { formatINR } from '../utils/currency';
import './CartDrawer.css';

const UPSELL_PRODUCTS = [
  { id: 104, title: 'Classic Ivory Tailored Cotton Cigarette Pants', price: 1499.00, image: '/images/products/taasa-client-40.jpeg' },
  { id: 81, title: 'Noorani Ivory Threadwork Short Kurti', price: 2499.00, image: '/images/products/taasa-client-26.jpeg' }
];

const CartDrawer = () => {
  const { 
    isCartOpen, 
    closeCart, 
    cartItems, 
    cartTotal, 
    subtotal,
    discountAmount,
    updateQuantity, 
    removeFromCart,
    addToCart,
    amountToFreeShipping,
    freeShippingProgress,
    appliedDiscount,
    applyDiscount
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState(null);
  const [upsells, setUpsells] = useState(UPSELL_PRODUCTS);

  useEffect(() => {
    getProducts({ limit: 3 }).then(res => {
      if (res?.data && res.data.length > 0) {
        const dynamicUpsells = res.data.slice(0, 2).map(p => ({
          id: p.id,
          title: p.title,
          price: p.salePrice || p.basePrice,
          image: p.image
        }));
        setUpsells(dynamicUpsells);
      }
    }).catch(() => {});
  }, []);

  if (!isCartOpen) return null;

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    if (!promoInput) return;
    const res = await applyDiscount(promoInput);
    setPromoMsg(res);
  };

  return (
    <>
      <div className="cart-backdrop animate-fade-in" onClick={closeCart}></div>
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        
        {/* Cart Header */}
        <div className="cart-header">
          <div className="cart-title-wrap">
            <span className="cart-badge-icon">💖</span>
            <h2 className="cart-title">Your Cute Bag</h2>
            <span className="cart-count-pill">{cartItems.reduce((a, b) => a + b.quantity, 0)} items</span>
          </div>
          <button className="cart-close-btn" onClick={closeCart} aria-label="Close Bag">
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="shipping-progress-container">
          <div className="shipping-progress-text">
            {amountToFreeShipping > 0 ? (
              <>
                <span>Add <strong>{formatINR(amountToFreeShipping)}</strong> more for <strong>FREE Shipping across India!</strong></span>
                <span>🌸</span>
              </>
            ) : (
              <>
                <span className="shipping-unlocked">✨ <strong>YAY! You unlocked FREE Shipping!</strong></span>
                <span>🎁</span>
              </>
            )}
          </div>
          <div className="shipping-progress-bar">
            <div 
              className="shipping-progress-fill" 
              style={{ width: `${freeShippingProgress}%` }}
            >
              <span className="progress-sparkle">✨</span>
            </div>
          </div>
        </div>

        {/* Cart Body */}
        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart-state">
              <div className="empty-cart-icon-bubble">
                <ShoppingBag size={40} className="empty-bag-icon" />
                <span className="empty-floating-sparkle">✨</span>
              </div>
              <h3 className="empty-cart-title">Your bag is currently empty</h3>
              <p className="empty-cart-subtitle">Find your next viral outfit from our latest drops!</p>
              <Link to="/collections/all" className="btn btn-cute-pink mt-6" onClick={closeCart}>
                <span>Start Shopping 🌸</span>
              </Link>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="cart-item-card">
                  <div className="cart-item-img-wrap">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-top">
                      <h4 className="cart-item-name">{item.title}</h4>
                      <button 
                        className="cart-remove-btn" 
                        onClick={() => removeFromCart(index)}
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="cart-item-meta">
                      {item.size && <span className="item-tag">Size: {item.size}</span>}
                      {item.color && <span className="item-tag">{item.color}</span>}
                    </div>

                    <div className="cart-item-bottom">
                      <div className="cart-qty-selector">
                        <button onClick={() => updateQuantity(index, -1)} aria-label="Decrease quantity">
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(index, 1)} aria-label="Increase quantity">
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="cart-item-pricing">
                        <span className="cart-item-price">{formatINR(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Cute Upsell Recommendation */}
              <div className="cart-upsell-section">
                <div className="upsell-header">
                  <Sparkles size={14} className="text-rose" />
                  <span>Complete Your Vibe</span>
                </div>
                <div className="upsell-items">
                  {upsells.map(up => (
                    <div key={up.id} className="upsell-card">
                      <img src={up.image} alt={up.title} />
                      <div className="upsell-info">
                        <h5>{up.title}</h5>
                        <span>{formatINR(up.price)}</span>
                      </div>
                      <button 
                        className="btn-upsell-add"
                        onClick={() => addToCart(up, 1, 'One Size', 'Standard')}
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cart Footer */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            {/* Promo Code Form */}
            <form className="cart-promo-form" onSubmit={handleApplyPromo}>
              <div className="promo-input-wrapper">
                <Tag size={16} className="promo-icon" />
                <input 
                  type="text" 
                  placeholder="Promo code (e.g. RANI20, UTSAV50)" 
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                />
                <button type="submit" className="btn-apply-promo">Apply</button>
              </div>
              {promoMsg && (
                <span className={`promo-feedback ${promoMsg.success ? 'success' : 'error'}`}>
                  {promoMsg.message}
                </span>
              )}
            </form>

            <div className="cart-totals-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              {appliedDiscount && (
                <div className="summary-row discount-row">
                  <span>{appliedDiscount.label}</span>
                  <span>-{formatINR(discountAmount)}</span>
                </div>
              )}
              <div className="summary-row total-row">
                <span>Total</span>
                <span className="final-total">{formatINR(cartTotal)}</span>
              </div>
            </div>

            <Link 
              to="/checkout" 
              className="btn btn-cute-pink btn-checkout-glow"
              onClick={closeCart}
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight size={18} />
            </Link>

            <div className="checkout-trust-badge">
              <ShieldCheck size={14} />
              <span>Guaranteed Safe & Secure Checkout</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
