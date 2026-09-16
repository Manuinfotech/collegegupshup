import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, TrendingUp } from 'lucide-react';

export function CareerTab({ college }: { college: any }) {
  const placements = college.placements || [];

  // Format currency
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="border-0 shadow-sm ring-1 ring-slate-100">
        <CardHeader className="border-b border-slate-50 bg-white">
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-500" /> Placement Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {placements.length > 0 ? (
            <div className="space-y-8">
              {placements.map((p: any) => (
                <div key={p.id} className="space-y-6 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-slate-900 border-l-4 border-indigo-500 pl-3">Batch {p.year}</h3>
                    {p.company_visited && (
                      <span className="text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
                        {p.company_visited} Companies Visited
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-2">Highest Package</p>
                      <p className="text-3xl font-black text-emerald-900">{formatCurrency(p.highest_package || 0)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-sm font-bold text-indigo-700 uppercase tracking-wider mb-2">Average Package</p>
                      <p className="text-3xl font-black text-indigo-900">{formatCurrency(p.average_package || 0)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-sm font-bold text-purple-700 uppercase tracking-wider mb-2">Placement Rate</p>
                      <p className="text-3xl font-black text-purple-900">{p.placement_percentage || 0}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">
              <Briefcase className="h-12 w-12 mx-auto text-slate-300 mb-4" />
              <p className="text-lg font-medium text-slate-900 mb-1">No placement data</p>
              <p>Placement statistics and top recruiters will be updated soon.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Additional career sections could be added here in the future:
          - Top Recruiters
          - Internship Opportunities
          - Alumni Network
      */}
    </div>
  );
}
