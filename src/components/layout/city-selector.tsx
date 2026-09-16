'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const topCities = [
  { name: 'Mumbai', emoji: '🏙️' },
  { name: 'Pune', emoji: '📚' },
  { name: 'Bangalore', emoji: '💻' },
  { name: 'Delhi', emoji: '🏛️' },
  { name: 'Chennai', emoji: '🎓' },
  { name: 'Hyderabad', emoji: '🌆' },
];

export function CitySelector({ mobile = false }: { mobile?: boolean }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const cityParam = searchParams.get('city');
    if (cityParam) {
      setSelectedCity(cityParam);
      document.cookie = `selected_city=${cityParam}; path=/; max-age=31536000`;
    } else {
      // try to read from cookie
      const cookies = document.cookie.split(';');
      const cityCookie = cookies.find(c => c.trim().startsWith('selected_city='));
      if (cityCookie) {
        setSelectedCity(cityCookie.split('=')[1].trim());
      }
    }
  }, [searchParams]);

  const handleCitySelect = (cityName: string) => {
    const cityLower = cityName.toLowerCase();
    setSelectedCity(cityLower);
    document.cookie = `selected_city=${cityLower}; path=/; max-age=31536000`;
    setIsOpen(false);
    
    // If we are already on a listings page, update the URL while preserving other filters
    const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
    currentParams.set('city', cityLower);
    
    if (pathname === '/colleges' || pathname === '/courses') {
      router.push(`${pathname}?${currentParams.toString()}`);
    } else {
      router.push(`/colleges?city=${cityLower}`);
    }
  };

  const displayCity = selectedCity 
    ? topCities.find(c => c.name.toLowerCase() === selectedCity.toLowerCase())?.name || selectedCity 
    : 'Select City';

  if (mobile) {
    return (
      <div className="mb-4 pb-4 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Select City</p>
        <div className="grid grid-cols-2 gap-2 px-3">
          {topCities.map(city => (
            <Button 
              key={city.name} 
              variant={selectedCity?.toLowerCase() === city.name.toLowerCase() ? 'default' : 'outline'} 
              size="sm" 
              className={`w-full justify-start font-normal ${selectedCity?.toLowerCase() === city.name.toLowerCase() ? 'bg-indigo-600 text-white' : ''}`}
              onClick={() => handleCitySelect(city.name)}
            >
              <span className="mr-2">{city.emoji}</span>
              {city.name}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger render={<Button variant="ghost" size="sm" className="text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/80 capitalize" />}>
          <MapPin className="h-4 w-4 mr-1.5 text-indigo-500" />
          {displayCity}
          <ChevronDown className="h-3 w-3 ml-1" />
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-3">Top Cities</h4>
            <div className="grid grid-cols-2 gap-2">
              {topCities.map(city => (
                <Button 
                  key={city.name} 
                  variant={selectedCity?.toLowerCase() === city.name.toLowerCase() ? 'default' : 'outline'} 
                  className={`w-full justify-start font-normal ${selectedCity?.toLowerCase() === city.name.toLowerCase() ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'text-gray-600 hover:text-indigo-600 hover:border-indigo-200'}`}
                  onClick={() => handleCitySelect(city.name)}
                >
                  <span className="mr-2 text-lg">{city.emoji}</span>
                  {city.name}
                </Button>
              ))}
            </div>
          </div>
          <Button className="w-full text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-0" variant="outline">
            View All Cities
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
