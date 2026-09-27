'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Building2, BookOpen, Loader2, IndianRupee, Award } from 'lucide-react';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useDebounce } from '@/hooks/use-debounce';
import Image from 'next/image';

export function GlobalSearch({ open, setOpen }: { open: boolean, setOpen: (o: boolean) => void }) {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const debouncedQuery = useDebounce(query, 300);

  React.useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    async function fetchResults() {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        const json = await res.json();
        setResults(json.data || []);
      } catch (e) {
        console.error('Search failed', e);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [debouncedQuery]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setOpen]);

  const handleSelect = (result: any) => {
    setOpen(false);
    if (result.type === 'college') {
      router.push(`/colleges/${result.slug}`);
    } else if (result.type === 'course') {
      router.push(`/colleges?course=${result.slug}`);
    }
  };

  const colleges = results.filter(r => r.type === 'college');
  const courses = results.filter(r => r.type === 'course');

  return (
    <CommandDialog open={open} onOpenChange={setOpen} className="sm:max-w-2xl">
      <CommandInput 
        placeholder="Search for colleges, courses, or cities..." 
        value={query}
        onValueChange={setQuery}
        className="h-14 text-base"
      />
      <CommandList className="max-h-[60vh]">
        <CommandEmpty className="py-12 text-center text-slate-500">
          {loading ? (
            <div className="flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" /> 
              <p>Searching directory...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3">
              <Search className="w-8 h-8 text-slate-300" />
              <p>No results found for "{query}".</p>
            </div>
          )}
        </CommandEmpty>
        
        {colleges.length > 0 && (
          <CommandGroup heading="Colleges">
            {colleges.map((item) => (
              <CommandItem
                key={`college-${item.id}`}
                value={`${item.name} ${item.subtitle}`}
                onSelect={() => handleSelect(item)}
                className="flex items-center gap-4 p-3 cursor-pointer rounded-xl my-1 border border-transparent hover:border-slate-100 data-[selected=true]:border-slate-200 data-[selected=true]:bg-slate-50 transition-all"
              >
                <div className="h-14 w-14 shrink-0 rounded-lg border border-slate-100 bg-white p-1 shadow-sm overflow-hidden flex items-center justify-center relative">
                  {item.logo_url ? (
                    <Image 
                      src={item.logo_url} 
                      alt={item.name} 
                      fill
                      sizes="56px"
                      className="object-contain p-1"
                      unoptimized={!item.logo_url?.startsWith('http')}
                    />
                  ) : (
                    <Building2 className="h-6 w-6 text-slate-300" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 truncate">{item.name}</div>
                  
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span className="truncate max-w-[150px]">{item.subtitle || 'India'}</span>
                    </div>
                    
                    {item.college_type && (
                      <div className="flex items-center gap-1.5 shrink-0 hidden sm:flex">
                        <Award className="h-3 w-3 text-slate-400" />
                        <span className="capitalize">{item.college_type.replace('_', ' ')}</span>
                      </div>
                    )}
                    
                    {item.fee && (
                      <div className="flex items-center gap-1.5 shrink-0 hidden sm:flex">
                        <IndianRupee className="h-3 w-3 text-slate-400" />
                        <span>₹{(item.fee / 100000).toFixed(1)}L / yr</span>
                      </div>
                    )}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {courses.length > 0 && (
          <CommandGroup heading="Courses & Streams" className="border-t border-slate-100 mt-2 pt-2">
            {courses.map((item) => (
              <CommandItem
                key={`course-${item.id}`}
                value={`${item.name} ${item.subtitle}`}
                onSelect={() => handleSelect(item)}
                className="flex items-center gap-3 p-3 cursor-pointer rounded-lg my-1"
              >
                <div className="h-10 w-10 shrink-0 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-500">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">{item.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{item.subtitle}</div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
