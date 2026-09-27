'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export function AuditLogsFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('q', value);
    } else {
      params.delete('q');
    }
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleActionChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('action', value);
    } else {
      params.delete('action');
    }
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isPending ? 'text-indigo-400 animate-pulse' : 'text-slate-400'}`} />
        <Input 
          placeholder="Search by action or entity..." 
          className="pl-9 border-slate-200 focus-visible:ring-indigo-500" 
          defaultValue={searchParams.get('q') || ''}
          onChange={(e) => {
            const val = e.target.value;
            // Debounce
            const timeoutId = setTimeout(() => handleSearch(val), 300);
            return () => clearTimeout(timeoutId);
          }}
        />
      </div>
      <select 
        className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        defaultValue={searchParams.get('action') || ''}
        onChange={(e) => handleActionChange(e.target.value)}
      >
        <option value="">All Actions</option>
        <option value="create">Create</option>
        <option value="update">Update</option>
        <option value="delete">Delete</option>
      </select>
    </div>
  );
}
