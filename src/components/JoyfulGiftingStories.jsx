import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize2, Share2, Sparkles, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const DEFAULT_STORIES = [
  {
    id: 1,
    title: 'take a break - DRINK COFFEE IN YOUR PERSONALISED MUG',
    productName: 'Name Impressions Mug',
    price: 249,
    formattedPrice: '₹249',
    img: '/images/home/GiftsForHim.png',
    bgGradient: 'from-amber-900/60 via-amber-800/20 to-black/70',
    thumbEmoji: '☕',
    thumb2Emoji: '🎁',
  },
  {
    id: 2,
    title: 'Customised Jewellery & Keepsakes',
    productName: 'Royal Solitaire Pendant Set',
    price: 1049,
    formattedPrice: '₹1,049',
    img: '/images/home/GiftsForHer.png',
    bgGradient: 'from-purple-900/60 via-purple-800/20 to-black/70',
    thumbEmoji: '💍',
    thumb2Emoji: '✨',
  },
  {
    id: 3,
    title: 'Birthday bliss with decor & surprises',
    productName: 'Personalised Grace Mixed Rose Bouquet',
    price: 1199,
    formattedPrice: '₹1,199',
    img: '/images/home/flower_coll_1.png',
    bgGradient: 'from-rose-900/60 via-pink-800/20 to-black/70',
    thumbEmoji: '💐',
    thumb2Emoji: '🎈',
  },
  {
    id: 4,
    title: 'Enchanted Red Rose Arrangement',
    productName: 'Enchanted Red Rose Arrangement',
    price: 1049,
    formattedPrice: '₹1,049',
    img: '/images/home/flower_coll_4.png',
    bgGradient: 'from-red-900/60 via-rose-800/20 to-black/70',
    thumbEmoji: '🌹',
    thumb2Emoji: '🕯️',
  },
  {
    id: 5,
    title: 'Ferrero Rocher & Chocolate Treats',
    productName: 'Luxury Celebration Chocolate Pack',
    price: 1649,
    formattedPrice: '₹1,649',
    img: '/images/home/flower_coll_3.png',
    bgGradient: 'from-amber-950/60 via-chocolate-800/20 to-black/70',
    thumbEmoji: '🍫',
    thumb2Emoji: '✨',
  },
  {
    id: 6,
    title: 'Special Birthday Cake Surprises',
    productName: 'Strawberry Celebration Cake',
    price: 699,
    formattedPrice: '₹699',
    img: '/images/home/flower_coll_2.png',
    bgGradient: 'from-pink-950/60 via-rose-800/20 to-black/70',
    thumbEmoji: '🎂',
    thumb2Emoji: '🍓',
  }
];

const CARD_GAP = 20; // px between cards
const VISIBLE  = 5;  // cards visible on desktop

export default function JoyfulGiftingStories({ data = DEFAULT_STORIES }) {
  const { openProductModal } = useCart();
  const stories = Array.isArray(data) && data.length > 0 ? data : DEFAULT_STORIES;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth]       = useState(0);
  const [mutedStates, setMutedStates]   = useState({});
  const [playingStates, setPlayingStates] = useState({});
  const containerRef = useRef(null);

  const maxIndex  = Math.max(stories.length - VISIBLE, 0);
  const showLeft  = currentIndex > 0;
  const showRight = currentIndex < maxIndex;

  const measure = useCallback(() => {
    if (containerRef.current) {
      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
      const visibleCount = isMobile ? 1.8 : isTablet ? 3 : VISIBLE;
      const totalGap = CARD_GAP * (Math.floor(visibleCount) - 1);
      setCardWidth((containerRef.current.clientWidth - totalGap) / visibleCount);
    }
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const handlePrev = () => { if (showLeft)  setCurrentIndex(i => i - 1); };
  const handleNext = () => { if (showRight) setCurrentIndex(i => i + 1); };
  const translateX  = currentIndex * (cardWidth + CARD_GAP);

  const toggleMute = (id) => {
    setMutedStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePlay = (id) => {
    setPlayingStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white py-12 border-b border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-rose-100 text-rose-800 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Real Gifting Moments
          </span>
        </div>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-900 mb-6">
          Joyful Gifting Stories
        </h2>

        {/* Carousel Container */}
        <div className="relative" ref={containerRef}>

          {/* ← Left Arrow */}
          <button
            onClick={handlePrev}
            aria-label="Previous"
            className={`absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full
              bg-white shadow-md border border-gray-200 flex items-center justify-center
              text-gray-600 hover:text-gray-900 transition-all duration-200 cursor-pointer
              ${showLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Track Container */}
          <div className="overflow-hidden py-2">
            <div
              className="flex"
              style={{
                gap: `${CARD_GAP}px`,
                transform: cardWidth ? `translateX(-${translateX}px)` : 'none',
                transition: 'transform 420ms ease-in-out',
              }}
            >
              {stories.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 cursor-pointer group select-none"
                  style={{ width: cardWidth || `${100 / VISIBLE}%` }}
                >
                  {/* Vertical Video Reel Card (9:16 Aspect Ratio) */}
                  <div
                    className={`relative w-full rounded-[20px] overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-200 flex flex-col justify-between bg-gradient-to-b ${item.bgGradient || 'from-stone-900 via-stone-800 to-black'}`}
                    style={{ aspectRatio: '9/15' }}
                  >
                    {/* Background Simulated Video Player / Animated Canvas */}
                    <div className="absolute inset-0 z-0">
                      <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center relative overflow-hidden">
                        {/* Animated Video Pulse Glow */}
                        <div className="absolute inset-0 bg-white/5 animate-pulse" />
                        
                        {/* Story Theme Text Overlay */}
                        <div className="px-6 text-center z-10">
                          <p className="text-white font-extrabold text-xl sm:text-2xl leading-tight font-sans drop-shadow-md tracking-tight">
                            {item.title}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 z-10 pointer-events-none" />

                    {/* Top Action Bar (Expand, Volume, Share) */}
                    <div className="relative z-20 flex items-center justify-between p-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); }}
                        className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-colors"
                        title="Expand"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleMute(item.id); }}
                          className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-colors"
                          title={mutedStates[item.id] ? "Unmute" : "Mute"}
                        >
                          {mutedStates[item.id] ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-colors"
                          title="Share"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Center Play / Pause Button Overlay */}
                    <div className="relative z-20 flex items-center justify-center my-auto">
                      <button
                        onClick={() => togglePlay(item.id)}
                        className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-200 cursor-pointer"
                        title={playingStates[item.id] ? "Pause" : "Play"}
                      >
                        {playingStates[item.id] ? (
                          <Pause className="w-6 h-6 fill-white" />
                        ) : (
                          <Play className="w-6 h-6 fill-white ml-0.5" />
                        )}
                      </button>
                    </div>

                    {/* Bottom Linked Product Pill Card */}
                    <div className="relative z-20 p-2">
                      <div 
                        onClick={() => openProductModal({
                          id: item.id + 200,
                          name: item.productName,
                          price: item.price || 999,
                          originalPrice: Math.round((item.price || 999) * 1.3),
                          img: item.img || '/images/home/flower_coll_1.png',
                          category: 'Gifting Stories',
                        })}
                        className="bg-white/95 hover:bg-white backdrop-blur-md rounded-[14px] p-2 flex items-center justify-between gap-2 shadow-lg border border-white/50 cursor-pointer transition-all hover:scale-[1.02]"
                      >
                        {/* Product Thumb 1 */}
                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0 text-base">
                          {item.thumbEmoji || '🎁'}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-gray-900 font-sans truncate leading-tight">
                            {item.productName}
                          </p>
                          <p className="text-[10px] font-bold text-olive-750 font-sans leading-none mt-0.5">
                            Curated Gift • Enquire
                          </p>
                        </div>

                        {/* Arrow */}
                        <div className="w-6 h-6 rounded-lg bg-olive-50 text-olive-750 flex items-center justify-center flex-shrink-0">
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* → Right Arrow */}
          <button
            onClick={handleNext}
            aria-label="Next"
            className={`absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full
              bg-white shadow-md border border-gray-200 flex items-center justify-center
              text-gray-600 hover:text-gray-900 transition-all duration-200
              ${showRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>

        </div>

      </div>
    </div>
  );
}
