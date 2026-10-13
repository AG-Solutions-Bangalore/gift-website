import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

export const CURRENCY_RATES = {
  INR: { symbol: '₹', rate: 1, label: 'INR (₹)' },
  USD: { symbol: '$', rate: 0.012, label: 'USD ($)' },
  AED: { symbol: 'AED ', rate: 0.044, label: 'AED (د.إ)' },
  GBP: { symbol: '£', rate: 0.0094, label: 'GBP (£)' },
  EUR: { symbol: '€', rate: 0.011, label: 'EUR (€)' },
};

export const DELIVERY_SLOTS = [
  { id: 'standard', name: 'Standard Courier', time: '10:00 AM - 07:00 PM', price: 0, tag: 'Free' },
  { id: 'express', name: 'Express 2-Hour', time: 'Within 120 Mins', price: 99, tag: '⚡ Fast' },
  { id: 'midnight', name: 'Midnight Surprise', time: '11:00 PM - 12:00 AM', price: 199, tag: '🌙 Most Loved' },
  { id: 'morning', name: 'Early Morning', time: '07:00 AM - 09:00 AM', price: 149, tag: '🌅 Sunrise' },
];

export const CURATED_ADDONS = [
  { id: 'addon-1', name: 'Sparkler Birthday Candles', price: 99, originalPrice: 149, image: '/images/home/flower_coll_1.png', category: 'Candles' },
  { id: 'addon-2', name: 'Ferrero Rocher Mini (4 Pcs)', price: 249, originalPrice: 299, image: '/images/home/flower_coll_3.png', category: 'Chocolates' },
  { id: 'addon-3', name: 'Cute Mini Teddy Bear (6")', price: 199, originalPrice: 299, image: '/images/home/Giftsformissypu.png', category: 'Plushie' },
  { id: 'addon-4', name: 'Metallic Heart Balloon Bunch', price: 149, originalPrice: 249, image: '/images/home/GiftsforLove.png', category: 'Balloons' },
  { id: 'addon-5', name: 'Musical Greeting Card with QR', price: 129, originalPrice: 199, image: '/images/home/gift_personalised.png', category: 'Cards' },
];

export function CartProvider({ children }) {
  // ── Cart Items State (Persisted in localStorage) ──
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('giftora_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // ── Wishlist State (Persisted in localStorage) ──
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('giftora_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // ── Recently Viewed State (Persisted in localStorage) ──
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const saved = localStorage.getItem('giftora_recently_viewed');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // ── Coupon State ──
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // ── Location State ──
  const [selectedLocation, setSelectedLocation] = useState(() => {
    try {
      return localStorage.getItem('giftora_location') || 'Bangalore';
    } catch (e) {
      return 'Bangalore';
    }
  });

  // ── Delivery Preferences ──
  const [selectedSlot, setSelectedSlot] = useState(DELIVERY_SLOTS[0]);
  const [selectedDate, setSelectedDate] = useState('Today (Express)');

  // ── Modals & Drawers States ──
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  // ── Currency State ──
  const [selectedCurrency, setSelectedCurrency] = useState('INR');

  const formatPrice = useCallback((inrAmount) => {
    const curr = CURRENCY_RATES[selectedCurrency] || CURRENCY_RATES.INR;
    const converted = Math.round((Number(inrAmount) || 0) * curr.rate);
    return `${curr.symbol}${converted.toLocaleString('en-IN')}`;
  }, [selectedCurrency]);

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('giftora_cart', JSON.stringify(cartItems));
    } catch (e) {}
  }, [cartItems]);

  // Persist wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('giftora_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  // Persist recently viewed to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('giftora_recently_viewed', JSON.stringify(recentlyViewed));
    } catch (e) {}
  }, [recentlyViewed]);

  // Persist location to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('giftora_location', selectedLocation);
    } catch (e) {}
  }, [selectedLocation]);

  // ── Wishlist Actions ──
  const toggleWishlist = useCallback((product) => {
    if (!product) return;
    setWishlist((prev) => {
      const exists = prev.some((item) => String(item.id) === String(product.id));
      if (exists) {
        return prev.filter((item) => String(item.id) !== String(product.id));
      }
      return [
        {
          id: product.id,
          name: product.name || product.title,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.img || product.image,
          category: product.category || 'Gifts',
          brand: product.brand || '',
          rating: product.rating || 4.8,
        },
        ...prev,
      ];
    });
  }, []);

  const isInWishlist = useCallback((productId) => {
    return wishlist.some((item) => String(item.id) === String(productId));
  }, [wishlist]);

  // ── Recently Viewed Actions ──
  const addRecentlyViewed = useCallback((product) => {
    if (!product || !product.id) return;
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((item) => String(item.id) !== String(product.id));
      return [
        {
          id: product.id,
          name: product.name || product.title,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.img || product.image,
          category: product.category || 'Gifts',
          brand: product.brand || '',
          rating: product.rating || 4.8,
        },
        ...filtered.slice(0, 10),
      ];
    });
  }, []);

  // ── Cart Actions ──
  const addToCart = useCallback((product, options = {}) => {
    const qty = typeof options === 'number' ? options : (options.quantity || 1);
    const variantObj = typeof options === 'object' ? options.variant : null;
    const variantId = typeof options === 'object' ? (options.variantId || variantObj?.id || 1) : 1;
    const variantName = typeof options === 'object' ? (options.variantName || (variantObj ? variantObj.sku || 'Selected Option' : 'Standard')) : 'Standard';
    const deliveryDate = typeof options === 'object' ? (options.deliveryDate || selectedDate) : selectedDate;
    const deliverySlot = typeof options === 'object' ? (options.deliverySlot || selectedSlot?.name || 'Standard Delivery') : selectedSlot?.name;
    const cardMessage = typeof options === 'object' ? (options.cardMessage || '') : '';
    const customPhoto = typeof options === 'object' ? (options.customPhoto || null) : null;
    const customText = typeof options === 'object' ? (options.customText || '') : '';
    const itemPrice = typeof options === 'object' && options.price !== undefined ? options.price : (product.price || 999);
    const itemOriginalPrice = typeof options === 'object' && options.originalPrice !== undefined ? options.originalPrice : (product.originalPrice || Math.round(itemPrice * 1.25));

    setCartItems((prevItems) => {
      const itemKey = `${product.id}-${variantId}-${deliveryDate}`;
      const existingIndex = prevItems.findIndex((item) => item.key === itemKey);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += qty;
        return updated;
      }

      return [
        ...prevItems,
        {
          key: itemKey,
          id: product.id,
          productId: product.id,
          variantId,
          name: product.name || product.title || 'Curated Gift',
          price: itemPrice,
          originalPrice: itemOriginalPrice,
          image: (variantObj?.image) || product.img || product.image || '/images/home/flower_coll_1.png',
          quantity: qty,
          deliveryDate,
          deliverySlot,
          cardMessage,
          customPhoto,
          customText,
          variant: variantName,
          category: product.category || 'Gifts',
          brand: product.brand || '',
        },
      ];
    });

    setIsCartOpen(true);
  }, [selectedDate, selectedSlot]);

  const removeFromCart = useCallback((itemKeyOrId) => {
    setCartItems((prev) => prev.filter((item) => item.key !== itemKeyOrId && String(item.id) !== String(itemKeyOrId)));
  }, []);

  const updateQuantity = useCallback((itemKeyOrId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(itemKeyOrId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.key === itemKeyOrId || String(item.id) === String(itemKeyOrId) ? { ...item, quantity: newQty } : item))
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setAppliedCoupon(null);
  }, []);

  // ── Coupon Logic ──
  const applyCoupon = useCallback((code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'GIFTORA10' || cleanCode === 'SURPRISE10') {
      setAppliedCoupon({ code: cleanCode, discountPercent: 10 });
      return { success: true, message: `Coupon ${cleanCode} applied! 10% instant discount.` };
    } else if (cleanCode === 'WELCOME50' || cleanCode === 'FESTIVE50') {
      setAppliedCoupon({ code: cleanCode, discountFlat: 50 });
      return { success: true, message: `Coupon ${cleanCode} applied! Flat ₹50 OFF.` };
    } else if (cleanCode === 'MIDNIGHT100') {
      setAppliedCoupon({ code: cleanCode, discountFlat: 100 });
      return { success: true, message: 'Coupon MIDNIGHT100 applied! Flat ₹100 OFF.' };
    }
    return { success: false, message: 'Invalid code. Try GIFTORA10, WELCOME50 or MIDNIGHT100.' };
  }, []);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  // ── WhatsApp Enquiry Link Generator ──
  const generateWhatsAppOrderUrl = useCallback((extraNotes = '', customerInfo = {}) => {
    const phoneNumber = '918867171060';
    let text = `🎁 *GIFT ENQUIRY - MEMORY CREATORS*\n`;
    if (customerInfo?.name) text += `👤 *Customer Name:* ${customerInfo.name}\n`;
    if (customerInfo?.mobile) text += `📱 *Phone:* ${customerInfo.mobile}\n`;
    text += `📍 *Delivery City:* ${customerInfo?.address || selectedLocation}\n`;
    if (selectedDate) text += `📅 *Preferred Date:* ${selectedDate} | *Slot:* ${selectedSlot?.name || 'Standard'}\n\n`;
    text += `📋 *Shortlisted Gifts (${cartItems.length}):*\n`;

    cartItems.forEach((item, idx) => {
      text += `${idx + 1}. *${item.name}* (Qty: ${item.quantity})\n`;
      if (item.variant && item.variant !== 'Standard') text += `   • Option/Size: ${item.variant}\n`;
      if (item.customText) text += `   • Inscription: "${item.customText}"\n`;
      if (item.cardMessage) text += `   • Note: "${item.cardMessage}"\n`;
    });

    if (extraNotes) text += `\n📝 *Special Request:* ${extraNotes}\n`;
    text += `\n_Hello! I am inquiring about these curated gifts from your website. Please contact me directly regarding availability and customization._ ✨`;

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
  }, [cartItems, selectedLocation, selectedDate, selectedSlot]);

  // ── Calculated Values ──
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountFlat) {
      discountAmount = appliedCoupon.discountFlat;
    }
  }

  const slotFee = selectedSlot?.price || 0;
  const standardFee = subtotal > 0 ? (subtotal > 1499 ? 0 : 49) : 0;
  const deliveryFee = slotFee > 0 ? slotFee : standardFee;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        discountAmount,
        deliveryFee,
        grandTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        wishlist,
        wishlistCount,
        toggleWishlist,
        isInWishlist,
        recentlyViewed,
        addRecentlyViewed,
        selectedLocation,
        setSelectedLocation,
        selectedCurrency,
        setSelectedCurrency,
        selectedSlot,
        setSelectedSlot,
        selectedDate,
        setSelectedDate,
        formatPrice,
        generateWhatsAppOrderUrl,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        isWishlistOpen,
        openWishlist: () => setIsWishlistOpen(true),
        closeWishlist: () => setIsWishlistOpen(false),
        isLocationModalOpen,
        openLocationModal: () => setIsLocationModalOpen(true),
        closeLocationModal: () => setIsLocationModalOpen(false),
        isRemindersModalOpen,
        openRemindersModal: () => setIsRemindersModalOpen(true),
        closeRemindersModal: () => setIsRemindersModalOpen(false),
        isFinderOpen,
        openFinder: () => setIsFinderOpen(true),
        closeFinder: () => setIsFinderOpen(false),
        isTrackerOpen,
        openTracker: () => setIsTrackerOpen(true),
        closeTracker: () => setIsTrackerOpen(false),
        selectedProduct,
        openProductModal: (product) => {
          setSelectedProduct(product);
          if (product) addRecentlyViewed(product);
        },
        closeProductModal: () => setSelectedProduct(null),
        addons: CURATED_ADDONS,
        deliverySlots: DELIVERY_SLOTS,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
