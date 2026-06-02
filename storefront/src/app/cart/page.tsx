'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function CartPage() {
  const { items, isLoading, fetchCart, updateQuantity, removeFromCart } = useCartStore();
  const { isAuthenticated, openLoginModal } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      openLoginModal();
    }
  }, [isAuthenticated, fetchCart, openLoginModal]);

  // Calculations based on backend items
  const totalMrp = items.reduce((sum, item) => sum + (item.productId?.mrp * item.quantity), 0) || 0;
  const totalPrice = items.reduce((sum, item) => sum + (item.productId?.sellingPrice * item.quantity), 0) || 0;
  const totalDiscount = totalMrp - totalPrice;
  const deliveryCharges = totalPrice > 499 ? 0 : 40; // Example logic
  const finalTotal = totalPrice + deliveryCharges;

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-6">
        
        {/* Left: Cart Items */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white border border-surface-border rounded-sm shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-surface-border bg-white flex justify-between items-center">
              <h1 className="font-medium text-lg text-text-primary">My Cart ({items.length})</h1>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">location_on</span>
                <span className="text-sm text-text-primary font-medium">Deliver to</span>
                <div className="flex border border-surface-border rounded-sm overflow-hidden">
                  <input type="text" className="w-24 px-2 py-1 text-sm outline-none font-bold" defaultValue="400001" />
                </div>
              </div>
            </div>

            {/* Items List */}
            {isLoading ? (
              <div className="p-12 flex justify-center">
                <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
              </div>
            ) : items.length > 0 ? (
              <div className="divide-y divide-surface-border">
                {items.map(item => {
                  const product = item.productId;
                  const itemDiscount = Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100);
                  const image = product.images && product.images.length > 0 ? product.images[0].url : 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=800&auto=format&fit=crop';
                  return (
                  <div key={item.id} className="p-4 flex flex-col sm:flex-row gap-6">
                    {/* Item Image */}
                    <div className="w-full sm:w-28 shrink-0 flex flex-col items-center gap-4">
                      <div className="w-24 h-24 relative">
                        <Image src={image} alt={product.name} fill className="object-contain" />
                      </div>
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-surface-border rounded-sm">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center font-bold text-lg hover:bg-surface disabled:opacity-50"
                        >-</button>
                        <div className="w-10 h-8 flex items-center justify-center text-sm font-medium border-x border-surface-border">
                          {item.quantity}
                        </div>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center font-bold text-lg hover:bg-surface"
                        >+</button>
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="flex-grow flex flex-col">
                      <Link href={`/product/${product._id}`} className="text-text-primary font-medium hover:text-primary transition-colors pr-12">
                        {product.name}
                      </Link>
                      <span className="text-xs text-text-secondary mt-1 mb-3">Seller: GadgetHub</span>
                      
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-lg font-bold text-text-primary">₹{product.sellingPrice.toLocaleString('en-IN')}</span>
                        <span className="text-sm text-text-muted line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
                        <span className="text-sm font-bold text-success">{itemDiscount}% Off</span>
                        <span className="text-xs text-success ml-2">1 offer applied <span className="material-symbols-outlined text-[12px] align-middle">info</span></span>
                      </div>

                      <div className="text-sm text-text-primary mt-auto">
                        Delivery by Tomorrow | <span className="text-success">Free</span>
                      </div>

                      {/* Item Actions */}
                      <div className="flex gap-6 mt-4 pt-4 border-t border-surface-border text-sm font-medium">
                        <button className="text-text-primary hover:text-primary transition-colors">SAVE FOR LATER</button>
                        <button onClick={() => removeFromCart(item.id)} className="text-text-primary hover:text-primary transition-colors">REMOVE</button>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            ) : (
              <div className="p-12 text-center flex flex-col items-center">
                <span className="material-symbols-outlined text-[64px] text-surface-border mb-4">production_quantity_limits</span>
                <h2 className="text-xl font-bold text-text-primary mb-2">Your cart is empty!</h2>
                <p className="text-text-secondary mb-6">Add items to it now.</p>
                <Link href="/" className="bg-primary text-white px-8 py-3 rounded-sm font-medium hover:bg-primary-dark transition-colors">
                  Shop Now
                </Link>
              </div>
            )}

            {/* Bottom Place Order Bar */}
            {items.length > 0 && !isLoading && (
              <div className="p-4 border-t border-surface-border bg-white flex justify-end sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <Link href="/checkout" className="bg-accent text-white px-10 py-3 md:py-4 rounded-sm font-bold text-lg hover:bg-accent-dark transition-colors shadow-md w-full md:w-auto text-center">
                  PLACE ORDER
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right: Price Details */}
        {items.length > 0 && !isLoading && (
          <div className="w-full lg:w-1/3">
            {/* Coupons / Offers */}
            <div className="bg-white border border-surface-border rounded-sm shadow-sm p-4 mb-4 flex justify-between items-center cursor-pointer group hover:bg-surface transition-colors">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">local_offer</span>
                <span className="font-medium text-text-primary group-hover:text-primary">Apply Coupons</span>
              </div>
              <span className="material-symbols-outlined text-text-secondary group-hover:text-primary">chevron_right</span>
            </div>

            {/* Price Breakdown */}
            <div className="bg-white border border-surface-border rounded-sm shadow-sm sticky top-24">
              <div className="p-4 border-b border-surface-border">
                <h2 className="uppercase font-medium text-text-secondary text-sm">Price Details</h2>
              </div>
              <div className="p-4 space-y-4 text-text-primary">
                <div className="flex justify-between">
                  <span>Price ({items.length} items)</span>
                  <span>₹{totalMrp.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-success">
                  <span>Discount</span>
                  <span>− ₹{totalDiscount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className={deliveryCharges === 0 ? "text-success" : ""}>
                    {deliveryCharges === 0 ? "Free Delivery" : `₹${deliveryCharges}`}
                  </span>
                </div>
                <div className="flex justify-between border-t border-dashed border-surface-border pt-4 text-lg font-bold">
                  <span>Total Amount</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="p-4 bg-success/10 text-success text-sm font-medium rounded-b-sm border-t border-surface-border">
                You will save ₹{totalDiscount.toLocaleString('en-IN')} on this order
              </div>
            </div>
            
            {/* Security Notice */}
            <div className="flex items-center gap-3 p-4 mt-4 text-text-secondary text-sm">
              <span className="material-symbols-outlined text-[32px] text-text-muted">verified_user</span>
              <p>Safe and Secure Payments. Easy returns. 100% Authentic products.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
