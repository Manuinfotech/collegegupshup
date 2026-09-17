'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, GraduationCap, Building2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchResult {
  type: 'college' | 'course';
  id: string;
  name: string;
  slug: string;
  subtitle?: string;
}

export function HomepageSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchResults = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.data || []);
      setIsOpen(true);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setActiveIndex(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchResults(value), 300);
  };

  const navigateToResult = (result: SearchResult) => {
    setIsOpen(false);
    setQuery(result.name);
    if (result.type === 'college') {
      router.push(`/${result.slug}`);
    } else {
      router.push(`/colleges?goal=${result.slug}`);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/colleges?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (activeIndex >= 0 && activeIndex < results.length) {
        navigateToResult(results[activeIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-2 shadow-2xl shadow-indigo-900/20 max-w-2xl mx-auto border border-white/50 relative">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            placeholder="Search colleges, courses, exams..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-transparent text-[15px]"
          />
          {isLoading && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500 animate-spin" />
          )}
        </div>
        <Button
          size="lg"
          onClick={handleSearch}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-8 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300"
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="max-h-[320px] overflow-y-auto">
            {results.map((result, index) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => navigateToResult(result)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-indigo-50/80 transition-colors border-b border-gray-50 last:border-0 ${
                  index === activeIndex ? 'bg-indigo-50/80' : ''
                }`}
              >
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  result.type === 'college'
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {result.type === 'college' ? (
                    <Building2 className="h-4 w-4" />
                  ) : (
                    <GraduationCap className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{result.name}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {result.subtitle && <span>{result.subtitle} · </span>}
                    <span className="capitalize">{result.type}</span>
                  </p>
                </div>
              </button>
            ))}
          </div>
          <div className="bg-gray-50/80 px-4 py-2 border-t border-gray-100">
            <button
              onClick={handleSearch}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              See all results for &ldquo;{query}&rdquo; →
            </button>
          </div>
        </div>
      )}

      {/* No results state */}
      {isOpen && query.length >= 2 && results.length === 0 && !isLoading && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="px-4 py-6 text-center">
            <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No colleges or courses found for &ldquo;{query}&rdquo;</p>
            <button
              onClick={handleSearch}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-2"
            >
              Browse all colleges →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
