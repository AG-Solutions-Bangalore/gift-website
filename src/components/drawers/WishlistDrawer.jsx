import React from 'react';
import { useCart } from '../../context/CartContext';
import FixedImage from '../common/FixedImage';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Trash2, 
  Sparkles, 
  ArrowRight,
  Eye
} from 'lucide-react';

export default function WishlistDrawer() {
  const { 
    isWishlistOpen, 
    closeWishlist, 
    wishlist, 
    toggleWishlist, 
    addToCart, 
    openProductModal,
    formatPrice 
  } = useCart();

  if (!isWishlistOpen) return null;

  const handleMoveToCart = (product) => {
    addToCart(product, { quantity: 1 });
    toggleWishlist(product);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={closeWishlist}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform ease-out duration-300">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shadow-inner">
                <Heart size={20} className="fill-rose-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  My Wishlist
                  <span className="text-xs font-semibold px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full">
                    {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
                  </span>
                </h2>
                <p className="text-xs text-stone-500">Items you loved and saved for special moments</p>
              </div>
            </div>
            <button 
              onClick={closeWishlist}
              className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
              aria-label="Close wishlist"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-400 mb-4 animate-pulse">
                  <Heart size={36} />
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-1">Your Wishlist is Empty</h3>
                <p className="text-sm text-stone-500 max-w-xs mb-6">
                  Save your favorite cakes, bouquets, hampers, and personalized keepsakes so you never forget a celebration.
                </p>
                <button
                  onClick={closeWishlist}
                  className="px-6 py-3 bg-stone-900 text-white rounded-full font-medium text-sm hover:bg-stone-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 group"
                >
                  <Sparkles size={16} className="text-amber-400" />
                  <span>Discover Curated Gifts</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlist.map((item) => {
                  const price = item.price || 999;
                  const originalPrice = item.originalPrice || Math.round(price * 1.25);
                  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

                  return (
                    <div 
                      key={item.id}
                      className="group relative bg-white border border-stone-200/80 rounded-2xl p-3.5 hover:shadow-md transition-all hover:border-rose-200 flex gap-4"
                    >
                      {/* Product Image */}
                      <div 
                        className="w-24 h-24 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 cursor-pointer relative"
                        onClick={() => {
                          closeWishlist();
                          openProductModal(item);
                        }}
                      >
                        <FixedImage
                          src={item.image || item.img || '/images/home/flower_coll_1.png'}
                          alt={item.name || item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye size={18} className="text-white drop-shadow" />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                              {item.category || item.tag || 'Curated Gift'}
                            </span>
                            <button
                              onClick={() => toggleWishlist(item)}
                              className="text-stone-400 hover:text-rose-500 p-1 hover:bg-stone-50 rounded-lg transition-colors"
                              title="Remove from Wishlist"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          <h4 
                            onClick={() => {
                              closeWishlist();
                              openProductModal(item);
                            }}
                            className="font-medium text-stone-900 text-sm mt-1 line-clamp-1 cursor-pointer hover:text-rose-600 transition-colors"
                          >
                            {item.name || item.title}
                          </h4>

                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="text-[11px] font-bold text-olive-800 bg-olive-50 px-2 py-0.5 rounded-md border border-olive-200">
                              Available on Enquiry
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-stone-100">
                          <button
                            onClick={() => handleMoveToCart(item)}
                            className="flex-1 py-1.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                          >
                            <ShoppingBag size={13} />
                            <span>Add to Enquiry</span>
                          </button>
                          <button
                            onClick={() => {
                              closeWishlist();
                              openProductModal(item);
                            }}
                            className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors"
                            title="Customize / View Details"
                          >
                            <Sparkles size={14} className="text-amber-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer CTA */}
          {wishlist.length > 0 && (
            <div className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  wishlist.forEach((item) => addToCart(item, { quantity: 1 }));
                }}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag size={16} />
                <span>Add All to Bag</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
