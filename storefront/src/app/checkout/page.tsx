'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { useAddresses } from '@/hooks/useApi';
import api from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, openLoginModal } = useAuthStore();
  const { items, isLoading: isCartLoading, fetchCart } = useCartStore();
  const { addresses, isLoading: isAddressesLoading } = useAddresses();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [utr, setUtr] = useState('');
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      openLoginModal();
    } else {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart, openLoginModal]);

  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses[0]);
    }
  }, [addresses, selectedAddress]);

  // Calculations
  const totalMrp = items.reduce((sum, item) => sum + (item.productId?.mrp * item.quantity), 0) || 0;
  const totalPrice = items.reduce((sum, item) => sum + (item.productId?.sellingPrice * item.quantity), 0) || 0;
  const totalDiscount = totalMrp - totalPrice;
  const deliveryCharges = totalPrice > 499 ? 0 : 40;
  const orderTotal = totalPrice + deliveryCharges;

  const upiId = 'arbuda@upi';

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address.");
      return;
    }
    
    setIsPlacingOrder(true);
    try {
      const orderItems = items.map(item => ({
        product: item.productId._id,
        quantity: item.quantity,
        price: item.productId.sellingPrice
      }));

      const res = await api.post('/orders', {
        items: orderItems,
        shippingAddress: {
          name: selectedAddress.name,
          addressLine1: selectedAddress.addressLine1,
          addressLine2: selectedAddress.addressLine2,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
          phone: selectedAddress.phone
        },
        paymentMode: 'UPI'
      });

      if (res.data.success) {
        // Order placed, maybe now initiate payment
        // For MVP, just redirect to order success or clear cart
        await fetchCart(); // will be empty
        router.push('/account');
      }
    } catch (error: any) {
      console.error("Failed to place order", error);
      alert(error.response?.data?.message || "Failed to place order.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (isCartLoading || !isAuthenticated) {
    return (
      <div className="bg-background min-h-screen pb-12 flex justify-center items-center">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-background min-h-screen py-8 flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-text-primary mb-4">Your cart is empty</h2>
        <Link href="/" className="bg-primary text-white px-8 py-3 rounded-sm font-medium hover:bg-primary-dark">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-6">
        
        {/* Left: Checkout Steps */}
        <div className="w-full lg:w-2/3 space-y-4">
          
          {/* Step 1: Login (Completed State) */}
          <div className="bg-white border border-surface-border rounded-sm shadow-sm">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="bg-surface text-text-primary w-6 h-6 flex items-center justify-center rounded-sm font-bold text-xs">1</span>
                <div>
                  <h2 className="text-text-primary font-medium">LOGIN <span className="material-symbols-outlined text-primary text-[16px] align-middle ml-1">check_circle</span></h2>
                  <p className="text-sm text-text-secondary mt-1 font-medium">{user?.name || 'User'} <span className="mx-2">{user?.phone || ''}</span></p>
                </div>
              </div>
              <button className="text-primary text-sm font-medium border border-surface-border px-4 py-1 rounded-sm hover:shadow-sm">CHANGE</button>
            </div>
          </div>

          {/* Step 2: Delivery Address */}
          <div className="bg-white border border-surface-border rounded-sm shadow-sm">
            <div className={`p-4 flex items-center gap-4 ${step === 1 ? 'bg-primary text-white rounded-t-sm' : ''}`}>
              <span className={`${step === 1 ? 'bg-white text-primary' : 'bg-surface text-text-primary'} w-6 h-6 flex items-center justify-center rounded-sm font-bold text-xs`}>2</span>
              <h2 className={`font-medium ${step === 1 ? 'text-white' : 'text-text-primary'}`}>DELIVERY ADDRESS</h2>
            </div>
            
            {step === 1 && (
              <div className="p-6 border-t border-surface-border">
                {addresses && addresses.length > 0 ? (
                  <div className="flex gap-4 items-start bg-primary/5 border border-primary/20 rounded p-4 relative cursor-pointer">
                    <input type="radio" name="address" checked readOnly className="mt-1 accent-primary" />
                    <div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-text-primary">{selectedAddress?.name}</span>
                        <span className="font-bold text-text-primary">{selectedAddress?.phone}</span>
                      </div>
                      <p className="text-sm text-text-primary mt-2 leading-relaxed">
                        {selectedAddress?.addressLine1}, {selectedAddress?.addressLine2 ? selectedAddress.addressLine2 + ', ' : ''}
                        {selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.pincode}
                      </p>
                      <button 
                        onClick={() => setStep(2)}
                        className="mt-4 bg-accent text-white px-8 py-3 rounded-sm font-bold shadow hover:bg-accent-dark transition-colors"
                      >
                        DELIVER HERE
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-surface text-text-secondary rounded text-sm mb-4">
                    You have no saved addresses. Please add one below.
                  </div>
                )}

                <div className="mt-4 border border-surface-border rounded p-4 flex items-center gap-4 text-primary font-medium cursor-pointer hover:bg-surface">
                  <span className="material-symbols-outlined">add</span> Add a new address
                </div>
              </div>
            )}
            {step > 1 && (
              <div className="px-14 pb-4">
                <p className="text-sm text-text-primary font-medium">{selectedAddress?.name} <span className="font-normal text-text-secondary mx-2">{selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.pincode}</span></p>
              </div>
            )}
          </div>

          {/* Step 3: Order Summary */}
          <div className="bg-white border border-surface-border rounded-sm shadow-sm">
            <div className={`p-4 flex items-center gap-4 ${step === 2 ? 'bg-primary text-white rounded-t-sm' : ''}`}>
              <span className={`${step === 2 ? 'bg-white text-primary' : 'bg-surface text-text-primary'} w-6 h-6 flex items-center justify-center rounded-sm font-bold text-xs`}>3</span>
              <h2 className={`font-medium ${step === 2 ? 'text-white' : 'text-text-primary'}`}>ORDER SUMMARY</h2>
            </div>
            {step === 2 && (
              <div>
                <div className="p-4 border-t border-surface-border">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between items-start mt-6 pt-6 border-t border-surface-border first:mt-0 first:pt-0 first:border-0">
                      <div>
                        <h3 className="font-medium text-text-primary">{item.productId.name}</h3>
                        <p className="text-sm text-text-secondary mt-1">Quantity: {item.quantity}</p>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-lg font-bold text-text-primary">₹{item.productId.sellingPrice.toLocaleString('en-IN')}</span>
                          <span className="text-sm text-text-muted line-through">₹{item.productId.mrp.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      <div className="text-sm text-text-primary text-right">
                        Delivery by <span className="font-medium">Tomorrow</span> | <span className="text-success">Free</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-white border-t border-surface-border flex justify-between items-center">
                  <p className="text-sm text-text-primary">Order confirmation will be sent to <span className="font-medium">{user?.phone}</span></p>
                  <button 
                    onClick={() => setStep(3)}
                    className="bg-accent text-white px-8 py-3 rounded-sm font-bold shadow hover:bg-accent-dark transition-colors"
                  >
                    CONTINUE
                  </button>
                </div>
              </div>
            )}
            {step > 2 && (
              <div className="px-14 pb-4">
                <p className="text-sm text-text-primary font-medium">{items.length} Items</p>
              </div>
            )}
          </div>

          {/* Step 4: Payment Options */}
          <div className="bg-white border border-surface-border rounded-sm shadow-sm">
            <div className={`p-4 flex items-center gap-4 ${step === 3 ? 'bg-primary text-white rounded-t-sm' : ''}`}>
              <span className={`${step === 3 ? 'bg-white text-primary' : 'bg-surface text-text-primary'} w-6 h-6 flex items-center justify-center rounded-sm font-bold text-xs`}>4</span>
              <h2 className={`font-medium ${step === 3 ? 'text-white' : 'text-text-primary'}`}>PAYMENT OPTIONS</h2>
            </div>
            {step === 3 && (
              <div className="p-0 border-t border-surface-border">
                
                {/* UPI Option */}
                <div className="p-4 border-b border-surface-border bg-primary/5">
                  <label className="flex items-center gap-4 cursor-pointer font-medium text-text-primary">
                    <input type="radio" name="payment" defaultChecked className="w-4 h-4 accent-primary" />
                    UPI (Google Pay, PhonePe, Paytm)
                  </label>
                  
                  <div className="ml-8 mt-4 bg-white p-6 rounded border border-surface-border flex flex-col md:flex-row items-center gap-8">
                    {/* QR Code */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-40 h-40 bg-surface border border-surface-border p-2 rounded-lg flex items-center justify-center">
                        {/* Placeholder for QR Code */}
                        <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=${upiId}&pn=Arbuda&am=${orderTotal}&cu=INR`} alt="UPI QR Code" width={150} height={150} />
                      </div>
                      <span className="text-xs text-text-secondary font-medium">Scan with any UPI app</span>
                    </div>
                    
                    {/* Instructions & UTR */}
                    <div className="flex-grow w-full">
                      <p className="text-sm text-text-primary mb-4 leading-relaxed">
                        1. Scan the QR code using any UPI app.<br/>
                        2. Pay exactly <strong className="text-lg">₹{orderTotal.toLocaleString('en-IN')}</strong>.<br/>
                        3. Enter the 12-digit UTR / Reference number below to confirm your order.
                      </p>
                      
                      <div className="space-y-4">
                        <input 
                          type="text" 
                          placeholder="Enter 12-digit UTR Number" 
                          value={utr}
                          onChange={(e) => setUtr(e.target.value)}
                          className="w-full border border-surface-border rounded-sm px-4 py-3 outline-none focus:border-primary focus:ring-1 ring-primary text-sm"
                        />
                        <button 
                          disabled={isPlacingOrder}
                          onClick={handlePlaceOrder}
                          className="w-full md:w-auto bg-accent text-white px-8 py-3 rounded-sm font-bold shadow hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isPlacingOrder ? 'PLACING ORDER...' : 'CONFIRM ORDER'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other Payment Options (Disabled visually) */}
                <div className="p-4 border-b border-surface-border opacity-50 cursor-not-allowed">
                  <label className="flex items-center gap-4 font-medium text-text-primary">
                    <input type="radio" name="payment" disabled className="w-4 h-4" />
                    Credit / Debit / ATM Card
                  </label>
                </div>
                <div className="p-4 border-b border-surface-border opacity-50 cursor-not-allowed">
                  <label className="flex items-center gap-4 font-medium text-text-primary">
                    <input type="radio" name="payment" disabled className="w-4 h-4" />
                    Net Banking
                  </label>
                </div>
                <div className="p-4 opacity-50 cursor-not-allowed">
                  <label className="flex items-center gap-4 font-medium text-text-primary">
                    <input type="radio" name="payment" disabled className="w-4 h-4" />
                    Cash on Delivery
                  </label>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right: Price Details (Sticky) */}
        <div className="w-full lg:w-1/3">
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
                <span className={deliveryCharges === 0 ? "text-success" : ""}>{deliveryCharges === 0 ? 'Free' : `₹${deliveryCharges}`}</span>
              </div>
              <div className="flex justify-between border-t border-dashed border-surface-border pt-4 text-lg font-bold">
                <span>Amount Payable</span>
                <span>₹{orderTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 mt-4 text-text-secondary text-sm">
            <span className="material-symbols-outlined text-[32px] text-text-muted">security</span>
            <p>Safe and Secure Payments. Easy returns. 100% Authentic products.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
