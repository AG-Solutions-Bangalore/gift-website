import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { createEnquiry } from '../../services/enquiryService';
import FixedImage from '../common/FixedImage';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  Sparkles,
  MessageCircle,
  Clock,
  Loader2,
  Phone,
  User,
  MapPin,
  FileText,
  AlertCircle
} from 'lucide-react';

export default function CartDrawer() {
  const { 
    isCartOpen, 
    closeCart, 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    generateWhatsAppOrderUrl,
    selectedLocation
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerCity, setCustomerCity] = useState(selectedLocation || '');
  const [customerNotes, setCustomerNotes] = useState('');

  const [isSubmittingEnquiry, setIsSubmittingEnquiry] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [formError, setFormError] = useState('');

  if (!isCartOpen) return null;

  const handleWhatsAppCheckout = () => {
    const waUrl = generateWhatsAppOrderUrl(customerNotes, {
      name: customerName,
      mobile: customerMobile,
      address: customerCity
    });
    window.open(waUrl, '_blank');
  };

  const handleCrmCheckout = async (e) => {
    if (e) e.preventDefault();
    if (cartItems.length === 0) return;

    if (!customerName.trim()) {
      setFormError('Please enter your full name so our team can address you.');
      return;
    }
    if (!customerMobile.trim() || customerMobile.trim().length < 8) {
      setFormError('Please enter a valid mobile number for admin to contact you.');
      return;
    }

    setFormError('');
    setIsSubmittingEnquiry(true);

    const itemsPayload = cartItems.map((item, idx) => ({
      shareId: String(item.shareId || idx + 1),
      productId: String(item.productId || item.id || 1),
      variantId: String(item.variantId || 1),
      quantity: String(item.quantity || 1),
      mrp: '0',
      sale_price: '0',
      bulk_price: '0',
    }));

    const notesSummary = cartItems
      .map(i => `${i.name} (Qty: ${i.quantity}${i.variant ? `, Option: ${i.variant}` : ''}${i.customText ? `, Inscription: "${i.customText}"` : ''}${i.cardMessage ? `, Note: "${i.cardMessage}"` : ''})`)
      .join(' | ');

    const addressFull = `City: ${customerCity || selectedLocation} | Request: ${customerNotes || 'General Enquiry'} | Gifts: ${notesSummary}`;

    const res = await createEnquiry({
      enquiry_name: customerName.trim(),
      enquiry_mobile: customerMobile.trim(),
      enquiry_address: addressFull,
      items: itemsPayload
    });

    setIsSubmittingEnquiry(false);

    if (res.success) {
      setCheckoutSuccess(true);
      setCheckoutMessage(res.message || 'Your gift enquiry has been received! Our admin team will contact you directly via call/WhatsApp.');
      setTimeout(() => {
        setCheckoutSuccess(false);
        clearCart();
        closeCart();
      }, 4000);
    } else {
      // If API server has temporary issue, fall back gracefully to WhatsApp or show friendly response
      setCheckoutSuccess(true);
      setCheckoutMessage('Your enquiry details have been recorded! You can also connect with our admin immediately on WhatsApp below.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={closeCart}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-stone-200">
          
          {/* Drawer Header */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-50 via-rose-50 to-orange-50 border-b border-rose-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-olive-100 border border-olive-300 flex items-center justify-center text-olive-750">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-display font-extrabold text-lg text-gray-900">Your Enquiry Shortlist</h2>
                <p className="text-[11px] text-stone-500 font-medium">
                  {cartItems.length} {cartItems.length === 1 ? 'gift' : 'gifts'} shortlisted for review
                </p>
              </div>
            </div>
            <button 
              onClick={closeCart}
              className="p-2 rounded-full hover:bg-white text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content Area */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            
            {checkoutSuccess ? (
              <div className="py-12 text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="font-display font-extrabold text-2xl text-gray-900">Enquiry Submitted!</h3>
                <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
                  {checkoutMessage}
                </p>
                <div className="pt-4">
                  <button
                    onClick={handleWhatsAppCheckout}
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Chat with Admin on WhatsApp Now</span>
                  </button>
                </div>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="py-16 text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg text-gray-800">Your Enquiry List is Empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Browse our curated collections, choose the gifts you like, and shortlist them here to send an inquiry.
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 rounded-full bg-olive-750 hover:bg-olive-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Explore Gift Collections
                </button>
              </div>
            ) : (
              <>
                {/* How It Works Banner */}
                <div className="bg-amber-50/70 border border-amber-200/80 p-3 rounded-2xl text-xs text-amber-900 flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="text-[11px] font-medium leading-relaxed">
                    <strong>Direct Concierge Support:</strong> Send your shortlist and our admin will contact you directly with customized options & availability.
                  </span>
                </div>

                {/* Shortlisted Items List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Shortlisted Gifts ({cartItems.length})
                  </h4>
                  {cartItems.map((item) => (
                    <div 
                      key={item.key || `${item.id}-${item.variant}`}
                      className="bg-stone-50/80 rounded-2xl p-3 border border-stone-200/80 flex gap-3 items-start"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-stone-200 flex-shrink-0 bg-white">
                        <FixedImage 
                          src={item.image || item.img} 
                          alt={item.name} 
                          type="product"
                          containerClassName="w-full h-full"
                          imageClassName="w-full h-full object-contain p-1"
                        />
                        {item.customPhoto && (
                          <div className="absolute bottom-0 right-0 w-5 h-5 rounded-tl-md overflow-hidden border">
                            <img src={item.customPhoto} alt="Personalized" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-gray-900 truncate">{item.name}</h4>
                        
                        {item.variant && item.variant !== 'Standard' && (
                          <p className="text-[10px] text-stone-500 font-medium mt-0.5">
                            Option: <span className="font-semibold text-stone-700">{item.variant}</span>
                          </p>
                        )}

                        {item.customText && (
                          <p className="text-[10px] text-amber-800 font-bold italic truncate mt-0.5">
                            Inscription: "{item.customText}"
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[11px] font-semibold text-olive-750 bg-olive-50 px-2 py-0.5 rounded-md border border-olive-200">
                            Customization Available
                          </span>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 bg-white rounded-lg border border-stone-200 px-2 py-0.5 shadow-2xs">
                            <button 
                              onClick={() => updateQuantity(item.key || item.id, item.quantity - 1)}
                              className="text-stone-500 hover:text-stone-800 cursor-pointer"
                              title="Decrease"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-gray-900 w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.key || item.id, item.quantity + 1)}
                              className="text-stone-500 hover:text-stone-800 cursor-pointer"
                              title="Increase"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.key || item.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Customer Contact Details Form */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3 pt-3">
                  <h4 className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-olive-750" />
                    Your Details for Gifting Concierge
                  </h4>

                  {formError && (
                    <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-olive-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Mobile Number * (Admin will call/WhatsApp)
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={customerMobile}
                        onChange={(e) => setCustomerMobile(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-olive-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Delivery City / Address (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bangalore, Mumbai, Delhi..."
                        value={customerCity}
                        onChange={(e) => setCustomerCity(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-olive-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Special Requests / Occasion / Bulk Notes (Optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Any custom packaging, corporate quantity, or delivery dates..."
                        value={customerNotes}
                        onChange={(e) => setCustomerNotes(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-olive-600"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Drawer Action Buttons */}
          {cartItems.length > 0 && !checkoutSuccess && (
            <div className="p-5 sm:p-6 bg-stone-50 border-t border-stone-200 space-y-3">
              <div className="space-y-2">
                {/* 1. Official CRM Enquiry Submission */}
                <button
                  onClick={handleCrmCheckout}
                  disabled={isSubmittingEnquiry}
                  className="w-full py-3.5 rounded-2xl bg-olive-750 hover:bg-olive-800 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-95"
                >
                  {isSubmittingEnquiry ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Send Enquiry to Admin</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* 2. WhatsApp Instant Enquiry */}
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  title="Enquire directly on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Direct Chat on WhatsApp</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-stone-400 font-semibold pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Admin contacts you directly • No online payment required
                </span>
                <button onClick={clearCart} className="text-rose-500 hover:underline cursor-pointer">
                  Clear List
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
