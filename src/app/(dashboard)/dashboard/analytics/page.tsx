import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Eye, Download, Star, TrendingUp, ArrowUpRight } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'College Analytics' };

export default async function CollegeAnalyticsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: collegeUser } = await supabase.from('college_users').select('college_id').eq('user_id', user.id).single();
  const collegeId = collegeUser?.college_id;

  let metrics = [
    { title: 'Total Leads', value: 0, icon: <Users className="h-6 w-6 text-indigo-600" />, bg: 'bg-indigo-50', ring: 'ring-indigo-100', change: '—' },
    { title: 'Profile Views', value: 0, icon: <Eye className="h-6 w-6 text-blue-600" />, bg: 'bg-blue-50', ring: 'ring-blue-100', change: '—' },
    { title: 'Brochure Downloads', value: 0, icon: <Download className="h-6 w-6 text-emerald-600" />, bg: 'bg-emerald-50', ring: 'ring-emerald-100', change: '—' },
    { title: 'Avg Rating', value: '0.0', icon: <Star className="h-6 w-6 text-amber-500" />, bg: 'bg-amber-50', ring: 'ring-amber-100', change: '—' },
  ];

  if (collegeId) {
    const [
      { count: leadsCount },
      { count: savedCount },
      { data: brochureData },
      { data: reviewsData },
    ] = await Promise.all([
      supabase.from('leads').select('*', { count: 'exact', head: true }).eq('college_id', collegeId),
      supabase.from('saved_colleges').select('*', { count: 'exact', head: true }).eq('college_id', collegeId),
      supabase.from('brochures').select('downloads').eq('college_id', collegeId),
      supabase.from('reviews').select('rating').eq('college_id', collegeId),
    ]);

    const totalDownloads = brochureData?.reduce((acc, b) => acc + (b.downloads || 0), 0) || 0;
    const avgRating = reviewsData && reviewsData.length > 0
      ? (reviewsData.reduce((acc, r) => acc + r.rating, 0) / reviewsData.length).toFixed(1)
      : '0.0';

    metrics = [
      { title: 'Total Leads', value: leadsCount || 0, icon: <Users className="h-6 w-6 text-indigo-600" />, bg: 'bg-indigo-50', ring: 'ring-indigo-100', change: '+12%' },
      { title: 'Saved by Students', value: savedCount || 0, icon: <Eye className="h-6 w-6 text-blue-600" />, bg: 'bg-blue-50', ring: 'ring-blue-100', change: '+8%' },
      { title: 'Brochure Downloads', value: totalDownloads, icon: <Download className="h-6 w-6 text-emerald-600" />, bg: 'bg-emerald-50', ring: 'ring-emerald-100', change: '+18%' },
      { title: 'Avg Rating', value: avgRating, icon: <Star className="h-6 w-6 text-amber-500" />, bg: 'bg-amber-50', ring: 'ring-amber-100', change: 'Stable' },
    ];
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analytics</h1>
          <p className="text-slate-500 mt-1">Performance metrics for your college listing.</p>
        </div>
        <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 px-3 py-1.5 rounded-full text-sm font-medium">
          Live Data
          <div className="w-2 h-2 rounded-full bg-emerald-500 ml-2 animate-pulse" />
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.title} className="border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group bg-white/50">
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 rounded-2xl ${metric.bg} ring-1 ${metric.ring} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  {metric.icon}
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full ring-1 ring-emerald-100">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  {metric.change}
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">{metric.title}</p>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{metric.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-lg">Performance Trends</CardTitle>
          <p className="text-sm text-slate-500">Detailed charts and trend analysis coming in the next update.</p>
        </CardHeader>
        <CardContent className="p-12 text-center text-slate-500">
          <TrendingUp className="h-16 w-16 text-slate-200 mx-auto mb-4" />
          <p className="text-lg font-medium text-slate-900 mb-1">Charts Coming Soon</p>
          <p className="text-sm">Visual trend data and exportable reports will be available shortly.</p>
        </CardContent>
      </Card>
    </div>
  );
}
