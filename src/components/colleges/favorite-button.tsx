'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSavedCollegesStore } from '@/store';
import { toggleFavorite } from '@/lib/actions/wishlist';
import { toast } from 'sonner';
import { useAuthStore } from '@/store';

interface FavoriteButtonProps {
  collegeId: string;
  className?: string;
  variant?: 'default' | 'ghost' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
}

export function FavoriteButton({ collegeId, className, variant = 'ghost', size = 'icon', children }: FavoriteButtonProps) {
  const { isSaved, toggle } = useSavedCollegesStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const saved = isSaved(collegeId);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic UI update
    toggle(collegeId);

    // If logged in, sync with database
    if (user) {
      setLoading(true);
      try {
        const res = await toggleFavorite(collegeId);
        if (res.error) {
          toast.error(res.error);
          toggle(collegeId);
        } else {
          toast.success(res.isSaved ? 'Added to wishlist' : 'Removed from wishlist');
        }
      } catch (err) {
        toast.error('Network error. Please try again.');
        toggle(collegeId);
      } finally {
        setLoading(false);
      }
    } else {
      toast.success(saved ? 'Removed from saved colleges' : 'Saved to browser! Log in to sync.');
    }
  };

  if (!mounted) return null;

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={`relative transition-all duration-300 ${className} ${saved ? 'text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100' : 'text-gray-500 hover:text-rose-500 hover:bg-rose-50'}`}
      onClick={handleToggle}
      disabled={loading}
      aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart className={`h-4 w-4 transition-all duration-300 ${saved ? 'fill-current scale-110' : 'scale-100'} ${children ? 'mr-1.5' : ''}`} />
      {children}
    </Button>
  );
}
