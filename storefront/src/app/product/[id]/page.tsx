'use client';

import { useState, use, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProductDetail, useReviews, useWishlist } from '@/hooks/useApi';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import BulkInquiryModal from '@/components/product/BulkInquiryModal';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { product, isLoading } = useProductDetail(resolvedParams.id);
  const { reviews, isLoading: isLoadingReviews } = useReviews(resolvedParams.id);
  const { wishlist, mutate: mutateWishlist } = useWishlist();
  const { addToCart, items, updateQuantity, isLoading: addingToCart } = useCartStore();
  const { isAuthenticated, openLoginModal } = useAuthStore();
  const router = useRouter();
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  
  const displayProduct = product ? {
    ...product,
    discount: Math.round(((product.mrp - product.salePrice) / product.mrp) * 100),
    images: product.images && product.images.length > 0 ? product.images.map((img: any) => img.url || img) : [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=800&auto=format&fit=crop'
    ],
    rating: product.averageRating || 0,
    reviews: product.totalReviews || 0,
    isAssured: true,
  } : null;

  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [selectedLotType, setSelectedLotType] = useState<'full' | 'half' | 'mini'>('full');

  // Update active image when product loads
  useEffect(() => {
    if (displayProduct && displayProduct.images && displayProduct.images.length > 0) {
      setActiveImage(displayProduct.images[0]);
    }
  }, [displayProduct?.images]);

  const inWishlist = wishlist.some((item: any) => item._id === displayProduct?._id);
  const cartItem = items.find(i => i.productId?._id === displayProduct?._id);

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    if (!displayProduct) return;
    try {
      setIsTogglingWishlist(true);
      await api.post('/users/wishlist', { productId: displayProduct._id });
      mutateWishlist();
    } catch (error) {
      console.error('Failed to toggle wishlist', error);
    } finally {
      setIsTogglingWishlist(false);
    }
  };

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
            <div className="order-1 md:order-2 flex-grow aspect-square md:aspect-auto md:h-[450px] relative border border-surface-border rounded-sm p-4 group cursor-crosshair overflow-hidden">
              {activeImage && (
                <Image key={activeImage} src={activeImage} alt={displayProduct.name} fill className="object-contain p-4 group-hover:scale-125 transition-transform duration-500 origin-center" />
              )}
              <button 
                onClick={handleToggleWishlist}
                disabled={isTogglingWishlist}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-white border shadow-sm flex items-center justify-center transition-colors z-10 disabled:opacity-50 ${inWishlist ? 'border-danger text-danger' : 'border-surface-border text-text-muted hover:text-danger hover:border-danger'}`}
              >
                <span className={`material-symbols-outlined text-[24px] ${inWishlist ? 'fill-current' : ''}`}>favorite</span>
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
                    {(displayProduct.reviews || 0).toLocaleString('en-IN')} Ratings & Reviews
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
            {displayProduct.isLot ? (
              <div className="border-b border-surface-border pb-6">
                <div className="text-xl font-bold text-text-primary mb-4">Select Lot Size</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {displayProduct.lotDetails?.fullLotQuantity > 0 && (
                    <div 
                      onClick={() => setSelectedLotType('full')}
                      className={`border p-4 rounded cursor-pointer transition-colors ${selectedLotType === 'full' ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-surface-border hover:border-primary/50'}`}
                    >
                      <div className="font-bold text-text-primary mb-1">Full Lot</div>
                      <div className="text-sm text-text-secondary mb-2">{displayProduct.lotDetails.fullLotQuantity} units</div>
                      <div className="text-xl font-bold text-primary">₹{(displayProduct.lotDetails.fullLotPrice || 0).toLocaleString('en-IN')}</div>
                    </div>
                  )}
                  {displayProduct.lotDetails?.allowHalfLot && (
                    <div 
                      onClick={() => setSelectedLotType('half')}
                      className={`border p-4 rounded cursor-pointer transition-colors ${selectedLotType === 'half' ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-surface-border hover:border-primary/50'}`}
                    >
                      <div className="font-bold text-text-primary mb-1">Half Lot</div>
                      <div className="text-sm text-text-secondary mb-2">{displayProduct.lotDetails.halfLotQuantity} units</div>
                      <div className="text-xl font-bold text-primary">₹{(displayProduct.lotDetails.halfLotPrice || 0).toLocaleString('en-IN')}</div>
                    </div>
                  )}
                  {displayProduct.lotDetails?.allowMiniLot && (
                    <div 
                      onClick={() => setSelectedLotType('mini')}
                      className={`border p-4 rounded cursor-pointer transition-colors ${selectedLotType === 'mini' ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-surface-border hover:border-primary/50'}`}
                    >
                      <div className="font-bold text-text-primary mb-1">Mini Lot</div>
                      <div className="text-sm text-text-secondary mb-2">{displayProduct.lotDetails.miniLotQuantity} units</div>
                      <div className="text-xl font-bold text-primary">₹{(displayProduct.lotDetails.miniLotPrice || 0).toLocaleString('en-IN')}</div>
                    </div>
                  )}
                </div>
                <div className="text-xs text-text-secondary mt-4">
                  {displayProduct.stock > 0 ? (
                    <span className="text-success font-bold">In Stock ({displayProduct.stock} units available)</span>
                  ) : (
                    <span className="text-danger font-bold">Out of Stock</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="border-b border-surface-border pb-6">
                <div className="text-success font-bold text-sm mb-1">Extra ₹{(displayProduct.mrp - displayProduct.salePrice)} off</div>
                <div className="mt-4 flex items-end gap-3">
                  <span className="text-3xl font-medium text-text-primary">₹{(displayProduct.salePrice || 0).toLocaleString('en-IN')}</span>
                  <span className="text-lg text-text-muted line-through mb-1">₹{(displayProduct.mrp || 0).toLocaleString('en-IN')}</span>
                  <span className="text-sm font-bold text-success mb-1.5">{displayProduct.discount}% off</span>
                </div>
                <div className="text-xs text-text-secondary mt-1">
                  {displayProduct.stock > 0 ? (
                    <span className="text-success font-bold">In Stock ({displayProduct.stock} units available)</span>
                  ) : (
                    <span className="text-danger font-bold">Out of Stock</span>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6 border-b border-surface-border pb-6">
              {cartItem ? (
                <div className="flex-1 min-w-[140px] flex items-center justify-between border-2 border-accent rounded-lg overflow-hidden h-[42px]">
                  <button 
                    onClick={(e) => { e.preventDefault(); updateQuantity(cartItem.id!, cartItem.quantity - 1); }}
                    className="w-1/3 h-full flex items-center justify-center bg-accent/10 text-accent hover:bg-accent/20 font-bold text-xl"
                  >-</button>
                  <span className="w-1/3 h-full flex items-center justify-center font-bold text-text-primary">
                    {cartItem.quantity}
                  </span>
                  <button 
                    onClick={(e) => { e.preventDefault(); updateQuantity(cartItem.id!, cartItem.quantity + 1); }}
                    className="w-1/3 h-full flex items-center justify-center bg-accent/10 text-accent hover:bg-accent/20 font-bold text-xl"
                  >+</button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    if (!isAuthenticated) {
                      openLoginModal();
                      return;
                    }
                    let qty = 1;
                    if (displayProduct.isLot && displayProduct.lotDetails) {
                      if (selectedLotType === 'full') qty = displayProduct.lotDetails.fullLotQuantity;
                      if (selectedLotType === 'half') qty = displayProduct.lotDetails.halfLotQuantity;
                      if (selectedLotType === 'mini') qty = displayProduct.lotDetails.miniLotQuantity;
                    }
                    addToCart(displayProduct._id, qty);
                  }}
                  disabled={addingToCart || displayProduct.stock <= 0}
                  className="flex-1 min-w-[140px] bg-accent hover:bg-accent-dark text-white py-2.5 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow disabled:opacity-70"
                >
                  <span className="material-symbols-outlined text-[18px]">{addingToCart ? 'hourglass_empty' : 'shopping_cart'}</span> 
                  {addingToCart ? 'ADDING...' : 'ADD TO CART'}
                </button>
              )}
              <button 
                onClick={async () => {
                  if (!isAuthenticated) {
                    openLoginModal();
                    return;
                  }
                  let qty = 1;
                  if (displayProduct.isLot && displayProduct.lotDetails) {
                    if (selectedLotType === 'full') qty = displayProduct.lotDetails.fullLotQuantity;
                    if (selectedLotType === 'half') qty = displayProduct.lotDetails.halfLotQuantity;
                    if (selectedLotType === 'mini') qty = displayProduct.lotDetails.miniLotQuantity;
                  }
                  await addToCart(displayProduct._id, qty);
                  router.push('/checkout');
                }}
                disabled={addingToCart || displayProduct.stock <= 0} 
                className="flex-1 min-w-[140px] bg-primary hover:bg-primary-dark text-white py-2.5 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow disabled:opacity-70"
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span> BUY NOW
              </button>
              <button 
                onClick={() => setIsInquiryModalOpen(true)}
                className="flex-1 min-w-[140px] bg-white border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white py-2.5 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span> BULK INQUIRE
              </button>
            </div>

            {/* Variants */}
            {displayProduct.hasVariants && displayProduct.variants?.length > 0 && (
              <div className="border-b border-surface-border pb-6 pt-4">
                <h3 className="text-lg font-medium text-text-primary mb-4">Available Variants</h3>
                <div className="flex flex-col gap-3">
                  {displayProduct.variants.map((variant: any) => (
                    <div key={variant._id || variant.sku} className="flex items-center justify-between border border-surface-border rounded-lg p-3 hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-3">
                        {variant.image && (
                          <div className="w-12 h-12 relative rounded border border-surface-border overflow-hidden shrink-0">
                            <Image src={variant.image} alt={variant.name} fill className="object-cover" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-text-primary text-sm line-clamp-1">{variant.name}</div>
                          <div className="text-xs text-text-secondary">SKU: {variant.sku}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right hidden sm:block">
                          <div className="font-bold text-text-primary">₹{(variant.salePrice || 0).toLocaleString('en-IN')}</div>
                          {variant.mrp > variant.salePrice && <div className="text-[10px] text-text-muted line-through">₹{(variant.mrp || 0).toLocaleString('en-IN')}</div>}
                        </div>
                        <button 
                          onClick={() => {
                            if (!isAuthenticated) {
                              openLoginModal();
                              return;
                            }
                            addToCart(displayProduct._id, 1, variant._id);
                          }}
                          disabled={addingToCart || variant.stock <= 0}
                          className={`px-3 py-1.5 rounded-md font-bold text-xs flex items-center gap-1 transition-colors ${variant.stock > 0 ? 'bg-primary hover:bg-primary-dark text-white' : 'bg-gray-200 text-gray-500'}`}
                        >
                          <span className="material-symbols-outlined text-[14px]">{variant.stock > 0 ? 'add' : 'block'}</span> {variant.stock > 0 ? 'ADD' : 'SOLD'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-xl font-medium text-text-primary mb-4 border-b border-surface-border pb-2">Description</h3>
              <p className="text-sm text-text-primary leading-relaxed whitespace-pre-line">
                {displayProduct.description || "No description provided."}
              </p>
            </div>

            {/* Reviews Section */}
            <div className="mt-8 border-t border-surface-border pt-6">
              <h3 className="text-xl font-medium text-text-primary mb-4">Ratings & Reviews</h3>
              
              {isLoadingReviews ? (
                <div className="flex justify-center p-6"><span className="material-symbols-outlined animate-spin text-primary">progress_activity</span></div>
              ) : reviews && reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review: any) => (
                    <div key={review._id} className="border border-surface-border rounded p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-success text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                          {review.rating} <span className="material-symbols-outlined text-[10px]">star</span>
                        </div>
                        <span className="font-bold text-text-primary text-sm">{review.title || 'Review'}</span>
                      </div>
                      <p className="text-sm text-text-secondary mb-3">{review.comment}</p>
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <span className="font-medium">{review.user?.name || 'Customer'}</span>
                        <span>•</span>
                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                        {review.isVerifiedPurchase && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-text-secondary"><span className="material-symbols-outlined text-[14px]">check_circle</span> Certified Buyer</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-surface rounded p-6 text-center text-text-secondary">
                  <p>No reviews yet for this product. Be the first to review!</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      
      <BulkInquiryModal 
        isOpen={isInquiryModalOpen} 
        onClose={() => setIsInquiryModalOpen(false)} 
        product={displayProduct} 
      />
    </div>
  );
}
