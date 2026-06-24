'use client';

import { useState } from 'react';
import Link from 'next/link';
import CategoryNav from '@/components/home/CategoryNav';
import HeroCarousel from '@/components/home/HeroCarousel';
import ProductCarousel from '@/components/home/ProductCarousel';
import { useProducts } from '@/hooks/useApi';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAuthStore } from '@/store/useAuthStore';
import HoverZoomImage from '@/components/product/HoverZoomImage';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=800&auto=format&fit=crop';

function formatProduct(p: any) {
  return {
    id: p._id,
    name: p.name,
    price: p.salePrice || 0,
    mrp: p.mrp || 0,
    discount: p.mrp > 0 ? Math.round(((p.mrp - p.salePrice) / p.mrp) * 100) : 0,
    image: p.images?.[0]?.url || p.images?.[0] || DEFAULT_IMAGE,
    rating: p.averageRating || 4.5,
    reviews: p.totalReviews || 0,
    homepageSections: p.homepageSections || [],
    isLot: p.isLot || false,
    lotDetails: p.lotDetails || null,
  };
}

const features = [
  { icon: 'local_shipping', label: 'Free Delivery', sub: 'On orders above ₹499' },
  { icon: 'autorenew', label: 'Easy Returns', sub: '7-day return policy' },
  { icon: 'verified_user', label: '100% Authentic', sub: 'Genuine products' },
  { icon: 'support_agent', label: '24/7 Support', sub: 'Always here for you' },
];

function ProductCardGrid({ product }: { product: any }) {
  const { addToCart } = useCartStore();
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const { isAuthenticated, openLoginModal } = useAuthStore();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { openLoginModal(); return; }
    setAdding(true);
    await addToCart(product.id, 1);
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { openLoginModal(); return; }
    await toggleWishlist(product.id);
  };

  return (
    <Link href={`/product/${product.id}`} className="group bg-white rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
        <HoverZoomImage 
          src={product.image} 
          alt={product.name} 
          scale={2}
          className="w-full h-full"
          imageClassName="p-3" 
        />
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10">
            {product.discount}% OFF
          </span>
        )}
        <button
          onClick={handleWishlist}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all duration-200 ${wishlisted ? 'bg-red-50 text-red-500' : 'bg-white/90 text-gray-400 hover:text-red-400'}`}
        >
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: wishlisted ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
        </button>
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug flex-grow">{product.name}</p>
        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-base font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
          {product.mrp > product.price && (
            <span className="text-xs text-gray-400 line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
          )}
        </div>
        {product.discount > 0 && <span className="text-xs font-bold text-green-600">{product.discount}% off</span>}
        <button
          onClick={handleAddToCart}
          disabled={adding}
          className={`mt-3 w-full py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1
            ${added ? 'bg-green-500 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white active:scale-95'} disabled:opacity-70`}
        >
          {adding ? (
            <span className="material-symbols-outlined animate-spin text-[14px]">progress_activity</span>
          ) : added ? (
            <><span className="material-symbols-outlined text-[14px]">check</span> Added!</>
          ) : (
            <><span className="material-symbols-outlined text-[14px]">add_shopping_cart</span> Add</>
          )}
        </button>
      </div>
    </Link>
  );
}

export default function Home() {
  const { products, isLoading } = useProducts();
  const formattedProducts = products.map(formatProduct);
  const allSections = Array.from(new Set(formattedProducts.flatMap((p: any) => p.homepageSections as string[])));
  const lotProducts = formattedProducts.filter((p: any) => p.isLot);

  return (
    <div className="bg-gray-50 min-h-screen">
      <CategoryNav />
      <HeroCarousel />

      {/* Feature Highlights */}
      <section className="bg-white border-b border-purple-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f) => (
              <div key={f.label} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0 group-hover:bg-purple-100 transition-colors">
                  <span className="material-symbols-outlined text-purple-600 text-[22px]">{f.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{f.label}</p>
                  <p className="text-xs text-gray-500">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!isLoading && lotProducts.length > 0 && (
        <ProductCarousel
          title="Premium Lots"
          subtitle="Buy in bulk and save more"
          products={lotProducts}
          viewAllLink="/search"
        />
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="material-symbols-outlined animate-spin text-purple-600 text-4xl">progress_activity</span>
        </div>
      ) : formattedProducts.length > 0 ? (
        <>
          {allSections.map((sectionName) => {
            const sectionProducts = formattedProducts.filter((p: any) => !p.isLot && p.homepageSections.includes(sectionName));
            if (sectionProducts.length === 0) return null;
            return (
              <ProductCarousel
                key={sectionName as string}
                title={sectionName as string}
                subtitle={`Explore our ${sectionName} picks`}
                products={sectionProducts}
                viewAllLink={`/search?section=${encodeURIComponent(sectionName as string)}`}
              />
            );
          })}

        </>
      ) : (
        <div className="flex flex-col justify-center items-center h-64 gap-3">
          <span className="material-symbols-outlined text-[64px] text-purple-200">inventory_2</span>
          <h2 className="text-xl font-bold text-gray-700">No products yet</h2>
          <p className="text-sm text-gray-500">Check back soon for new arrivals!</p>
        </div>
      )}
    </div>
  );
}
