'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface Slide {
  id: number;
  title: string;
  description: string;
  buttonText?: string;
  buttonIcon?: any;
  buttonLink?: string;
  icon: any;
  accentColor: string;
  bgColor?: string;
}

export function DashboardCarousel({ slides }: { slides: Slide[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];
  const Icon = slide.icon;
  const ButtonIcon = slide.buttonIcon;
  const accentBg = slide.bgColor || slide.accentColor.replace('text-', 'bg-');

  return (
    <div className="bg-gradient-to-r from-[#F0F4F8] to-white border border-gray-200 rounded-xl overflow-hidden flex flex-col md:flex-row relative">
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10 text-gray-400">
        <span className="text-xs font-medium mr-1">{currentSlide + 1} / {slides.length}</span>
        <button onClick={prevSlide} className="hover:text-gray-900 transition-colors p-1"><ChevronLeft className="h-4 w-4" /></button>
        <button onClick={nextSlide} className="hover:text-gray-900 transition-colors p-1"><ChevronRight className="h-4 w-4" /></button>
      </div>

      <div className="w-full md:w-[45%] bg-[#F4F7FB] min-h-[280px] flex items-center justify-center p-8 relative overflow-hidden transition-colors duration-500">
        <div className="relative w-48 h-40 animate-in zoom-in duration-500" key={slide.id}>
          <div className="absolute top-0 left-4 w-24 h-24 bg-white/80 backdrop-blur-md rounded-2xl border-2 border-white shadow-lg transform -rotate-6 flex items-center justify-center transition-transform hover:-rotate-12 duration-500">
            <Icon className={cn("h-10 w-10 opacity-60", slide.accentColor)} />
          </div>
          <div className="absolute top-4 right-0 w-24 h-24 bg-white/80 backdrop-blur-md rounded-2xl border-2 border-white shadow-lg transform rotate-12 flex items-center justify-center transition-transform hover:rotate-6 duration-500">
            <Icon className={cn("h-10 w-10 opacity-60", slide.accentColor)} />
          </div>
          <div className="absolute bottom-0 left-10 w-28 h-28 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-white shadow-xl transform z-10 flex items-center justify-center transition-transform hover:scale-105 duration-500">
            <Icon className={cn("h-12 w-12", slide.accentColor)} />
          </div>
          <div className={cn("absolute bottom-[-10px] left-20 w-8 h-4 rounded-sm z-20 shadow-sm transition-colors duration-500", accentBg)} />
        </div>
      </div>
      
      <div className="w-full md:w-[55%] p-10 flex flex-col justify-center bg-white relative min-h-[280px]">
        <div key={`text-${slide.id}`} className="animate-in fade-in slide-in-from-right-4 duration-500">
          <h2 className="font-semibold text-[28px] tracking-tight text-gray-900 leading-tight mb-4">
            {slide.title}
          </h2>
          <p className="text-[15px] text-gray-500 leading-relaxed mb-8 max-w-md min-h-[44px]">
            {slide.description}
          </p>
          <div className="flex items-center gap-4 h-10">
            {slide.buttonText && (
              slide.buttonLink ? (
                <Link href={slide.buttonLink}>
                  <Button className="rounded-full px-6 h-10 font-medium shadow-sm transition-transform hover:-translate-y-0.5">
                    {ButtonIcon && <ButtonIcon className="h-4 w-4 mr-2" />} {slide.buttonText}
                  </Button>
                </Link>
              ) : (
                <Button className="rounded-full px-6 h-10 font-medium shadow-sm transition-transform hover:-translate-y-0.5">
                  {ButtonIcon && <ButtonIcon className="h-4 w-4 mr-2" />} {slide.buttonText}
                </Button>
              )
            )}
          </div>
        </div>
        
        {/* Carousel dots */}
        <div className="flex items-center gap-1.5 mt-10">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                currentSlide === idx ? "w-6 bg-indigo-600" : "w-1.5 bg-gray-300 hover:bg-gray-400"
              )} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
