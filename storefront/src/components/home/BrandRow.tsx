'use client';

import Link from 'next/link';
import { useBrands } from '@/hooks/useApi';

export default function BrandRow() {
  const { brands, isLoading } = useBrands();

  if (isLoading) {
    return (
      <section className="bg-white py-6 border-b border-purple-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="h-5 bg-gray-200 rounded w-32 mb-4 animate-pulse" />
          <div className="flex gap-6 overflow-x-auto scrollbar-hide">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="flex flex-col items-center gap-2 shrink-0 animate-pulse">
                <div className="w-16 h-16 rounded-full bg-gray-200" />
                <div className="w-14 h-3 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!brands || brands.length === 0) return null;

  return (
    <section className="bg-white py-6 border-b border-purple-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Shop by Brand</h2>
          <Link href="/brand/all" className="text-sm text-purple-600 font-semibold hover:underline">View All</Link>
        </div>
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-2">
          {brands.map((brand: any) => (
            <Link
              key={brand._id}
              href={`/brand/${brand._id}`}
              className="flex flex-col items-center gap-2 shrink-0 group"
            >
              <div className="w-16 h-16 rounded-full border-2 border-purple-100 group-hover:border-purple-500 bg-white shadow-sm flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:scale-110">
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain p-1.5" />
                ) : (
                  <span className="text-xl font-black text-purple-400 group-hover:text-purple-600 transition-colors">
                    {brand.name?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold text-gray-600 group-hover:text-purple-600 transition-colors text-center max-w-[72px] truncate capitalize">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
