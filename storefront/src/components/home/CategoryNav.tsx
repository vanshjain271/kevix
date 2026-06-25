'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCategories } from '@/hooks/useApi';


export default function CategoryNav() {
  const { categories, isLoading } = useCategories();
  const [isOpen, setIsOpen] = useState(false);

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
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center">
        {/* All Categories Dropdown (Optional desktop menu) */}
        <div className="hidden md:flex items-center gap-2 pr-6 border-r border-gray-100 shrink-0 cursor-pointer text-text-primary hover:text-primary transition-colors font-bold text-sm">
          <span className="material-symbols-outlined text-[20px]">menu</span>
          All Categories
        </div>

        {/* Horizontal scrollable icons */}
        <div className="flex overflow-x-auto scrollbar-hide gap-6 md:gap-10 pl-0 md:pl-6 w-full pb-2 md:pb-0 items-center">
          {categories.map((cat: any) => {
            const isDeal = cat.name?.toLowerCase().includes('deal') || cat.slug?.toLowerCase().includes('deal');
            return (
              <Link href={`/category/${cat.slug}`} key={cat._id || cat.id} className="flex flex-col items-center gap-3 cursor-pointer group shrink-0 w-[70px] relative">
                <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center overflow-hidden group-hover:bg-purple-100 group-hover:shadow-md transition-all duration-300 relative">
                  {isDeal && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm border border-white">
                      NEW
                    </span>
                  )}
                  <span className="material-symbols-outlined text-[28px] text-primary group-hover:scale-110 transition-transform duration-300">
                    {cat.icon || 'category'}
                  </span>
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-primary transition-colors duration-300 capitalize text-center w-full truncate">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
