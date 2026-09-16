import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, Star, Building, CheckCircle2, MessageSquare } from 'lucide-react';

export function ExperienceTab({ college }: { college: any }) {
  const reviews = college.reviews || [];
  const hostel = college.hostel_details?.[0]; // assuming array or just an object, we'll check length if array

  // Format currency
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Infrastructure / Facilities */}
      <Card className="border-0 shadow-sm ring-1 ring-slate-100">
        <CardHeader className="border-b border-slate-50 bg-white">
          <CardTitle className="text-xl flex items-center gap-2">
            <Building className="h-5 w-5 text-indigo-500" /> Campus Infrastructure
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {college.facilities && college.facilities.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {college.facilities.map((f: string, i: number) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-sm transition-all hover:border-indigo-100">
                  <CheckCircle2 className="h-5 w-5 text-indigo-500 shrink-0" />
                  <span className="font-medium text-slate-700 text-sm">{f}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 italic">No facility details available.</p>
          )}
        </CardContent>
      </Card>

      {/* Hostel Details */}
      {(hostel || (college.hostel_details && college.hostel_details.length > 0)) && (
        <Card className="border-0 shadow-sm ring-1 ring-slate-100">
          <CardHeader className="border-b border-slate-50 bg-white">
            <CardTitle className="text-xl flex items-center gap-2">
              <Home className="h-5 w-5 text-indigo-500" /> Hostel & Accommodation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {college.hostel_details?.map((h: any) => (
              <div key={h.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">Campus Hostel</h3>
                    {h.fees_per_year && (
                      <p className="text-indigo-600 font-bold mt-1">{formatCurrency(h.fees_per_year)} <span className="text-slate-500 font-normal text-sm">/ year</span></p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {h.room_types && h.room_types.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-2">Room Types</h4>
                      <div className="flex flex-wrap gap-2">
                        {h.room_types.map((rt: string, i: number) => (
                          <Badge key={i} variant="outline" className="bg-white">{rt}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {h.facilities && h.facilities.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-2">Hostel Facilities</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
                        {h.facilities.map((f: string, i: number) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {h.mess_menu && (
                  <div className="mt-4 bg-slate-50 p-4 rounded-xl text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">Mess Details: </span> {h.mess_menu}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Reviews Section */}
      <Card className="border-0 shadow-sm ring-1 ring-slate-100">
        <CardHeader className="border-b border-slate-50 bg-white">
          <CardTitle className="text-xl flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-indigo-500" /> Student Reviews
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((r: any) => (
                <div key={r.id} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < (r.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <span className="font-bold text-slate-900">{r.rating}/5</span>
                  </div>
                  {r.title && <h4 className="font-semibold text-slate-900 mb-1">{r.title}</h4>}
                  <p className="text-slate-600 text-sm leading-relaxed">{r.content || r.review_text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 italic text-center py-8">No reviews available yet. Be the first to review!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
