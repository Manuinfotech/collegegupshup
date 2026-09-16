'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Award, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2000&auto=format&fit=crop',
    title: 'Indian Institute of Management (IIM) Ahmedabad',
    location: 'Ahmedabad, Gujarat',
    tag: 'Premium Partner',
    caption: 'Ranked #1 for Management in India. Transform your career with world-class faculty.'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2000&auto=format&fit=crop',
    title: 'Indian Institute of Technology (IIT) Bombay',
    location: 'Mumbai, Maharashtra',
    tag: 'Featured Institution',
    caption: 'Pioneering technology and research. Join the brightest minds.'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2000&auto=format&fit=crop',
    title: 'BITS Pilani',
    location: 'Pilani, Rajasthan',
    tag: 'Top Rated',
    caption: 'Excellence in engineering and sciences. A legacy of innovation.'
  }
];

export function HeroSlider({ children }: { children?: React.ReactNode }) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const next = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);
  const prev = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);

  return (
    <div 
      className="relative w-full h-[450px] md:h-[550px] bg-gray-900 group z-40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides Container */}
      <div className="absolute inset-0 overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${slide.image})`,
              transform: index === current ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 7s ease-out' 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
          <div className="absolute inset-0 bg-indigo-900/20 mix-blend-multiply" />

          {/* Slide Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 pt-20 pb-32">
            <div className="max-w-4xl mx-auto flex flex-col items-center">
              <Badge className="bg-amber-500/90 hover:bg-amber-500 text-white border-none mb-6 px-4 py-1.5 text-sm uppercase tracking-wider backdrop-blur-md shadow-lg">
                <Award className="w-4 h-4 mr-2 inline" /> {slide.tag}
              </Badge>
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-4 drop-shadow-xl font-heading">
                {slide.title}
              </h1>
              <div className="flex items-center text-indigo-200 mb-6 text-lg">
                <MapPin className="w-5 h-5 mr-2" />
                {slide.location}
              </div>
              <p className="text-lg md:text-2xl text-white/90 max-w-2xl font-light drop-shadow-md">
                {slide.caption}
              </p>
            </div>
          </div>
        </div>
      ))}

      </div>

      {/* Children Container (For the Search Bar, floating above slides) */}
      <div className="absolute bottom-20 md:bottom-24 left-0 right-0 z-50 px-4">
        <div className="max-w-4xl mx-auto relative">
          {children}
        </div>
      </div>

      {/* Navigation Controls - Centered */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
        <button 
          onClick={prev}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110 pointer-events-auto shadow-lg ml-2 md:ml-8"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button 
          onClick={next}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110 pointer-events-auto shadow-lg mr-2 md:mr-8"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      
      {/* Dots Indicator */}
      <div className="absolute bottom-16 md:bottom-16 left-0 right-0 z-40 flex justify-center gap-2 pointer-events-none">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all pointer-events-auto ${
              current === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
