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
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target as Node)) {
        setIsCategoryMenuOpen(false);
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
        <div className="bg-gradient-top-bar text-white text-xs py-2 overflow-hidden relative shadow-md">
          <div className="ticker-track flex whitespace-nowrap">
            {/* Render the text multiple times so it wraps seamlessly */}
            {[...Array(6)].map((_, i) => (
              <span key={i} className="inline-flex items-center gap-3 px-6 shrink-0">
                <span>🎁</span>
                <span className="font-semibold tracking-wide text-[13px]">{settings.tickerText}</span>
                <span className="text-white/60 mx-2">|</span>
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
              <span className="text-2xl md:text-3xl font-black tracking-tighter bg-gradient-to-br from-purple-600 via-violet-600 to-purple-900 bg-clip-text text-transparent select-none group-hover:from-purple-500 group-hover:to-purple-700 transition-all duration-300">
                KEVI<span className="text-purple-400">X</span>
              </span>
              <span className="absolute -top-1 -right-3 text-purple-500 text-[9px] md:text-[10px] font-bold tracking-widest uppercase opacity-70">™</span>
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

            <a href="https://wa.me/918866847353" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-green-600 hover:text-green-500 transition-colors group">
              <div className="relative flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[26px] h-[26px]">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </div>
              <span className="text-[10px] font-semibold mt-0.5">WhatsApp</span>
            </a>

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

      {/* Category Nav is now handled by CategoryNav.tsx below the header */}
    </header>
  );
}
