'use client';

import { useState, use, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProductDetail } from '@/hooks/useApi';
import { useCartStore } from '@/store/useCartStore';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { product, isLoading } = useProductDetail(resolvedParams.id);
  const { addToCart, isLoading: addingToCart } = useCartStore();
  
  const displayProduct = product ? {
    ...product,
    discount: Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100),
    images: product.images && product.images.length > 0 ? product.images.map((img: any) => img.url) : [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=800&auto=format&fit=crop'
    ],
    rating: product.averageRating || 0,
    reviews: product.totalReviews || 0,
    brand: product.brand?.name || product.brand || 'Generic',
    isAssured: true,
  } : null;

  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Update active image when product loads
  useEffect(() => {
    if (displayProduct && displayProduct.images && displayProduct.images.length > 0) {
      setActiveImage(displayProduct.images[0]);
    }
  }, [displayProduct?.images]);

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen pb-12 flex justify-center items-center">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    );
  }

  if (!displayProduct) {
    return (
      <div className="bg-background min-h-screen flex flex-col justify-center items-center text-text-secondary">
        <span className="material-symbols-outlined text-[64px] mb-4">inventory_2</span>
        <h2 className="text-xl font-bold text-text-primary">Product Not Found</h2>
        <p className="mb-4">The product you are looking for does not exist or has been removed.</p>
        <Link href="/" className="text-primary hover:underline font-medium">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-12">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-surface-border py-3">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-xs text-text-secondary flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link href={`/category/${displayProduct.category?.slug || 'all'}`} className="hover:text-primary">{displayProduct.category?.name || 'Category'}</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="hover:text-primary">{displayProduct.brand}</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="font-medium text-text-primary truncate max-w-[200px]">{displayProduct.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="bg-white border border-surface-border rounded-sm flex flex-col md:flex-row overflow-hidden">
          
          {/* Left: Image Gallery (Sticky on Desktop) */}
          <div className="w-full md:w-2/5 p-4 md:p-8 flex flex-col md:flex-row gap-4 border-b md:border-b-0 md:border-r border-surface-border md:sticky top-0 h-max">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-visible">
              {displayProduct.images.map((img: string, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 border rounded-sm overflow-hidden shrink-0 transition-all ${activeImage === img ? 'border-primary ring-1 ring-primary' : 'border-surface-border hover:border-text-muted'}`}
                >
                  <div className="relative w-full h-full">
                    <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                  </div>
                </button>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="order-1 md:order-2 flex-grow aspect-square md:aspect-auto md:h-[450px] relative border border-surface-border rounded-sm p-4 group cursor-crosshair">
              {activeImage && (
                <Image src={activeImage} alt={displayProduct.name} fill className="object-contain p-4 group-hover:scale-125 transition-transform duration-500 origin-center" />
              )}
              <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white border border-surface-border shadow-sm flex items-center justify-center text-text-muted hover:text-danger hover:border-danger transition-colors z-10">
                <span className="material-symbols-outlined text-[24px]">favorite</span>
              </button>
            </div>
            
            {/* Action Buttons (Mobile: Below image, Desktop: Below image gallery) */}
            <div className="flex gap-2 order-3 w-full mt-4 absolute md:relative bottom-0 left-0 p-4 md:p-0 bg-white border-t md:border-t-0 border-surface-border z-40 md:z-auto">
              <button 
                onClick={() => addToCart(displayProduct._id)}
                disabled={addingToCart || displayProduct.stock <= 0}
                className="flex-1 bg-accent hover:bg-accent-dark text-white py-3 md:py-4 px-2 rounded-sm font-bold text-sm md:text-lg flex items-center justify-center gap-2 transition-colors shadow-md disabled:opacity-70"
              >
                <span className="material-symbols-outlined">{addingToCart ? 'hourglass_empty' : 'shopping_cart'}</span> 
                {addingToCart ? 'ADDING...' : (displayProduct.stock > 0 ? 'ADD TO CART' : 'OUT OF STOCK')}
              </button>
              <button disabled={displayProduct.stock <= 0} className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 md:py-4 px-2 rounded-sm font-bold text-sm md:text-lg flex items-center justify-center gap-2 transition-colors shadow-md disabled:opacity-70">
                <span className="material-symbols-outlined">bolt</span> BUY NOW
              </button>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="w-full md:w-3/5 p-4 md:p-8 space-y-6 pb-24 md:pb-8">
            
            {/* Title & Rating */}
            <div>
              <h1 className="text-xl md:text-2xl text-text-primary font-medium leading-relaxed">{displayProduct.name}</h1>
              {displayProduct.rating > 0 && (
                <div className="flex items-center gap-3 mt-2">
                  <div className="bg-success text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                    {displayProduct.rating} <span className="material-symbols-outlined text-[12px]">star</span>
                  </div>
                  <span className="text-text-secondary text-sm font-medium hover:text-primary cursor-pointer transition-colors">
                    {displayProduct.reviews.toLocaleString('en-IN')} Ratings & Reviews
                  </span>
                  {displayProduct.isAssured && (
                    <span className="bg-primary text-white text-[11px] italic font-bold px-2 py-0.5 rounded-sm shadow-sm ml-auto md:ml-4">
                      ✓ assured
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Price section */}
            <div className="border-b border-surface-border pb-6">
              <div className="text-success font-bold text-sm mb-1">Extra ₹{displayProduct.mrp - displayProduct.sellingPrice} off</div>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-medium text-text-primary">₹{displayProduct.sellingPrice?.toLocaleString('en-IN')}</span>
                <span className="text-lg text-text-muted line-through mb-1">₹{displayProduct.mrp?.toLocaleString('en-IN')}</span>
                <span className="text-lg font-bold text-success mb-1">{displayProduct.discount}% off</span>
              </div>
              <div className="text-xs text-text-secondary mt-1">
                {displayProduct.stock > 0 ? (
                  <span className="text-success font-bold">In Stock ({displayProduct.stock} units available)</span>
                ) : (
                  <span className="text-danger font-bold">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-medium text-text-primary mb-4 border-b border-surface-border pb-2">Description</h3>
              <p className="text-sm text-text-primary leading-relaxed whitespace-pre-line">
                {displayProduct.description || "No description provided."}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
