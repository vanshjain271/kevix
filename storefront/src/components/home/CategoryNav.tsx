'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCategories } from '@/hooks/useApi';


export default function CategoryNav() {
  const { categories, isLoading } = useCategories();
  const [isOpen, setIsOpen] = useState(false);

  const getCategoryIcon = (cat: any) => {
    if (cat.icon && cat.icon !== 'category') return cat.icon;
    const name = cat.name?.toLowerCase() || '';
    if (name.includes('earphone') || name.includes('headphone') || name.includes('audio')) return 'headphones';
    if (name.includes('cover') || name.includes('case')) return 'phone_iphone';
    if (name.includes('battery') || name.includes('power')) return 'battery_charging_full';
    if (name.includes('cable') || name.includes('charger')) return 'cable';
    if (name.includes('watch') || name.includes('wearable')) return 'watch';
    if (name.includes('speaker')) return 'speaker';
    return 'category'; // default
  };

  if (isLoading) {
    return (
      <div className="bg-white border-b border-surface-border py-3">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 py-3 text-text-primary hover:text-primary font-semibold text-sm transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">category</span>
          All Categories
          <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            arrow_drop_down
          </span>
        </button>

        {isOpen && (
          <div className="flex overflow-x-auto scrollbar-hide gap-8 py-4 border-t border-gray-100">
            {categories.map((cat: any) => {
              const isDeal = cat.name?.toLowerCase().includes('deal') || cat.slug?.toLowerCase().includes('deal');
              const displayIcon = getCategoryIcon(cat);
              
              return (
                <Link href={`/category/${cat.slug}`} key={cat._id || cat.id} className="flex flex-col items-center gap-2 cursor-pointer group shrink-0 w-[80px] relative">
                  <div className="w-14 h-14 rounded-full bg-primary/10 border border-transparent flex items-center justify-center overflow-hidden group-hover:bg-primary/20 transition-all duration-300 relative">
                    {isDeal && (
                      <span className="absolute top-0 right-0 bg-primary text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full z-10 leading-none tracking-wider shadow-sm">
                        NEW
                      </span>
                    )}
                    <span className="material-symbols-outlined text-[26px] text-primary group-hover:scale-110 transition-transform duration-300">
                      {displayIcon}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-text-primary group-hover:text-primary transition-colors duration-300 capitalize text-center w-full truncate">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
