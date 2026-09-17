'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export function CollegeSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort') || 'relevance';

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    params.delete('page'); // Reset page when sorting changes
    router.push(pathname + '?' + params.toString());
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Sort by:</span>
      <select 
        className="text-sm border rounded-md px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={currentSort}
        onChange={handleSortChange}
      >
        <option value="relevance">Relevance</option>
        <option value="rating">Rating</option>
        <option value="fees_low">Fees: Low to High</option>
        <option value="fees_high">Fees: High to Low</option>
      </select>
    </div>
  );
}
