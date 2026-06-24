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
import ModelsOrderModal from '@/components/product/ModelsOrderModal';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { product, isLoading } = useProductDetail(resolvedParams.id);
  const { reviews, isLoading: isLoadingReviews } = useReviews(resolvedParams.id);
  const { wishlist, mutate: mutateWishlist } = useWishlist();
  const { addToCart, items, updateQuantity, isLoading: addingToCart } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  const { isAuthenticated, openLoginModal } = useAuthStore();
  const router = useRouter();
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isModelsModalOpen, setIsModelsModalOpen] = useState(false);
  
  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState({ type: '', text: '' });
  
  const displayProduct = product ? {
    ...product,
    stock: product.totalStock !== undefined ? product.totalStock : product.stock,
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
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  // Image Zoom State
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center' });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%` });
  };
  const handleMouseLeave = () => {
    setZoomStyle({ transformOrigin: 'center' });
  };

  const getStepQty = (product: any, currentQty: number) => {
    if (product.isLot && product.lotDetails) {
      const { fullLotQuantity, halfLotQuantity, miniLotQuantity, allowHalfLot, allowMiniLot } = product.lotDetails;
      if (allowMiniLot && miniLotQuantity && currentQty % miniLotQuantity === 0) return miniLotQuantity;
      if (allowHalfLot && halfLotQuantity && currentQty % halfLotQuantity === 0) return halfLotQuantity;
      if (fullLotQuantity && currentQty % fullLotQuantity === 0) return fullLotQuantity;
      return fullLotQuantity || 1;
    }
    return product.minOrderQty || 1;
  };

  // Update active image and default variant when product loads
  useEffect(() => {
    if (displayProduct) {
      if (displayProduct.images && displayProduct.images.length > 0 && !activeImage) {
        setActiveImage(displayProduct.images[0]);
      }
      if (!displayProduct.isLot && displayProduct.hasVariants && displayProduct.variants?.length > 0 && !selectedVariant) {
        setSelectedVariant(displayProduct.variants[0]);
      }
    }
  }, [product?._id]);

  const inWishlist = wishlist.some((item: any) => item._id === displayProduct?._id);
  const cartItem = items.find(i => {
    if (selectedVariant) {
      return i.productId?._id === displayProduct?._id && i.variantId === selectedVariant._id;
    }
    return i.productId?._id === displayProduct?._id && !i.variantId;
  });

  // Active price: variant price if selected, else base product price
  const activePrice = selectedVariant?.salePrice ?? displayProduct?.salePrice ?? 0;
  const activeMrp = selectedVariant?.mrp ?? displayProduct?.mrp ?? 0;

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

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    setReviewSubmitting(true);
    setReviewMsg({ type: '', text: '' });
    try {
      const res = await api.post('/reviews', {
        productId: product._id,
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.comment
      });
      if (res.data?.success) {
        setReviewMsg({ type: 'success', text: 'Review submitted for approval!' });
        setTimeout(() => setIsReviewModalOpen(false), 2000);
      }
    } catch (error: any) {
      setReviewMsg({ type: 'error', text: error.response?.data?.message || 'Failed to submit review' });
    } finally {
      setReviewSubmitting(false);
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
            <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-visible scrollbar-hide">
              {displayProduct.images.map((imgObj: any, idx: number) => {
                const imgStr = typeof imgObj === 'string' ? imgObj : imgObj?.url;
                if (!imgStr) return null;
                return (
                  <div 
                    key={idx} 
                    onClick={() => setActiveImage(imgStr)}
                    className={`w-16 h-16 border rounded-sm overflow-hidden shrink-0 transition-all cursor-pointer ${activeImage === imgStr ? 'border-primary ring-1 ring-primary' : 'border-surface-border hover:border-text-muted'}`}
                  >
                    <div className="relative w-full h-full pointer-events-none">
                      <Image src={imgStr} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Main Image */}
            <div 
              className="order-1 md:order-2 flex-grow aspect-square md:aspect-auto md:h-[450px] relative border border-surface-border rounded-sm p-4 group cursor-crosshair overflow-hidden"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {activeImage && (
                <Image 
                  key={activeImage} 
                  src={activeImage} 
                  alt={displayProduct.name} 
                  fill 
                  style={zoomStyle}
                  className="object-contain p-4 group-hover:scale-[2] transition-transform duration-200" 
                />
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
                <div className="text-success font-bold text-sm mb-1">
                  {activeMrp > activePrice ? `Extra ₹${(activeMrp - activePrice).toLocaleString('en-IN')} off` : 'Best Price'}
                </div>
                <div className="mt-4 flex items-end gap-3">
                  <span className="text-3xl font-medium text-text-primary">₹{activePrice.toLocaleString('en-IN')}</span>
                  {activeMrp > activePrice && <span className="text-lg text-text-muted line-through mb-1">₹{activeMrp.toLocaleString('en-IN')}</span>}
                  {activeMrp > activePrice && <span className="text-sm font-bold text-success mb-1.5">{Math.round(((activeMrp - activePrice) / activeMrp) * 100)}% off</span>}
                </div>
                <div className="text-xs text-text-secondary mt-1">
                  {(selectedVariant ? selectedVariant.stock : displayProduct.stock) > 0 ? (
                    <span className="text-success font-bold">In Stock ({(selectedVariant ? selectedVariant.stock : displayProduct.stock)} units available)</span>
                  ) : (
                    <span className="text-danger font-bold">Out of Stock</span>
                  )}
                </div>
              </div>
            )}

            {/* Variants */}
            {!displayProduct.isLot && displayProduct.hasVariants && displayProduct.variants && displayProduct.variants.length > 0 && (
              <div className="border-b border-surface-border pb-6">
                <div className="text-sm font-bold text-text-primary mb-3">Available Options</div>
                <div className="flex flex-wrap gap-3">
                  {displayProduct.variants.map((variant: any) => (
                    <button
                      key={variant._id || variant.name}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 border rounded-sm text-sm font-medium transition-all ${
                        selectedVariant?._id === variant._id || selectedVariant?.name === variant.name
                          ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                          : 'border-surface-border text-text-primary hover:border-primary/50'
                      }`}
                    >
                      {variant.name} {variant.color && `- ${variant.color}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6 border-b border-surface-border pb-6">
              {cartItem ? (
                <div className="flex-1 min-w-[140px] flex items-center justify-between border-2 border-accent rounded-lg overflow-hidden h-[42px]">
                  <button 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      const step = getStepQty(displayProduct, cartItem.quantity);
                      updateQuantity(cartItem.id!, cartItem.quantity - step); 
                    }}
                    className="w-1/3 h-full flex items-center justify-center bg-accent/10 text-accent hover:bg-accent/20 font-bold text-xl"
                  >-</button>
                  <span className="w-1/3 h-full flex items-center justify-center font-bold text-text-primary">
                    {cartItem.quantity}
                  </span>
                  <button 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      const step = getStepQty(displayProduct, cartItem.quantity);
                      updateQuantity(cartItem.id!, cartItem.quantity + step); 
                    }}
                    className="w-1/3 h-full flex items-center justify-center bg-accent/10 text-accent hover:bg-accent/20 font-bold text-xl"
                  >+</button>
                </div>
              ) : (
                <button 
                  onClick={async (e) => {
                    e.preventDefault();
                    if (displayProduct.hasModels) {
                      setIsModelsModalOpen(true);
                      return;
                    }
                    if (!isAuthenticated) { openLoginModal(); return; }
                    let qty = 1;
                    if (displayProduct.isLot && displayProduct.lotDetails) {
                      if (selectedLotType === 'full') qty = displayProduct.lotDetails.fullLotQuantity;
                      else if (selectedLotType === 'half') qty = displayProduct.lotDetails.halfLotQuantity;
                      else if (selectedLotType === 'mini') qty = displayProduct.lotDetails.miniLotQuantity;
                    } else {
                      qty = displayProduct.minOrderQty || 1;
                    }
                    setIsAdding(true);
                    try {
                      await addToCart(displayProduct._id, qty, selectedVariant?._id);
                    } catch (err) {
                      console.error('Add to cart failed', err);
                    } finally {
                      setIsAdding(false);
                    }
                  }}
                  disabled={addingToCart || isAdding || (!displayProduct.isLot && (selectedVariant ? selectedVariant.stock : displayProduct.stock) <= 0)}
                  className="flex-1 min-w-[140px] bg-accent hover:bg-accent-dark text-white py-2.5 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow disabled:opacity-70"
                >
                  <span className="material-symbols-outlined text-[18px]">{(addingToCart || isAdding) ? 'hourglass_empty' : displayProduct.hasModels ? 'checklist' : 'shopping_cart'}</span> 
                  {(addingToCart || isAdding) ? 'ADDING...' : displayProduct.hasModels ? 'SELECT MODELS' : 'ADD TO CART'}
                </button>
              )}
              <button 
                onClick={async (e) => {
                  e.preventDefault();
                  if (displayProduct.hasModels) {
                    setIsModelsModalOpen(true);
                    return;
                  }
                  if (!isAuthenticated) { openLoginModal(); return; }
                  let qty = 1;
                  if (displayProduct.isLot && displayProduct.lotDetails) {
                    if (selectedLotType === 'full') qty = displayProduct.lotDetails.fullLotQuantity;
                    else if (selectedLotType === 'half') qty = displayProduct.lotDetails.halfLotQuantity;
                    else if (selectedLotType === 'mini') qty = displayProduct.lotDetails.miniLotQuantity;
                  } else {
                    qty = displayProduct.minOrderQty || 1;
                  }
                  setIsAdding(true);
                  try {
                    await addToCart(displayProduct._id, qty, selectedVariant?._id);
                    router.push('/checkout');
                  } catch (err) {
                    console.error('Buy now failed', err);
                  } finally {
                    setIsAdding(false);
                  }
                }}
                disabled={addingToCart || isAdding || (!displayProduct.isLot && displayProduct.stock <= 0)} 
                className="flex-1 min-w-[140px] bg-primary hover:bg-primary-dark text-white py-2.5 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow disabled:opacity-70"
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span> BUY NOW
              </button>
              <button 
                onClick={() => setIsInquiryModalOpen(true)}
                className="flex-1 min-w-[140px] bg-white border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white py-2.5 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow"
              >
                <span className="material-symbols-outlined text-[18px]">list_alt</span> BULK INQUIRE
              </button>
              <a 
                href={`https://wa.me/918866847353?text=Hi, I want to enquire about ${encodeURIComponent(displayProduct.name)}. Link: ${typeof window !== 'undefined' ? window.location.href : ''}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 min-w-[140px] bg-[#25D366] hover:bg-[#1DA851] text-white py-2.5 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg> WHATSAPP
              </a>
            </div>

            {/* Variants */}
            {!displayProduct.isLot && displayProduct.hasVariants && displayProduct.variants?.length > 0 && (
              <div className="border-b border-surface-border pb-6 mt-6">
                <h3 className="text-lg font-medium text-text-primary mb-4">Available Variants
                  {selectedVariant && (
                    <button onClick={() => setSelectedVariant(null)} className="ml-3 text-xs text-primary underline font-normal">Clear</button>
                  )}
                </h3>
                <div className="flex flex-col gap-3">
                  {displayProduct.variants.map((variant: any) => {
                    const isSelected = selectedVariant?._id === variant._id;
                    return (
                    <div 
                      key={variant._id || variant.sku} 
                      onClick={() => setSelectedVariant(isSelected ? null : variant)}
                      className={`flex items-center justify-between border rounded-lg p-3 cursor-pointer transition-colors ${
                        isSelected ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-surface-border hover:border-primary/30'
                      }`}
                    >
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
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isAuthenticated) { openLoginModal(); return; }
                            addToCart(displayProduct._id, displayProduct.minOrderQty || 1, variant._id);
                          }}
                          disabled={addingToCart || (!displayProduct.isLot && variant.stock <= 0)}
                          className={`px-3 py-1.5 rounded-md font-bold text-xs flex items-center gap-1 transition-colors ${(displayProduct.isLot || variant.stock > 0) ? 'bg-primary hover:bg-primary-dark text-white' : 'bg-gray-200 text-gray-500'}`}
                        >
                          <span className="material-symbols-outlined text-[14px]">{(displayProduct.isLot || variant.stock > 0) ? 'add' : 'block'}</span> {(displayProduct.isLot || variant.stock > 0) ? 'ADD' : 'SOLD'}
                        </button>
                      </div>
                    </div>
                    );
                  })}
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
            <div id="reviews" className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-medium text-text-primary">Ratings & Reviews</h3>
                <button 
                  onClick={() => isAuthenticated ? setIsReviewModalOpen(true) : openLoginModal()} 
                  className="px-4 py-2 border border-primary text-primary rounded-sm font-medium hover:bg-primary/5 transition-colors"
                >
                  Write a Review
                </button>
              </div>
              
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
      
      {displayProduct.hasModels && (
        <ModelsOrderModal
          isOpen={isModelsModalOpen}
          onClose={() => setIsModelsModalOpen(false)}
          product={displayProduct}
        />
      )}

      {/* Write Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-surface-border bg-surface">
              <h3 className="font-bold text-lg text-text-primary">Write a Review</h3>
              <button onClick={() => setIsReviewModalOpen(false)} className="text-text-secondary hover:text-text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleReviewSubmit} className="p-4 space-y-4">
              {reviewMsg.text && (
                <div className={`p-3 rounded text-sm font-medium ${reviewMsg.type === 'success' ? 'bg-success/10 text-success' : 'bg-red-50 text-red-600'}`}>
                  {reviewMsg.text}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} 
                      type="button" 
                      onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                      className={`${reviewForm.rating >= star ? 'text-yellow-400' : 'text-gray-300'} hover:scale-110 transition-transform`}
                    >
                      <span className="material-symbols-outlined text-[32px]">{reviewForm.rating >= star ? 'star' : 'star_border'}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Title</label>
                <input 
                  type="text" 
                  value={reviewForm.title} 
                  onChange={e => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-surface-border rounded-sm focus:outline-none focus:border-primary"
                  placeholder="Sum up your experience"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Review</label>
                <textarea 
                  value={reviewForm.comment} 
                  onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full px-3 py-2 border border-surface-border rounded-sm focus:outline-none focus:border-primary min-h-[100px]"
                  placeholder="What did you like or dislike?"
                  required
                ></textarea>
              </div>
              
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={reviewSubmitting}
                  className="w-full bg-primary text-white font-bold py-3 rounded-sm hover:bg-primary-dark transition-colors disabled:opacity-70 flex justify-center items-center"
                >
                  {reviewSubmitting ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : 'Submit Review'}
                </button>
                <p className="text-xs text-text-secondary mt-2 text-center">Your review will be public after approval.</p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
