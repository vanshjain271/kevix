'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useOrders } from '@/hooks/useApi';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, openLoginModal } = useAuthStore();
  const [activeTab, setActiveTab] = useState('orders');
  const { orders, isLoading: isLoadingOrders } = useOrders();

  useEffect(() => {
    if (!isAuthenticated) {
      openLoginModal();
    }
  }, [isAuthenticated, openLoginModal]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-background min-h-screen pb-12 flex justify-center items-center">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-6">
        
        {/* Left Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-4">
          
          {/* User Info */}
          <div className="bg-white border border-surface-border rounded-sm shadow-sm p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-2xl">person</span>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Hello,</p>
              <h2 className="font-bold text-text-primary">{user?.name || 'User'}</h2>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="bg-white border border-surface-border rounded-sm shadow-sm overflow-hidden">
            
            {/* Orders */}
            <div className="border-b border-surface-border">
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-colors ${activeTab === 'orders' ? 'text-primary bg-primary/5' : 'text-text-secondary'}`}
              >
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[22px]">inventory_2</span>
                  <span className={`font-medium ${activeTab === 'orders' ? 'text-primary font-bold' : 'text-text-secondary'}`}>MY ORDERS</span>
                </div>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>

            {/* Account Settings */}
            <div className="border-b border-surface-border">
              <div className="flex items-center gap-4 p-4 text-text-secondary">
                <span className="material-symbols-outlined text-[22px]">person</span>
                <span className="font-bold text-text-secondary">ACCOUNT SETTINGS</span>
              </div>
              <div className="flex flex-col">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`text-left pl-14 pr-4 py-3 text-sm hover:text-primary transition-colors ${activeTab === 'profile' ? 'text-primary font-medium bg-primary/5' : 'text-text-primary'}`}
                >
                  Profile Information
                </button>
                <button 
                  onClick={() => setActiveTab('addresses')}
                  className={`text-left pl-14 pr-4 py-3 text-sm hover:text-primary transition-colors ${activeTab === 'addresses' ? 'text-primary font-medium bg-primary/5' : 'text-text-primary'}`}
                >
                  Manage Addresses
                </button>
              </div>
            </div>

            {/* My Stuff */}
            <div className="border-b border-surface-border">
              <div className="flex items-center gap-4 p-4 text-text-secondary">
                <span className="material-symbols-outlined text-[22px]">folder</span>
                <span className="font-bold text-text-secondary">MY STUFF</span>
              </div>
              <div className="flex flex-col">
                <button 
                  onClick={() => setActiveTab('wishlist')}
                  className={`text-left pl-14 pr-4 py-3 text-sm hover:text-primary transition-colors ${activeTab === 'wishlist' ? 'text-primary font-medium bg-primary/5' : 'text-text-primary'}`}
                >
                  My Wishlist
                </button>
                <button 
                  onClick={() => setActiveTab('reviews')}
                  className={`text-left pl-14 pr-4 py-3 text-sm hover:text-primary transition-colors ${activeTab === 'reviews' ? 'text-primary font-medium bg-primary/5' : 'text-text-primary'}`}
                >
                  My Reviews & Ratings
                </button>
              </div>
            </div>

            {/* Logout */}
            <div>
              <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 text-text-secondary hover:bg-primary/5 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[22px]">power_settings_new</span>
                <span className="font-bold text-text-secondary hover:text-primary transition-colors">LOGOUT</span>
              </button>
            </div>

          </div>
        </aside>

        {/* Right Content Area */}
        <div className="flex-grow">
          <div className="bg-white border border-surface-border rounded-sm shadow-sm h-full min-h-[500px]">
            
            {/* Orders View */}
            {activeTab === 'orders' && (
              <div>
                <div className="p-4 border-b border-surface-border flex justify-between items-center">
                  <h1 className="font-medium text-lg text-text-primary">My Orders</h1>
                  <div className="flex items-center bg-surface border border-surface-border rounded-sm px-3 py-1">
                    <span className="material-symbols-outlined text-text-muted text-[18px]">search</span>
                    <input type="text" placeholder="Search your orders here" className="bg-transparent outline-none text-sm px-2 w-48" />
                  </div>
                </div>
                
                {/* Orders List */}
                {isLoadingOrders ? (
                  <div className="p-12 flex justify-center">
                    <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
                  </div>
                ) : orders.length > 0 ? (
                  orders.map((order: any) => (
                    <div key={order._id} className="p-4 border-b border-surface-border hover:shadow-sm transition-shadow cursor-pointer">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs text-text-secondary">Order ID: {order.orderNumber}</span>
                        <span className="text-xs font-bold text-primary">{order.status}</span>
                      </div>
                      
                      <div className="space-y-4">
                        {order.items.map((item: any) => {
                          const product = item.product;
                          const image = product?.images && product.images.length > 0 ? product.images[0].url : 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop';
                          return (
                            <div key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <div className="w-20 h-20 relative bg-surface rounded p-1 shrink-0">
                                  <Image src={image} alt="Product" fill className="object-contain" />
                                </div>
                                <div>
                                  <Link href={`/product/${product?._id}`}>
                                    <h3 className="text-sm font-medium text-text-primary max-w-sm line-clamp-2 hover:text-primary transition-colors">
                                      {product?.name}
                                    </h3>
                                  </Link>
                                  <p className="text-xs text-text-secondary mt-1">Qty: {item.quantity}</p>
                                </div>
                              </div>
                              
                              <div className="font-medium text-text-primary whitespace-nowrap">
                                ₹{item.price?.toLocaleString('en-IN')}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-4 pt-4 border-t border-surface-border flex justify-between items-center">
                        <span className="text-sm font-bold">Total: ₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                        <span className="text-xs text-text-secondary">Ordered on {new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-text-secondary flex flex-col items-center">
                    <span className="material-symbols-outlined text-[48px] mb-4">production_quantity_limits</span>
                    <p>No orders found.</p>
                  </div>
                )}
              </div>
            )}

            {/* Profile View */}
            {activeTab === 'profile' && (
              <div className="p-8 max-w-2xl">
                <h1 className="font-medium text-lg text-text-primary mb-6">Personal Information</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="text-xs text-text-secondary font-medium uppercase mb-1 block">Full Name</label>
                    <input type="text" className="w-full border border-surface-border rounded-sm px-4 py-2 bg-surface text-text-primary outline-none focus:border-primary" defaultValue={user?.name || ''} />
                  </div>
                </div>

                <h2 className="font-medium text-lg text-text-primary mb-6">Email Address</h2>
                <div className="mb-8">
                  <input type="email" className="w-full md:w-1/2 border border-surface-border rounded-sm px-4 py-2 bg-surface text-text-primary outline-none focus:border-primary" defaultValue={user?.email || ''} />
                </div>

                <h2 className="font-medium text-lg text-text-primary mb-6">Mobile Number</h2>
                <div className="mb-8">
                  <input type="tel" className="w-full md:w-1/2 border border-surface-border rounded-sm px-4 py-2 bg-surface text-text-primary outline-none focus:border-primary" defaultValue={user?.phone || ''} disabled />
                </div>

                <button className="bg-primary text-white font-bold px-8 py-3 rounded-sm shadow hover:bg-primary-dark transition-colors">
                  SAVE CHANGES
                </button>
              </div>
            )}

            {/* Other views placeholder */}
            {['addresses', 'wishlist', 'reviews'].includes(activeTab) && (
              <div className="p-12 text-center flex flex-col items-center justify-center h-full text-text-secondary">
                <span className="material-symbols-outlined text-[64px] mb-4 opacity-20">construction</span>
                <h2 className="text-xl font-bold text-text-primary mb-2">Section under construction</h2>
                <p>This feature will be available soon.</p>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
