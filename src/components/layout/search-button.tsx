'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlobalSearch } from './global-search';

export function SearchButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-gray-500 hover:text-[#bce600] hover:bg-indigo-50/80"
        onClick={() => setOpen(true)}
      >
        <Search className="h-[18px] w-[18px]" />
      </Button>
      <GlobalSearch open={open} setOpen={setOpen} />
    </>
  );
}
