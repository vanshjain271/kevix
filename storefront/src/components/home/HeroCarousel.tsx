'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useBanners } from '@/hooks/useApi';

export default function HeroCarousel() {
  const { banners, isLoading } = useBanners();
  const [current, setCurrent] = useState(0);

  const displayBanners = banners || [];

  useEffect(() => {
    if (displayBanners.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === displayBanners.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [displayBanners.length]);

  if (isLoading) {
    return (
      <div className="w-full h-[280px] md:h-[450px] bg-surface flex items-center justify-center border-b border-surface-border">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    );
  }

  if (displayBanners.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-[280px] md:h-[450px] bg-background overflow-hidden border-b border-surface-border">
      {displayBanners.map((slide: any, index: number) => {
        const isActive = index === current;
        
        // Build link from linkType and linkTarget
        let link: string | null = null;
        if (slide.linkType === 'PRODUCT' && slide.linkTarget) {
          link = `/product/${slide.linkTarget}`;
        } else if (slide.linkType === 'CATEGORY' && slide.linkTarget) {
          link = `/category/${slide.linkTarget}`;
        } else if (slide.linkType === 'URL' && slide.linkTarget) {
          link = slide.linkTarget;
        }

        // Backend stores the image field as `image`
        const imageSrc = slide.image || '';
        
        return (
          <div 
            key={slide._id || index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0'} bg-primary-dark`}
          >
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            {imageSrc && (
              <Image 
                src={imageSrc} 
                alt={slide.title || 'Banner'}
                fill
                className="object-cover object-center"
                priority={index === 0}
                onError={(e: any) => { e.target.style.display = 'none'; }}
              />
            )}
            <div className="relative z-20 h-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-center text-white">
              <h2 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4 drop-shadow-lg leading-tight max-w-2xl">{slide.title}</h2>
              {slide.description && (
                <p className="text-white/80 text-base md:text-lg mb-4 max-w-xl drop-shadow">{slide.description}</p>
              )}
              {link && (
                <a href={link} className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-md font-bold w-max transition-colors shadow-lg mt-4 flex items-center gap-2 text-sm md:text-base">
                  Shop Now
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </a>
              )}
            </div>
          </div>
        );
      })}
      
      {/* Controls */}
      {displayBanners.length > 1 && (
        <>
          <button 
            onClick={() => setCurrent(prev => prev === 0 ? displayBanners.length - 1 : prev - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 backdrop-blur-sm transition-colors hidden md:flex items-center justify-center shadow"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button 
            onClick={() => setCurrent(prev => prev === displayBanners.length - 1 ? 0 : prev + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 backdrop-blur-sm transition-colors hidden md:flex items-center justify-center shadow"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </>
      )}

      {/* Indicators */}
      {displayBanners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {displayBanners.map((_: any, idx: number) => (
            <button 
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === current ? 'bg-primary w-6' : 'bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
