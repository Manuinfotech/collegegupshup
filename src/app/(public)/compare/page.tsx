'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCompareStore } from '@/store';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Trash2, CheckCircle2, ArrowRight } from 'lucide-react';
import { CollegeCard } from '@/components/colleges/college-card';

export default function ComparePage() {
  const { colleges, removeCollege, clearAll } = useCompareStore();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchColleges() {
      if (colleges.length === 0) {
        setData([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      const { data: result } = await supabase
        .from('colleges')
        .select(`
          id,
          name,
          slug,
          logo_url,
          cover_image_url,
          short_description,
          established_year,
          ownership_type,
          college_type,
          average_rating,
          review_count,
          cities(name),
          states(name),
          fees(tuition_fee, courses(name, degree_type)),
          placements(highest_package, average_package)
        `)
        .in('id', colleges);
        
      if (result) {
        // Sort according to store order
        const sorted = result.sort((a: any, b: any) => colleges.indexOf(a.id) - colleges.indexOf(b.id));
        setData(sorted);
      }
      setLoading(false);
    }
    
    fetchColleges();
  }, [colleges, supabase]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
        <h2 className="text-xl font-medium text-slate-700">Loading your comparison...</h2>
      </div>
    );
  }

  if (colleges.length === 0 || data.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-[70vh]">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">Compare Colleges</h1>
        <p className="text-slate-500 mb-8 text-center max-w-lg mx-auto">
          Compare up to 6 colleges side-by-side to make the best decision for your education.
        </p>
        <Card className="max-w-2xl mx-auto border-dashed border-2">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No colleges selected</h3>
            <p className="text-slate-500 mb-8">
              Browse our directory and click the "Compare" button on up to 6 colleges to view them side-by-side here.
            </p>
            <Link href="/colleges">
              <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-full px-8">
                Browse Colleges <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Determine grid layout based on number of colleges
  const getGridCols = () => {
    switch(data.length) {
      case 1: return 'grid-cols-1 md:grid-cols-2'; // 1 college, show it + empty slot
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      case 5: return 'grid-cols-1 md:grid-cols-3 lg:grid-cols-3'; // 3 top, 2 bottom
      case 6: return 'grid-cols-1 md:grid-cols-3 lg:grid-cols-3'; // 3 top, 3 bottom
      default: return 'grid-cols-1 md:grid-cols-3';
    }
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-8 mb-8 sticky top-[60px] z-20 shadow-sm">
        <div className="container mx-auto px-4 max-w-[1600px] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Compare Colleges</h1>
            <p className="text-slate-500 mt-1">Comparing {data.length} of 6 maximum colleges</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200" onClick={clearAll}>
              <Trash2 className="h-4 w-4 mr-2" /> Clear All
            </Button>
            {data.length < 6 && (
              <Link href="/colleges">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  + Add College
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-[1600px]">
        {/* Responsive Grid for Cards */}
        <div className={`grid ${getGridCols()} gap-6 mb-12`}>
          {data.map((c) => (
            <div key={c.id} className="relative">
              <Button 
                variant="secondary" 
                size="icon" 
                className="absolute -top-3 -right-3 z-30 h-8 w-8 rounded-full bg-white shadow-md hover:bg-rose-50 hover:text-rose-600 border border-slate-200"
                onClick={() => removeCollege(c.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <CollegeCard 
                college={{
                  ...c,
                  city_name: c.cities?.name,
                  state_name: c.states?.name
                }} 
                className="h-full" 
              />
            </div>
          ))}
          {data.length < 2 && (
            <Link href="/colleges" className="block">
              <Card className="h-full min-h-[380px] border-dashed border-2 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-3xl font-light text-indigo-400">+</span>
                </div>
                <h3 className="text-lg font-medium text-slate-700">Add another college</h3>
                <p className="text-sm text-slate-400">Click to browse directory</p>
              </Card>
            </Link>
          )}
        </div>

        {/* Comparison Data Table (Horizontal scrolling on small screens) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <tbody>
                {/* Established Year */}
                <tr className="border-b border-slate-100">
                  <th className="py-4 px-6 bg-slate-50 font-medium text-slate-500 w-48 shrink-0">Established In</th>
                  {data.map(c => (
                    <td key={c.id} className="py-4 px-6 border-l border-slate-100 font-medium text-slate-800">
                      {c.established_year || 'N/A'}
                    </td>
                  ))}
                </tr>
                {/* Ownership */}
                <tr className="border-b border-slate-100">
                  <th className="py-4 px-6 bg-slate-50 font-medium text-slate-500">Ownership Type</th>
                  {data.map(c => (
                    <td key={c.id} className="py-4 px-6 border-l border-slate-100 capitalize">
                      {c.ownership_type?.replace('_', ' ') || 'N/A'}
                    </td>
                  ))}
                </tr>
                {/* College Type */}
                <tr className="border-b border-slate-100">
                  <th className="py-4 px-6 bg-slate-50 font-medium text-slate-500">College Type</th>
                  {data.map(c => (
                    <td key={c.id} className="py-4 px-6 border-l border-slate-100 capitalize">
                      {c.college_type?.replace('_', ' ') || 'N/A'}
                    </td>
                  ))}
                </tr>
                {/* Highest Package */}
                <tr className="border-b border-slate-100">
                  <th className="py-4 px-6 bg-slate-50 font-medium text-slate-500">Highest Package</th>
                  {data.map(c => {
                    const maxPkg = c.placements?.length ? Math.max(...c.placements.map((p:any) => p.highest_package || 0)) : 0;
                    return (
                      <td key={c.id} className="py-4 px-6 border-l border-slate-100 font-semibold text-emerald-600">
                        {maxPkg > 0 ? `₹${(maxPkg / 100000).toFixed(1)} LPA` : 'N/A'}
                      </td>
                    );
                  })}
                </tr>
                {/* Average Package */}
                <tr className="border-b border-slate-100">
                  <th className="py-4 px-6 bg-slate-50 font-medium text-slate-500">Average Package</th>
                  {data.map(c => {
                    const avgPkg = c.placements?.length ? Math.max(...c.placements.map((p:any) => p.average_package || 0)) : 0;
                    return (
                      <td key={c.id} className="py-4 px-6 border-l border-slate-100 text-slate-700">
                        {avgPkg > 0 ? `₹${(avgPkg / 100000).toFixed(1)} LPA` : 'N/A'}
                      </td>
                    );
                  })}
                </tr>
                {/* Action Row */}
                <tr>
                  <th className="py-6 px-6 bg-slate-50"></th>
                  {data.map(c => (
                    <td key={c.id} className="py-6 px-6 border-l border-slate-100">
                      <Link href={`/colleges/${c.slug}`}>
                        <Button className="w-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 shadow-none">
                          View Details
                        </Button>
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
