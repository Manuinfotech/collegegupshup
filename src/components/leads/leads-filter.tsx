'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useTransition, useState, useEffect, useRef } from 'react';

export function LeadsFilter({ colleges = [], showCollegeFilter = false }: { colleges?: { id: string, name: string }[], showCollegeFilter?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const currentQ = searchParams.get('q') || '';
      if (query !== currentQ) {
        updateFilters('q', query);
      }
    }, 500);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query]);

  return (
    <Card className="border-0 shadow-sm shadow-slate-200/50 mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 ${isPending ? 'animate-pulse text-indigo-400' : ''}`} />
            <Input 
              placeholder="Search by name, email, or phone..." 
              className="pl-9 border-slate-200 focus-visible:ring-indigo-500" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {showCollegeFilter && (
            <select 
              className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white text-slate-700 outline-none focus:border-indigo-500 transition-all"
              value={searchParams.get('college') || ''}
              onChange={(e) => updateFilters('college', e.target.value)}
            >
              <option value="">All Colleges</option>
              {colleges.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
          <select 
            className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white text-slate-700 outline-none focus:border-indigo-500 transition-all"
            value={searchParams.get('source') || ''}
            onChange={(e) => updateFilters('source', e.target.value)}
          >
            <option value="">All Sources</option>
            <option value="direct">Direct Apply</option>
            <option value="brochure">Brochure Download</option>
            <option value="contact">Contact Form</option>
          </select>
          <select 
            className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white text-slate-700 outline-none focus:border-indigo-500 transition-all"
            value={searchParams.get('status') || ''}
            onChange={(e) => updateFilters('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
}
