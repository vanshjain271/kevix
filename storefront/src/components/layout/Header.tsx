'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCategories, useSettings } from '@/hooks/useApi';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/api';

export default function Header() {
  const { isAuthenticated, user, openLoginModal } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { categories } = useCategories();
  const { settings } = useSettings();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const pathname = usePathname();
  
  // Force profile completion
  useEffect(() => {
    if (isAuthenticated && user) {
      const { name, email, phone } = user;
      if ((!name || !email || !phone) && pathname !== '/complete-profile') {
        router.push('/complete-profile');
      }
    }
  }, [isAuthenticated, user, pathname, router]);

  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) { setSuggestions([]); return; }
    setIsSearching(true);
    try {
      const res = await api.get(`/products?search=${encodeURIComponent(query)}&limit=6`);
      setSuggestions(res.data?.data?.products || res.data?.products || []);
    } catch {
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.length >= 2) {
      setShowSuggestions(true);
      debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  const handleSuggestionClick = (productId: string) => {
    setShowSuggestions(false);
    setSearch('');
    router.push(`/product/${productId}`);
  };

  return (
    <header className="w-full sticky top-0 z-50 shadow-md">
      {/* Announcement Ticker */}
      {settings?.tickerEnabled && settings?.tickerText && (
        <div className="bg-purple-900 text-white text-xs py-2 overflow-hidden relative">
          <div className="ticker-track flex whitespace-nowrap">
            {/* Render the text multiple times so it wraps seamlessly */}
            {[...Array(6)].map((_, i) => (
              <span key={i} className="inline-flex items-center gap-3 px-6 shrink-0">
                <span>📢</span>
                <span className="font-medium tracking-wide">{settings.tickerText}</span>
                <span className="text-purple-400 mx-2">•</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-white border-b border-purple-100 py-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap md:flex-nowrap items-center justify-between gap-y-3 md:gap-8">

          {/* Stylish KEVIX Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="relative">
              <span className="text-3xl font-black tracking-tighter bg-gradient-to-br from-purple-600 via-violet-600 to-purple-900 bg-clip-text text-transparent select-none group-hover:from-purple-500 group-hover:to-purple-700 transition-all duration-300">
                KEVI<span className="text-purple-400">X</span>
              </span>
              <span className="absolute -top-1 -right-3 text-purple-500 text-[10px] font-bold tracking-widest uppercase opacity-70">™</span>
            </div>
          </Link>

          {/* Search Bar with Autocomplete */}
          <div className="order-last md:order-none w-full md:flex-grow md:w-auto relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center w-full bg-gray-50 border-2 border-purple-200 rounded-xl overflow-hidden focus-within:border-purple-500 focus-within:bg-white transition-all duration-200 shadow-sm">
                <input
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  onFocus={() => search.length >= 2 && setShowSuggestions(true)}
                  placeholder="Search for accessories..."
                  className="w-full px-4 py-2.5 text-gray-800 outline-none text-sm bg-transparent"
                />
                <button type="submit" className="bg-purple-600 text-white px-5 py-2.5 hover:bg-purple-700 transition-colors flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </button>
              </div>
            </form>

            {/* Autocomplete Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-purple-100 z-50 overflow-hidden">
                {isSearching ? (
                  <div className="p-4 flex items-center gap-3 text-gray-500 text-sm">
                    <span className="material-symbols-outlined animate-spin text-purple-500 text-[18px]">progress_activity</span>
                    Searching...
                  </div>
                ) : suggestions.length > 0 ? (
                  <>
                    {suggestions.map((product: any) => {
                      const img = product.images?.[0]?.url || product.images?.[0];
                      return (
                        <button
                          key={product._id}
                          onClick={() => handleSuggestionClick(product._id)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors text-left border-b border-gray-50 last:border-0"
                        >
                          {img && (
                            <img src={img} alt={product.name} className="w-10 h-10 object-contain rounded-lg bg-gray-50 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                            <p className="text-xs text-purple-600 font-bold">₹{(product.salePrice || 0).toLocaleString('en-IN')}</p>
                          </div>
                          <span className="material-symbols-outlined text-gray-300 text-[16px] ml-auto shrink-0">north_west</span>
                        </button>
                      );
                    })}
                    <button
                      onClick={() => { setShowSuggestions(false); router.push(`/search?q=${encodeURIComponent(search)}`); }}
                      className="w-full px-4 py-3 text-center text-sm text-purple-600 font-semibold hover:bg-purple-50 transition-colors"
                    >
                      See all results for "{search}"
                    </button>
                  </>
                ) : (
                  <div className="p-4 text-sm text-gray-500">No products found for "{search}"</div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-5 shrink-0">
            {isAuthenticated ? (
              <Link href="/account" className="flex flex-col items-center text-gray-700 hover:text-purple-600 transition-colors group">
                <span className="material-symbols-outlined text-[26px] text-gray-500 group-hover:text-purple-600 transition-colors">person</span>
                <span className="text-[10px] font-semibold mt-0.5 truncate max-w-[65px]">{user?.name?.split(' ')[0] || 'Profile'}</span>
              </Link>
            ) : (
              <button onClick={openLoginModal} className="flex flex-col items-center text-gray-700 hover:text-purple-600 transition-colors group">
                <span className="material-symbols-outlined text-[26px] text-gray-500 group-hover:text-purple-600 transition-colors">person</span>
                <span className="text-[10px] font-semibold mt-0.5">Sign In</span>
              </button>
            )}

            <Link href="/wishlist" className="flex flex-col items-center text-gray-700 hover:text-purple-600 transition-colors relative group">
              <div className="relative">
                <span className="material-symbols-outlined text-[26px] text-gray-500 group-hover:text-red-500 transition-colors" style={{ fontVariationSettings: wishlistItems.length > 0 ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                    {wishlistItems.length}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold mt-0.5">Wishlist</span>
            </Link>

            <Link href="/cart" className="flex flex-col items-center text-gray-700 hover:text-purple-600 transition-colors relative group">
              <div className="relative">
                <span className="material-symbols-outlined text-[26px] text-gray-500 group-hover:text-purple-600 transition-colors">shopping_bag</span>
                {cartItems && cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                    {cartItems.length}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold mt-0.5">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Purple Category Nav Bar */}
      <nav className="bg-purple-700 text-white font-semibold text-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex overflow-x-auto scrollbar-hide py-2.5 gap-6 items-center">
          <Link href="/category/all" className="whitespace-nowrap hover:text-purple-200 transition-colors flex items-center gap-1.5 shrink-0">
            <span className="material-symbols-outlined text-[18px]">menu</span>
            All
          </Link>
          {categories && categories.map((cat: any) => (
            <Link key={cat._id} href={`/category/${cat.slug}`} className="whitespace-nowrap hover:text-purple-200 transition-colors capitalize shrink-0">
              {cat.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
