'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { useCategories, useSettings } from '@/hooks/useApi';

export default function Header() {
  const { isAuthenticated, user, openLoginModal } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const { categories } = useCategories();
  const { settings } = useSettings();

  return (
    <header className="w-full relative z-50">
      {/* Top Announcement Bar */}
      {settings?.tickerEnabled && settings?.tickerText && (
        <div className="bg-primary-dark text-white text-xs py-2.5 px-4 md:px-8 flex justify-between items-center">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="material-symbols-outlined text-[16px]">campaign</span>
            {settings.tickerText}
          </span>
          <div className="hidden sm:flex gap-4 text-[11px] font-medium items-center opacity-90">
            <Link href="#" className="hover:underline transition-all">Track Order</Link>
            <span className="opacity-50">|</span>
            <Link href="#" className="hover:underline transition-all">Support</Link>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-white border-b border-surface-border py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4 md:gap-8">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            {settings?.storeLogo ? (
              <img src={settings.storeLogo} alt={settings.storeName || 'Store Logo'} className="h-8 object-contain" />
            ) : (
              <span className="material-symbols-outlined text-3.5xl text-primary font-bold">devices</span>
            )}
            <span className="text-2xl font-extrabold tracking-tight text-primary-dark">
              {settings?.storeName || 'Arbuda'}
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-grow w-full md:w-auto relative group">
            <div className="flex items-center w-full bg-white border border-gray-200 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
              <input 
                type="text" 
                placeholder="Search for accessories..." 
                className="w-full px-4 py-2.5 text-text-primary outline-none text-sm"
              />
              <button className="bg-primary text-white px-5 py-2.5 hover:bg-primary-dark transition-colors flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 shrink-0">
            {isAuthenticated ? (
              <Link href="/account" className="flex flex-col items-center text-text-primary hover:text-primary transition-colors group">
                <span className="material-symbols-outlined text-text-secondary group-hover:text-primary transition-colors">person</span>
                <span className="text-[10px] font-medium mt-1 truncate max-w-[65px]">{user?.name || 'Profile'}</span>
              </Link>
            ) : (
              <button onClick={openLoginModal} className="flex flex-col items-center text-text-primary hover:text-primary transition-colors group">
                <span className="material-symbols-outlined text-text-secondary group-hover:text-primary transition-colors">person</span>
                <span className="text-[10px] font-medium mt-1">Arbuda C...</span>
              </button>
            )}
            
            <Link href="/cart" className="flex flex-col items-center text-text-primary hover:text-primary transition-colors relative group">
              <span className="material-symbols-outlined text-text-secondary group-hover:text-primary transition-colors">favorite</span>
              <span className="text-[10px] font-medium mt-1">Wishlist</span>
            </Link>
            
            <Link href="/cart" className="flex flex-col items-center text-text-primary hover:text-primary transition-colors relative group">
              <span className="material-symbols-outlined text-text-secondary group-hover:text-primary transition-colors">shopping_bag</span>
              <span className="text-[10px] font-medium mt-1">Cart</span>
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {cartItems && cartItems.length > 0 ? cartItems.length : 0}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Categories */}
      <nav className="bg-white border-b border-surface-border text-text-primary font-semibold text-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex overflow-x-auto scrollbar-hide py-3 gap-6 items-center">
          <Link href="/category/all" className="whitespace-nowrap hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">menu</span> All Categories
          </Link>
          
          {categories && categories.length > 0 ? (
            categories.map((cat: any) => (
              <Link key={cat._id} href={`/category/${cat.slug}`} className="whitespace-nowrap hover:text-primary transition-colors capitalize">
                {cat.name}
              </Link>
            ))
          ) : null}
        </div>
      </nav>
    </header>
  );
}
