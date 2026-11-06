/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from 'react';
import { validatePromoCode } from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 1. Persistent Cart Items
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('taasa_cart_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load cart from localStorage:', e);
    }
    // Default initial luxury piece
    return [
      {
        id: 90,
        title: 'Noor Rust Orange Flared Anarkali Dress',
        price: 5499.00,
        quantity: 1,
        image: '/images/products/taasa-client-01.jpeg',
        size: 'M',
        color: 'Rust Terracotta'
      }
    ];
  });

  // 2. Persistent Wishlist
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('taasa_wishlist_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load wishlist from localStorage:', e);
    }
    return [90, 81];
  });

  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);

  const FREE_SHIPPING_THRESHOLD = 4999.00;

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('taasa_cart_v1', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Failed to save cart to localStorage:', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('taasa_wishlist_v1', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Failed to save wishlist to localStorage:', e);
    }
  }, [wishlist]);

  const toggleCart = () => setIsCartOpen(prev => !prev);
  const closeCart = () => setIsCartOpen(false);
  const openCart = () => setIsCartOpen(true);

  const addToCart = (product, qty = 1, size = 'Free Size', color = 'Standard') => {
    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(
        item => item.id === product.id && item.size === size && item.color === color
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += qty;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            id: product.id,
            title: product.title,
            price: product.price || product.basePrice,
            quantity: qty,
            image: product.image || (product.images && product.images[0]),
            size: size,
            color: color
          }
        ];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (indexOrId) => {
    setCartItems(prev => prev.filter((_, idx) => idx !== indexOrId && prev[idx]?.id !== indexOrId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateQuantity = (index, delta) => {
    setCartItems(prev => {
      const updated = [...prev];
      if (updated[index]) {
        const newQty = updated[index].quantity + delta;
        if (newQty <= 0) {
          return updated.filter((_, i) => i !== index);
        }
        updated[index].quantity = newQty;
      }
      return updated;
    });
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  const applyDiscount = async (code) => {
    const cleanCode = code ? code.trim().toUpperCase() : '';
    if (!cleanCode) return { success: false, message: 'Please enter a promo code.' };

    const currentSubtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // 1. Try Live Backend Database Validation
    try {
      const res = await validatePromoCode(cleanCode, currentSubtotal);
      if (res?.data) {
        const promo = res.data;
        const rate = promo.discountType === 'PERCENTAGE' ? (promo.rate ?? promo.value) : null;
        const fixedAmount = (promo.discountType === 'FIXED' || promo.discountType === 'FIXED_AMOUNT')
          ? (promo.discountAmount ?? promo.value ?? promo.fixedAmount)
          : null;
        const label = promo.label || (promo.discountType === 'PERCENTAGE'
          ? `${Math.round((rate || 0) * 100)}% OFF (${promo.code})`
          : `₹${Number(fixedAmount || 0).toLocaleString('en-IN')} OFF (${promo.code})`);

        setAppliedDiscount({
          code: promo.code,
          rate,
          fixedAmount,
          label
        });
        return { success: true, message: res.message || `${label} applied! 💖` };
      }
    } catch (err) {
      if (err.message && !err.message.includes('failed')) {
        return { success: false, message: err.message };
      }
    }

    // 2. Local Fallback Codes
    if (cleanCode === 'RANI20' || cleanCode === 'MUSE20' || cleanCode === 'CUTE20') {
      setAppliedDiscount({ code: cleanCode, rate: 0.20, label: `20% OFF (${cleanCode})` });
      return { success: true, message: '20% Royal discount applied! 💖' };
    }
    if (cleanCode === 'SHAADI25') {
      if (currentSubtotal < 12000) {
        return { success: false, message: 'SHAADI25 requires a minimum order of ₹12,000.' };
      }
      setAppliedDiscount({ code: cleanCode, rate: 0.25, label: `25% OFF (${cleanCode})` });
      return { success: true, message: '25% Royal Shaadi discount applied! ✨' };
    }
    if (cleanCode === 'NOOR15' || cleanCode === 'MUSE15') {
      setAppliedDiscount({ code: cleanCode, rate: 0.15, label: `15% OFF (${cleanCode})` });
      return { success: true, message: '15% Off coupon applied! ✨' };
    }
    if (cleanCode === 'UTSAV50') {
      if (currentSubtotal < 15000) {
        return { success: false, message: 'UTSAV50 requires a minimum order of ₹15,000.' };
      }
      setAppliedDiscount({ code: cleanCode, fixedAmount: 4000.00, label: '₹4,000 OFF (UTSAV50)' });
      return { success: true, message: '₹4,000 Festive discount applied! 🌸' };
    }
    return { success: false, message: 'Invalid promo code. Try RANI20, SHAADI25, or UTSAV50!' };
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = appliedDiscount
    ? (appliedDiscount.rate !== undefined && appliedDiscount.rate !== null
        ? (subtotal * appliedDiscount.rate)
        : Math.min(subtotal, appliedDiscount.fixedAmount || 0))
    : 0;
  const cartTotal = Math.max(0, subtotal - discountAmount);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);
  const freeShippingProgress = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <CartContext.Provider value={{
      isCartOpen,
      toggleCart,
      closeCart,
      openCart,
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      updateQuantity,
      subtotal,
      discountAmount,
      cartTotal,
      itemCount,
      wishlist,
      toggleWishlist,
      isInWishlist,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      amountToFreeShipping,
      freeShippingProgress,
      discountCode,
      setDiscountCode,
      appliedDiscount,
      applyDiscount
    }}>
      {children}
    </CartContext.Provider>
  );
};
