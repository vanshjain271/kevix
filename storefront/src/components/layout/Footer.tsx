'use client';

import Link from 'next/link';
import { useCategories } from '@/hooks/useApi';

export default function Footer() {
  const { categories } = useCategories();
  
  // Show only 5 categories max in footer
  const footerCategories = categories?.slice(0, 5) || [];

  return (
    <footer className="bg-foreground text-white mt-auto">
      {/* Newsletter Section */}
      <div className="bg-primary-dark border-b border-white/10 py-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-1">Subscribe to our Newsletter</h3>
            <p className="text-white/80 text-sm">Get updates on new products, flash sales, and exclusive offers.</p>
          </div>
          <div className="flex w-full md:w-auto max-w-md">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="w-full px-4 py-2.5 rounded-l-md text-text-primary outline-none focus:ring-2 ring-accent"
            />
            <button className="bg-accent px-6 py-2.5 rounded-r-md font-bold hover:bg-accent-dark transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

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
            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors"><span className="material-symbols-outlined text-[18px]">public</span></a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors"><span className="material-symbols-outlined text-[18px]">share</span></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold border-b border-white/20 pb-2 inline-block">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href="#" className="hover:text-accent transition-colors">About Us</Link></li>
            <li><Link href="#" className="hover:text-accent transition-colors">Contact Us</Link></li>
            <li><Link href="#" className="hover:text-accent transition-colors">Track Order</Link></li>
            <li><Link href="#" className="hover:text-accent transition-colors">Bulk Inquiries</Link></li>
            <li><Link href="#" className="hover:text-accent transition-colors">Careers</Link></li>
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
            <li><Link href="#" className="hover:text-accent transition-colors">Return & Refund Policy</Link></li>
            <li><Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-accent transition-colors">Terms & Conditions</Link></li>
            <li><Link href="#" className="hover:text-accent transition-colors">Shipping Policy</Link></li>
            <li><Link href="#" className="hover:text-accent transition-colors">Warranty Policy</Link></li>
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
          <div className="text-sm text-white/60 text-center">
            &copy; {new Date().getFullYear()} Kevix. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
