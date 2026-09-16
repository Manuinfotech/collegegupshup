import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IndianRupee, Award, Trophy, Scale } from 'lucide-react';
import Link from 'next/link';

export function DecisionTab({ college }: { college: any }) {
  const fees = college.fees || [];
  const scholarships = college.scholarships || [];
  const rankings = college.rankings || [];

  // Format currency
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Fees Section */}
      <Card className="border-0 shadow-sm ring-1 ring-slate-100">
        <CardHeader className="border-b border-slate-50 bg-white">
          <CardTitle className="text-xl flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-indigo-500" /> Fee Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {fees.length > 0 ? (
              fees.map((fee: any) => (
                <div key={fee.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {(fee.courses as any)?.name || 'Unknown Course'}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <Badge variant="outline" className="text-slate-600 font-medium">{(fee.courses as any)?.level || 'Degree'}</Badge>
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-2xl font-extrabold text-indigo-600">{formatCurrency(fee.total_fee || fee.tuition_fee || 0)}</p>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">First Year Fee</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-500">
                <IndianRupee className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                <p className="text-lg font-medium text-slate-900 mb-1">No fee data available</p>
                <p>Fee structures will be updated soon.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Scholarships Section */}
      <Card className="border-0 shadow-sm ring-1 ring-slate-100">
        <CardHeader className="border-b border-slate-50 bg-white">
          <CardTitle className="text-xl flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-500" /> Scholarships
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {scholarships.length > 0 ? (
            <div className="space-y-4">
              {scholarships.map((sch: any) => (
                <div key={sch.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <div className="flex flex-col sm:flex-row justify-between gap-2 mb-2">
                    <h4 className="font-bold text-slate-900 text-lg">{sch.name}</h4>
                    {sch.amount && (
                      <span className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-sm w-max">
                        {formatCurrency(sch.amount)}
                      </span>
                    )}
                  </div>
                  {sch.type && <Badge className="mb-2" variant="outline">{sch.type}</Badge>}
                  {sch.description && <p className="text-sm text-slate-600 mb-2">{sch.description}</p>}
                  {sch.eligibility && (
                    <p className="text-xs text-slate-500">
                      <strong className="text-slate-700">Eligibility:</strong> {sch.eligibility}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 italic text-center py-8">No scholarship information is currently available.</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rankings */}
        <Card className="border-0 shadow-sm ring-1 ring-slate-100">
          <CardHeader className="border-b border-slate-50 bg-white">
            <CardTitle className="text-xl flex items-center gap-2">
              <Trophy className="h-5 w-5 text-indigo-500" /> Rankings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {rankings.length > 0 ? (
              <ul className="space-y-4">
                {rankings.map((r: any) => (
                  <li key={r.id} className="flex items-center justify-between pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                    <div>
                      <span className="font-bold text-slate-900 block">{r.agency}</span>
                      {r.category && <span className="text-xs text-slate-500">{r.category}</span>}
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-amber-500">#{r.rank}</span>
                      <span className="block text-xs font-semibold text-slate-400 mt-0.5">{r.year}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 italic text-center py-4">No rankings available.</p>
            )}
          </CardContent>
        </Card>

        {/* Compare Colleges CTA */}
        <Card className="border-0 shadow-sm ring-1 ring-slate-100 bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 bg-white opacity-5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 p-12 bg-white opacity-5 rounded-full blur-3xl" />
          
          <CardContent className="p-8 relative z-10 flex flex-col h-full justify-center text-center">
            <div className="mx-auto bg-white/20 p-3 rounded-full mb-4">
              <Scale className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Compare Colleges</h3>
            <p className="text-indigo-100 mb-6 text-sm">
              Not sure yet? Compare {college.name} with other top institutions to make an informed decision.
            </p>
            <Link href={`/compare?college1=${college.slug}`} className="w-full">
              <Button className="w-full bg-white text-indigo-600 hover:bg-slate-50 rounded-xl font-bold h-12">
                Start Comparison
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
