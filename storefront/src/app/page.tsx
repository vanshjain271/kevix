'use client';

import CategoryNav from '@/components/home/CategoryNav';
import HeroCarousel from '@/components/home/HeroCarousel';
import ProductGrid, { Product } from '@/components/home/ProductGrid';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import { useProducts, useBanners } from '@/hooks/useApi';

export default function Home() {
  const { products, isLoading: loadingProducts } = useProducts();
  
  const formattedProducts = products.map((p: any) => ({
    id: p._id,
    name: p.name,
    price: p.sellingPrice || 0,
    mrp: p.mrp || 0,
    discount: p.mrp > 0 ? Math.round(((p.mrp - p.sellingPrice) / p.mrp) * 100) : 0,
    image: p.images && p.images.length > 0 ? p.images[0].url : 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=800&auto=format&fit=crop',
    rating: p.averageRating || 4.5,
    reviews: p.totalReviews || 0,
    isAssured: true,
    homepageSections: p.homepageSections || []
  }));

  const dynamicSections = Array.from(new Set(formattedProducts.flatMap((p: any) => p.homepageSections)));

  return (
    <div className="bg-background min-h-screen">
      <CategoryNav />
      <HeroCarousel />
      <WhyChooseUs />
      
      <main className="pb-12">
        {loadingProducts ? (
          <div className="flex justify-center items-center h-64">
            <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
          </div>
        ) : formattedProducts.length > 0 ? (
          <>
            {/* Dynamic Sections */}
            {dynamicSections.map((sectionName) => {
              const sectionProducts = formattedProducts.filter((p: any) => p.homepageSections.includes(sectionName));
              if (sectionProducts.length === 0) return null;
              
              return (
                <div key={sectionName as string} className="mt-6">
                  <div className="bg-white py-2 border-y border-surface-border mb-4">
                    <ProductGrid 
                      title={sectionName as string} 
                      subtitle={`Explore our ${sectionName} collection`}
                      products={sectionProducts} 
                    />
                  </div>
                </div>
              );
            })}

            {/* All Products */}
            <div className="mt-6">
              <div className="bg-white py-2 border-y border-surface-border mb-4">
                <ProductGrid 
                  title="Our Products" 
                  subtitle="Explore our catalog"
                  products={formattedProducts} 
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center h-64 text-text-secondary">
             <span className="material-symbols-outlined text-[48px] mb-4">inventory_2</span>
             <h2 className="text-xl font-bold text-text-primary">No products available</h2>
             <p>Check back later for new arrivals!</p>
          </div>
        )}
      </main>
    </div>
  );
}
