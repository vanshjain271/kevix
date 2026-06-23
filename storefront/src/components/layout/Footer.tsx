'use client';

import Link from 'next/link';
import { useCategories } from '@/hooks/useApi';

export default function Footer() {
  const { categories } = useCategories();
  
  // Show only 5 categories max in footer
  const footerCategories = categories?.slice(0, 5) || [];

  return (
    <footer className="bg-foreground text-white mt-auto">
      {/* Main Footer Links */}
      <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* About */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl text-accent">devices</span>
            <span className="text-2xl font-bold tracking-tight">Kevix</span>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            Your trusted destination for premium mobile accessories. We provide top-quality chargers, cables, audio gear, and more at unbeatable prices.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="https://wa.me/918866847353" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-green-600/20 text-green-500 flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors" title="Chat on WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[20px] h-[20px]">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
            </a>
            <a href="mailto:arbudaaccessories@gmail.com" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors" title="Email Us">
              <span className="material-symbols-outlined text-[18px]">mail</span>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold border-b border-white/20 pb-2 inline-block">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
            <li><Link href="/blogs" className="hover:text-accent transition-colors text-accent">Read Blog</Link></li>
            <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
            <li><Link href="/account" className="hover:text-accent transition-colors">Track Order</Link></li>
            <li><Link href="/contact?subject=Bulk Inquiries" className="hover:text-accent transition-colors">Bulk Inquiries</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold border-b border-white/20 pb-2 inline-block">Categories</h4>
          <ul className="space-y-2 text-sm text-white/80">
            {footerCategories.length > 0 ? (
              footerCategories.map((category: any) => (
                <li key={category.id || category._id}>
                  <Link href={`/category/${category.slug}`} className="hover:text-accent transition-colors capitalize">
                    {category.name}
                  </Link>
                </li>
              ))
            ) : (
              <li><span className="text-white/50">Loading categories...</span></li>
            )}
          </ul>
        </div>

        {/* Policy */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold border-b border-white/20 pb-2 inline-block">Policies</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href="/policies/refund-policy" className="hover:text-accent transition-colors">Return & Refund Policy</Link></li>
            <li><Link href="/policies/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
            <li><Link href="/policies/terms-and-conditions" className="hover:text-accent transition-colors">Terms & Conditions</Link></li>
            <li><Link href="/policies/shipping-policy" className="hover:text-accent transition-colors">Shipping Policy</Link></li>
            <li><Link href="/policies/return-policy" className="hover:text-accent transition-colors">Return Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-white/10 py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-4 items-center flex-wrap justify-center text-sm text-white/60">
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">verified_user</span> 100% Secure Payments</span>
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">local_shipping</span> Fast Delivery</span>
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">assignment_return</span> Easy Returns</span>
          </div>
          <div className="text-sm text-white/60 text-center flex flex-col md:text-right gap-1">
            <span>&copy; {new Date().getFullYear()} Kevix. All rights reserved.</span>
            <span className="text-[11px] opacity-70">Built by Arbuda Accessories</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
