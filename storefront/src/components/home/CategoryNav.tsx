'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCategories } from '@/hooks/useApi';

const getCategoryIcon = (name: string, slug: string) => {
  const n = (name || '').toLowerCase();
  const s = (slug || '').toLowerCase();
  
  if (n.includes('mobile') || s.includes('mobile') || n.includes('phone') || s.includes('phone')) return 'smartphone';
  if (n.includes('charger') || s.includes('charger')) return 'bolt';
  if (n.includes('cable') || s.includes('cable') || n.includes('wire') || s.includes('wire')) return 'settings_input_hdmi';
  if (n.includes('earbud') || s.includes('earbud') || n.includes('tws') || s.includes('tws') || n.includes('audio') || s.includes('audio')) return 'headset';
  if (n.includes('neckband') || s.includes('neckband')) return 'headphones';
  if (n.includes('watch') || s.includes('watch') || n.includes('wearable') || s.includes('wearable')) return 'watch';
  if (n.includes('power') || s.includes('power') || n.includes('bank') || s.includes('bank')) return 'battery_charging_full';
  if (n.includes('cover') || s.includes('cover') || n.includes('case') || s.includes('case')) return 'phone_android';
  if (n.includes('laptop') || s.includes('laptop') || n.includes('computer') || s.includes('computer')) return 'laptop';
  if (n.includes('deal') || s.includes('deal') || n.includes('offer') || s.includes('offer') || n.includes('sale') || s.includes('sale')) return 'local_offer';
  
  return 'category';
};

export default function CategoryNav() {
  const { categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="bg-white border-b border-surface-border py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex overflow-x-auto scrollbar-hide justify-between gap-6 opacity-50">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 shrink-0 animate-pulse">
                <div className="w-14 h-14 rounded-full bg-gray-200"></div>
                <div className="w-16 h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border-b border-surface-border py-4">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex overflow-x-auto scrollbar-hide justify-between gap-6">
          {categories.map((cat: any) => {
            const isDeal = cat.name?.toLowerCase().includes('deal') || cat.slug?.toLowerCase().includes('deal');
            return (
              <Link href={`/category/${cat.slug}`} key={cat._id || cat.id} className="flex flex-col items-center gap-2 cursor-pointer group shrink-0 relative">
                <div className="w-14 h-14 rounded-full bg-accent-light border border-transparent flex items-center justify-center overflow-hidden group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300 relative shadow-sm">
                  {isDeal && (
                    <span className="absolute top-0.5 right-0.5 bg-primary text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full z-10 leading-none tracking-wider scale-95 shadow-sm">
                      NEW
                    </span>
                  )}
                  {cat.image ? (
                    <Image src={cat.image} alt={cat.name} width={56} height={56} className="object-cover w-full h-full" />
                  ) : (
                    <span className="material-symbols-outlined text-[26px] text-primary group-hover:text-primary-dark transition-colors duration-300">
                      {getCategoryIcon(cat.name, cat.slug)}
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold text-text-primary group-hover:text-primary transition-colors duration-300 capitalize text-center max-w-[80px] truncate">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
