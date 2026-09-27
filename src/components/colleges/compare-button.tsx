'use client';

import { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCompareStore } from '@/store';
import { toast } from 'sonner';

interface CompareButtonProps {
  collegeId: string;
  className?: string;
  variant?: 'default' | 'ghost' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
}

export function CompareButton({ collegeId, className, variant = 'ghost', size = 'icon', children }: CompareButtonProps) {
  const { colleges, addCollege, removeCollege } = useCompareStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isSelected = colleges.includes(collegeId);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSelected) {
      removeCollege(collegeId);
      toast.success('Removed from comparison');
    } else {
      if (colleges.length >= 6) {
        toast.error('You can only compare up to 6 colleges at a time.');
      } else {
        addCollege(collegeId);
        toast.success(`Added to comparison (${colleges.length + 1}/6)`);
      }
    }
  };

  if (!mounted) return null;

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={`relative transition-all duration-300 ${className} ${isSelected ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' : 'text-gray-500 hover:text-[#bce600] hover:bg-indigo-50'}`}
      onClick={handleToggle}
      aria-label={isSelected ? 'Remove from compare' : 'Add to compare'}
    >
      <BarChart3 className={`h-4 w-4 transition-all duration-300 ${isSelected ? 'scale-110' : 'scale-100'} ${children ? 'mr-1.5' : ''}`} />
      {children}
    </Button>
  );
}
