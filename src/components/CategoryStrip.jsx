import React from 'react';
import { Link } from 'react-router-dom';
import FixedImage from './common/FixedImage';

const CATEGORIES = [
  {
    id: 'same-day',
    name: 'Same Day',
    slug: 'same-day',
    image: '/images/home/image2.png',
    borderColor: 'border-[#fbbf24]', // Warm yellow/gold
    isSpecial: true,
  },
  {
    id: 'cakes',
    name: 'Cakes',
    slug: 'cakes',
    image: '/images/home/image4.png',
    borderColor: 'border-[#fdba74]', // Soft orange/peach
    isSpecial: false,
  },
  {
    id: 'flowers',
    name: 'Flowers',
    slug: 'flowers',
    image: '/images/home/image3.png',
    borderColor: 'border-[#f472b6]', // Pink/rose
    isSpecial: false,
  },
  {
    id: 'frames',
    name: 'Frames',
    slug: 'frames',
    image: '/images/home/image5.png',
    borderColor: 'border-[#c084fc]', // Purple/lavender
    isSpecial: false,
  },
  {
    id: 'chocolates',
    name: 'Chocolates',
    slug: 'chocolates',
    image: '/images/home/image7.png',
    borderColor: 'border-[#fde047]', // Gold/yellow
    isSpecial: false,
  },
];

export default function CategoryStrip() {
  return (
    <div className="bg-white py-6 sm:py-8 border-b border-gray-100 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-8 sm:gap-14 md:gap-20 overflow-x-auto scrollbar-none py-2">
          {CATEGORIES.map((item) => (
            <Link
              to={`/category/${item.slug}`}
              key={item.id}
              className="flex flex-col items-center text-center group cursor-pointer flex-shrink-0 transition-transform duration-300 hover:-translate-y-1.5"
            >
              {/* Circular Ring Frame */}
              <div
                className={`w-[85px] h-[85px] sm:w-[100px] sm:h-[100px] md:w-[110px] md:h-[110px] rounded-full bg-white border-2 ${item.borderColor} p-1.5 flex items-center justify-center shadow-xs group-hover:shadow-md transition-all duration-300 relative overflow-hidden`}
              >
                <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-stone-50/50 relative">
                  <FixedImage
                    src={item.image}
                    alt={item.name}
                    type="category"
                    containerClassName="w-full h-full flex items-center justify-center"
                    imageClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 select-none"
                  />
                </div>
              </div>

              {/* Title */}
              <span className="text-sm sm:text-base font-bold text-[#0f172a] mt-3 font-sans tracking-tight group-hover:text-olive-700 transition-colors">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
