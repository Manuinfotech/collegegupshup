'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Star, MapPin, CheckCircle, Heart, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FavoriteButton } from './favorite-button';
import { CompareButton } from './compare-button';

interface CollegeCardProps {
  college: {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    cover_image_url: string | null;
    short_description: string | null;
    city_name?: string | null;
    state_name?: string | null;
    cities?: { name: string } | null;
    states?: { name: string } | null;
    ownership_type: string | null;
    established_year: number | null;
    is_featured: boolean;
    is_verified: boolean;
    average_rating?: number | null;
    review_count?: number;
    fees_range?: string | null;
    highest_package?: number | null;
    average_package?: number | null;
  };
  className?: string;
}

const getValidImageUrl = (url: string | null | undefined, fallback: string) => {
  if (!url || typeof url !== 'string' || url.trim() === '') return fallback;
  if (!url.startsWith('http') && !url.startsWith('/')) return fallback;
  return url;
};

export function CollegeCard({ college, className }: CollegeCardProps) {
  const [coverSrc, setCoverSrc] = useState(getValidImageUrl(college.cover_image_url, "/cg_banner.webp"));
  const [logoSrc, setLogoSrc] = useState(getValidImageUrl(college.logo_url, "/cg_logo.webp"));

  return (
    <Link href={`/colleges/${college.slug}`} className={cn("block h-full", className)}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-200 h-full flex flex-col">
        <CardContent className="p-0 flex-1 flex flex-col">
          {/* Cover Image */}
          <div className="relative h-40 bg-slate-900 overflow-hidden shrink-0">
            <Image
              src={coverSrc}
              alt={college.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover group-hover:scale-105 transition-transform duration-300 ${!college.cover_image_url ? 'opacity-60' : ''}`}
              onError={() => setCoverSrc("/cg_banner.webp")}
            />
            {college.is_featured && (
              <Badge className="absolute top-3 left-3 bg-amber-500 text-white z-10">Featured</Badge>
            )}
            <div className="absolute top-3 right-3 flex gap-1 z-10">
              <FavoriteButton collegeId={college.id} variant="secondary" className="h-8 w-8 bg-white/90 hover:bg-white text-gray-500" />
              <CompareButton collegeId={college.id} variant="secondary" className="h-8 w-8 bg-white/90 hover:bg-white text-gray-500" />
            </div>
          </div>

          {/* Content */}
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex items-start gap-3">
              {/* Logo */}
              <div className="h-12 w-12 shrink-0 rounded-lg border bg-white overflow-hidden flex items-center justify-center p-1 relative">
                <Image 
                  src={logoSrc} 
                  alt={college.name} 
                  fill
                  sizes="48px"
                  className="object-contain p-1" 
                  onError={() => setLogoSrc("/cg_logo.webp")}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                  {college.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {(college.city_name || college.cities?.name) && (
                    <span className="flex items-center text-xs text-gray-500">
                      <MapPin className="h-3 w-3 mr-0.5" />
                      {college.city_name || college.cities?.name}
                      {(college.state_name || college.states?.name) ? `, ${college.state_name || college.states?.name}` : ''}
                    </span>
                  )}
                  {college.is_verified && (
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t mt-auto">
              <div>
                <p className="text-xs text-gray-500">Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-semibold">
                    {college.average_rating ? college.average_rating.toFixed(1) : 'N/A'}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Fees</p>
                <p className="text-sm font-semibold text-gray-800">
                  {college.fees_range || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Avg Pkg</p>
                <p className="text-sm font-semibold text-gray-800">
                  {college.average_package
                    ? `${(college.average_package / 100000).toFixed(1)}L`
                    : 'N/A'}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex gap-2 mt-3 flex-wrap">
              {college.ownership_type && (
                <Badge variant="secondary" className="text-xs capitalize">
                  {college.ownership_type}
                </Badge>
              )}
              {college.established_year && (
                <Badge variant="secondary" className="text-xs">
                  Est. {college.established_year}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
