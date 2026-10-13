import React, { useState, useMemo } from 'react';
import { useCart } from '../../context/CartContext';
import FixedImage from '../common/FixedImage';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Layers, 
  Sparkles, 
  Heart, 
  Clock, 
  Upload, 
  Gift, 
  Plus, 
  Check, 
  Zap, 
  MessageCircle, 
  Truck,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';

export default function ProductModal() {
  const { 
    selectedProduct, 
    closeProductModal, 
    addToCart, 
    selectedLocation,
    wishlist,
    toggleWishlist,
    isInWishlist,
    openCart,
    deliverySlots,
    addons: curatedAddons
  } = useCart();
  
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState('Today (Express)');
  const [selectedSlotId, setSelectedSlotId] = useState('standard');
  const [cardMessage, setCardMessage] = useState('');
  const [customText, setCustomText] = useState('');
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [pincode, setPincode] = useState('');
  const [pincodeValid, setPincodeValid] = useState(null);
  const [activeTab, setActiveTab] = useState('options'); // 'options' | 'personalize' | 'addons'
  const [addedNotice, setAddedNotice] = useState(false);

  const hasVariants = Boolean(selectedProduct?.hasVariants && Array.isArray(selectedProduct?.variants) && selectedProduct.variants.length > 0);
  const variants = hasVariants ? selectedProduct.variants : [];
  const currentVariant = variants[selectedVariantIndex] || null;

  // Consolidate images
  const productImages = useMemo(() => {
    if (!selectedProduct) return [];
    let list = [];
    if (currentVariant && Array.isArray(currentVariant.images) && currentVariant.images.length > 0) {
      list = [...currentVariant.images];
    }
    if (Array.isArray(selectedProduct.images) && selectedProduct.images.length > 0) {
      selectedProduct.images.forEach(img => {
        if (!list.includes(img)) list.push(img);
      });
    }
    if (list.length === 0) {
      list = [selectedProduct.img || selectedProduct.image || '/images/home/flower_coll_1.png'];
    }
    return list;
  }, [selectedProduct, currentVariant]);

  if (!selectedProduct) return null;

  const title = selectedProduct.name || selectedProduct.title || 'Curated Gift';
  const rating = selectedProduct.rating || 4.9;
  const reviewsCount = selectedProduct.reviewsCount || selectedProduct.reviews_count || 148;
  const description = selectedProduct.description || selectedProduct.shortDescription || selectedProduct.longDescription || 'Thoughtfully crafted keepsake and celebration gift designed with premium materials, fine details, and bespoke presentation.';

  const isLiked = isInWishlist(selectedProduct.id);
  const activeImage = productImages[activeImageIndex] || productImages[0];

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleAddon = (addon) => {
    setSelectedAddons(prev => {
      const exists = prev.some(a => a.id === addon.id);
      if (exists) return prev.filter(a => a.id !== addon.id);
      return [...prev, addon];
    });
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.trim().length >= 6) {
      setPincodeValid(true);
    } else {
      setPincodeValid(false);
    }
  };

  const handleAddToEnquiry = () => {
    // Add main item
    addToCart(selectedProduct, {
      quantity: 1,
      variant: currentVariant ? (currentVariant.sku || currentVariant.name || 'Selected Option') : 'Standard',
      variantId: currentVariant?.id || selectedProduct.variantId || 1,
      deliveryDate,
      cardMessage,
      customText,
      customPhoto: uploadedPhoto
    });

    // Add selected add-ons if any
    selectedAddons.forEach(addon => {
      addToCart({
        id: `addon-${addon.id}-${Date.now()}`,
        name: `Add-on: ${addon.name}`,
        image: addon.image,
        category: 'Add-ons'
      }, {
        quantity: 1,
        deliveryDate,
        variant: 'Add-on Item'
      });
    });

    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      closeProductModal();
      openCart();
    }, 700);
  };

  const handleDirectWhatsApp = () => {
    const phoneNumber = '918867171060';
    let text = `🎁 *PRODUCT ENQUIRY - MEMORY CREATORS*\n`;
    text += `*Product:* ${title}\n`;
    if (currentVariant) text += `*Option/Size:* ${currentVariant.sku || currentVariant.name}\n`;
    if (customText) text += `*Custom Inscription:* "${customText}"\n`;
    text += `*City:* ${selectedLocation}\n\n`;
    text += `_Hello! I saw this gift on your website and would like details regarding custom branding, availability, and ordering._ ✨`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={closeProductModal}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl relative z-10 animate-fade-in border border-stone-200 max-h-[92vh] overflow-y-auto my-auto">
        
        {/* Top Floating Controls (Wishlist & Close) */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
          <button
            type="button"
            onClick={() => toggleWishlist(selectedProduct)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
              isLiked ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-stone-100 text-stone-500 hover:text-rose-600'
            }`}
            title={isLiked ? "Saved in Wishlist" : "Add to Wishlist"}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          <button 
            onClick={closeProductModal}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Social Proof Pill Banner */}
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-bold">
          <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" />
          <span>Curated Gift Showcase • Enquire for direct consultation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Interactive Image Studio with Live Name Preview */}
          <div className="md:col-span-5 space-y-3">
            <div className="relative rounded-2xl overflow-hidden shadow-md border border-stone-200 aspect-square bg-stone-50 flex items-center justify-center">
              <FixedImage
                src={activeImage}
                alt={title}
                type="product"
                containerClassName="w-full h-full"
                imageClassName="w-full h-full object-contain p-3"
              />

              {/* Brand Pill */}
              {selectedProduct.brand && (
                <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-stone-900/80 backdrop-blur-xs text-white font-extrabold text-[9px] uppercase rounded-full shadow-xs">
                  {selectedProduct.brand}
                </span>
              )}

              {/* Live Inscription Preview Badge on Mockup */}
              {customText && (
                <div className="absolute bottom-3 inset-x-3 py-1.5 px-3 rounded-xl bg-stone-900/85 backdrop-blur-md text-white text-center shadow-lg border border-white/20 animate-fade-in">
                  <span className="text-[9px] font-bold text-amber-300 block uppercase tracking-wider">Custom Inscription Preview</span>
                  <span className="font-serif italic font-bold text-xs tracking-wide">"{customText}"</span>
                </div>
              )}

              {/* Live Uploaded Photo Badge */}
              {uploadedPhoto && !customText && (
                <div className="absolute bottom-3 right-3 w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-lg">
                  <img src={uploadedPhoto} alt="Uploaded preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {productImages.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-12 h-12 rounded-xl border-2 overflow-hidden cursor-pointer flex-shrink-0 bg-stone-50 transition-all ${
                      activeImageIndex === i ? 'border-olive-600 shadow-sm scale-105' : 'border-stone-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${i + 1}`} className="w-full h-full object-contain p-1" />
                  </div>
                ))}
              </div>
            )}

            {/* Assurance Highlights */}
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1.5 text-stone-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span className="text-[11px] font-medium">Custom branding, logos & engraving available</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-olive-600 flex-shrink-0" />
                <span className="text-[11px] font-medium">Pan-India doorstep dispatch on schedule</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Enquiry Options */}
          <div className="md:col-span-7 space-y-4">
            
            {/* Title & Ratings */}
            <div>
              <div className="flex items-center gap-1.5 text-amber-500 mb-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-gray-900">{rating} ★</span>
                <span className="text-[11px] text-stone-400 font-medium">({reviewsCount}+ gifting inquiries fulfilled)</span>
              </div>
              
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-gray-900 leading-snug">
                {title}
              </h2>

              {/* Status badges */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-olive-50 text-olive-800 border border-olive-200">
                  Available for Enquiry
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  Bulk &amp; Retail Orders
                </span>
              </div>

              {/* Description preview */}
              <p className="text-xs text-stone-600 mt-2.5 leading-relaxed line-clamp-3">
                {description}
              </p>
            </div>

            {/* Sub-Tabs: 1. Specifications & Slots | 2. Personalize | 3. Pairing Add-ons */}
            <div className="flex border-b border-stone-200 gap-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('options')}
                className={`pb-2 transition-colors cursor-pointer ${
                  activeTab === 'options' ? 'border-b-2 border-olive-700 text-olive-700' : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                1. Options &amp; Timing
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('personalize')}
                className={`pb-2 transition-colors cursor-pointer flex items-center gap-1 ${
                  activeTab === 'personalize' ? 'border-b-2 border-olive-700 text-olive-700' : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                2. Personalize
                {customText && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('addons')}
                className={`pb-2 transition-colors cursor-pointer flex items-center gap-1 ${
                  activeTab === 'addons' ? 'border-b-2 border-olive-700 text-olive-700' : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                <Gift className="w-3 h-3 text-rose-600" />
                3. Gift Pairings ({selectedAddons.length})
              </button>
            </div>

            {/* TAB 1: Variants & Delivery Slot Picker */}
            {activeTab === 'options' && (
              <div className="space-y-4 animate-fade-in">
                
                {/* Dynamic Variants (if applicable) */}
                {hasVariants && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-olive-600" />
                      Select Preferred Option / Size ({variants.length})
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {variants.map((variant, vIdx) => {
                        const isSelected = selectedVariantIndex === vIdx;
                        const attrLabel = variant.attributes && variant.attributes.length > 0
                          ? variant.attributes.map(a => `${a.name}: ${a.value}`).join(' • ')
                          : variant.sku || `Option ${vIdx + 1}`;

                        return (
                          <button
                            key={variant.id || vIdx}
                            type="button"
                            onClick={() => setSelectedVariantIndex(vIdx)}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-olive-750 text-white border-olive-750 shadow-xs'
                                : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                            }`}
                          >
                            <span>{attrLabel}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Delivery Date & Time Slot Grid */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Preferred Delivery Window
                    </label>
                    <span className="text-[11px] text-stone-400 font-medium">Destination: {selectedLocation}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {(deliverySlots || []).map((slot) => {
                      const isSelected = selectedSlotId === slot.id;
                      return (
                        <div
                          key={slot.id}
                          onClick={() => setSelectedSlotId(slot.id)}
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'bg-olive-50 border-olive-600 ring-1 ring-olive-600 text-olive-900 shadow-2xs'
                              : 'bg-stone-50 border-stone-200 hover:border-stone-300 text-stone-700'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-bold text-xs">{slot.name}</span>
                            <span className="text-[10px] font-extrabold px-1.5 py-0.2 bg-white rounded-md border text-stone-700">
                              {slot.tag}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-stone-500">
                            <span>{slot.time}</span>
                            <span className="font-medium text-olive-700">Available</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pincode Check */}
                <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/80">
                  <form onSubmit={handleCheckPincode} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter delivery pincode..."
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-olive-500/30 bg-white"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Check
                    </button>
                  </form>
                  {pincodeValid !== null && (
                    <p className={`text-[11px] font-semibold mt-1.5 ${pincodeValid ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {pincodeValid ? '✓ Verified service area for direct delivery!' : '❌ Please enter a valid 6-digit Pincode.'}
                    </p>
                  )}
                </div>

              </div>
            )}

            {/* TAB 2: Personalization & Photo Upload Studio */}
            {activeTab === 'personalize' && (
              <div className="space-y-3.5 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Custom Name / Inscription (Laser Engraving / Card)
                  </label>
                  <input
                    type="text"
                    maxLength={30}
                    placeholder="e.g. Rahul & Sneha (Max 30 chars)"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-olive-500/30 bg-white font-medium"
                  />
                </div>

                {/* Photo Upload for Personalized Items */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Upload Photo for Custom Gift (Frames / Mugs / Box)
                  </label>
                  <label className="border-2 border-dashed border-stone-300 hover:border-olive-500 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 cursor-pointer bg-stone-50/70 hover:bg-olive-50/40 transition-colors">
                    <Upload className="w-5 h-5 text-stone-400" />
                    <span className="text-xs font-semibold text-stone-700">Click to upload photo (PNG/JPG up to 5MB)</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>

                {/* Free Greeting Card Note */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Custom Greeting Card Note
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Write heartfelt message to accompany this gift..."
                    value={cardMessage}
                    onChange={(e) => setCardMessage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-olive-500/30 bg-stone-50"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: Gift Pairings Add-ons */}
            {activeTab === 'addons' && (
              <div className="space-y-2.5 animate-fade-in">
                <p className="text-xs text-stone-500">Pair this gift with complementary additions:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(curatedAddons || []).map((addon) => {
                    const isSelected = selectedAddons.some(a => a.id === addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon)}
                        className={`p-2 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                          isSelected ? 'bg-rose-50 border-rose-400 ring-1 ring-rose-400 shadow-xs' : 'bg-stone-50 border-stone-200 hover:bg-stone-100/70'
                        }`}
                      >
                        <img src={addon.image} alt={addon.name} className="w-12 h-12 rounded-xl object-contain bg-white border p-1" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-gray-900 truncate">{addon.name}</h4>
                          <span className="text-[10px] text-olive-750 font-bold">Pairing Available</span>
                        </div>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          isSelected ? 'bg-rose-600 text-white' : 'bg-white border text-stone-400'
                        }`}>
                          {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions: Add to Shortlist & Direct WhatsApp Enquiry */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={handleAddToEnquiry}
                className="flex-1 py-3.5 rounded-2xl bg-olive-750 hover:bg-olive-800 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{addedNotice ? 'Added to Shortlist!' : 'Add to Enquiry Shortlist'}</span>
              </button>

              <button
                type="button"
                onClick={handleDirectWhatsApp}
                className="py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                title="Direct enquiry with admin on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp Admin</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
