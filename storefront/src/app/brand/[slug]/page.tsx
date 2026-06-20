'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import useSWR from 'swr';

const fetcher = (url: string) => api.get(url).then(r => r.data?.data || r.data);
const DEFAULT_IMG = 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=400';

function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCartStore();
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const { isAuthenticated, openLoginModal } = useAuthStore();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const id = product._id || product.id;
  const wishlisted = isWishlisted(id);
  const img = product.images?.[0]?.url || product.images?.[0] || DEFAULT_IMG;
  const price = product.sellingPrice || 0;
  const mrp = product.mrp || 0;
  const discount = mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const handleCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { openLoginModal(); return; }
    setAdding(true);
    await addToCart(id, 1);
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { openLoginModal(); return; }
    await toggleWishlist(id);
  };

  return (
    <Link href={`/product/${id}`} className="group bg-white rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
        <img src={img} alt={product.name} className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300" />
        {discount > 0 && <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{discount}% OFF</span>}
        <button onClick={handleWishlist} className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all ${wishlisted ? 'bg-red-50 text-red-500' : 'bg-white/90 text-gray-400 hover:text-red-400'}`}>
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: wishlisted ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
        </button>
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug flex-grow">{product.name}</p>
        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-base font-bold text-gray-900">₹{price.toLocaleString('en-IN')}</span>
          {mrp > price && <span className="text-xs text-gray-400 line-through">₹{mrp.toLocaleString('en-IN')}</span>}
        </div>
        <button onClick={handleCart} disabled={adding}
          className={`mt-3 w-full py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1 ${added ? 'bg-green-500 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white active:scale-95'} disabled:opacity-70`}>
          {adding ? <span className="material-symbols-outlined animate-spin text-[14px]">progress_activity</span>
            : added ? <><span className="material-symbols-outlined text-[14px]">check</span> Added!</>
            : <><span className="material-symbols-outlined text-[14px]">add_shopping_cart</span> Add</>}
        </button>
      </div>
    </Link>
  );
}

export default function BrandPage() {
  const params = useParams();
  const brandId = params?.slug as string;

  const { data: brandData } = useSWR(brandId ? `/brands/${brandId}` : null, fetcher);
  const { data: productsData } = useSWR(brandId ? `/products?brandId=${brandId}` : null, fetcher);

  const brand = brandData?.brand;
  const products = productsData?.products || [];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-purple-600 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-800 font-medium capitalize">{brand?.name || 'Brand'}</span>
        </div>

        {/* Brand Header */}
        {brand && (
          <div className="bg-white rounded-2xl border border-purple-100 p-6 mb-8 flex items-center gap-6 shadow-sm">
            {brand.logo ? (
              <img src={brand.logo} alt={brand.name} className="w-20 h-20 object-contain rounded-2xl border border-gray-100 p-2" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-purple-50 flex items-center justify-center">
                <span className="text-3xl font-black text-purple-400">{brand.name?.[0]?.toUpperCase()}</span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 capitalize">{brand.name}</h1>
              {brand.description && <p className="text-gray-500 text-sm mt-1">{brand.description}</p>}
              <p className="text-purple-600 font-semibold text-sm mt-2">{products.length} products</p>
            </div>
          </div>
        )}

        {/* Products */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <span className="material-symbols-outlined text-[64px] text-purple-200">inventory_2</span>
            <p className="text-gray-500">No products found for this brand.</p>
            <Link href="/" className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors">Back to Home</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product: any) => <ProductCard key={product._id} product={product} />)}
          </div>
        )}
      </div>
    </div>
  );
}
