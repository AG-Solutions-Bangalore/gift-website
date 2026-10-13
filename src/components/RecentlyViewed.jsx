import React from 'react';
import { useCart } from '../context/CartContext';
import FixedImage from './common/FixedImage';
import { Sparkles, Eye, Heart, ShoppingBag, ArrowRight } from 'lucide-react';

export default function RecentlyViewed() {
  const { 
    recentlyViewed, 
    formatPrice, 
    openProductModal, 
    addToCart, 
    toggleWishlist, 
    isInWishlist 
  } = useCart();

  if (!recentlyViewed || recentlyViewed.length === 0) return null;

  return (
    <section className="py-12 bg-gradient-to-b from-stone-50/50 to-white border-t border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-rose-50 text-rose-600">
                <Eye size={16} />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                Picked From Your Browsing
              </span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 font-serif">
              Recently Viewed Curations
            </h2>
          </div>
          <span className="text-xs text-stone-400">
            {recentlyViewed.length} items viewed
          </span>
        </div>

        {/* Horizontal Scroll Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {recentlyViewed.slice(0, 6).map((product) => {
            const price = product.price || 999;
            const originalPrice = product.originalPrice || Math.round(price * 1.25);
            const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
            const wishlisted = isInWishlist(product.id);

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-stone-200/80 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image & Wishlist Pill */}
                <div className="relative aspect-square overflow-hidden bg-stone-100 cursor-pointer">
                  <div
                    onClick={() => openProductModal(product)}
                    className="w-full h-full"
                  >
                    <FixedImage
                      src={product.image || product.img || '/images/home/flower_coll_1.png'}
                      alt={product.name || product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-stone-600 hover:text-rose-600 transition-colors z-10"
                    aria-label="Wishlist"
                  >
                    <Heart
                      size={15}
                      className={wishlisted ? 'fill-rose-500 text-rose-500' : ''}
                    />
                  </button>

                  {/* Curated Badge */}
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 bg-stone-900/80 text-white rounded-full shadow-sm">
                    Curated
                  </span>
                </div>

                {/* Info & CTA */}
                <div className="p-3.5 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[10px] font-medium text-stone-400 block truncate">
                      {product.category || 'Curated Gift'}
                    </span>
                    <h3
                      onClick={() => openProductModal(product)}
                      className="text-xs sm:text-sm font-semibold text-stone-800 line-clamp-2 hover:text-rose-600 cursor-pointer mt-0.5 mb-1"
                    >
                      {product.name || product.title}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-stone-100 mt-2">
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-xs font-bold text-olive-800 bg-olive-50 px-2 py-0.5 rounded-md border border-olive-200">
                        Available on Request
                      </span>
                    </div>

                    <button
                      onClick={() => openProductModal(product)}
                      className="w-full py-1.5 px-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-xl flex items-center justify-center gap-1 transition-all active:scale-95 shadow-sm cursor-pointer"
                    >
                      <ShoppingBag size={12} />
                      <span>Enquire</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
