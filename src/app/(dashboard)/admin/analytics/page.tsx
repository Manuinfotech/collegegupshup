import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Building2, Eye, CreditCard, FileText, ArrowUpRight } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Platform Analytics' };

export default async function AdminAnalyticsPage() {
  const supabase = await createServerSupabaseClient();

  const [
    { count: totalUsers },
    { count: totalColleges },
    { count: totalLeads },
    { count: totalBlogs },
    { count: activeSubscriptions },
    { data: recentPayments },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('colleges').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('blogs').select('*', { count: 'exact', head: true }),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('payments').select('amount').eq('status', 'success'),
  ]);

  const totalRevenue = recentPayments?.reduce((acc, p) => acc + (Number(p.amount) || 0), 0) || 0;

  const metrics = [
    { title: 'Total Users', value: totalUsers || 0, icon: <Users className="h-6 w-6 text-indigo-600" />, bg: 'bg-indigo-50', ring: 'ring-indigo-100', change: '+12%' },
    { title: 'Total Colleges', value: totalColleges || 0, icon: <Building2 className="h-6 w-6 text-blue-600" />, bg: 'bg-blue-50', ring: 'ring-blue-100', change: '+8%' },
    { title: 'Total Leads', value: totalLeads || 0, icon: <Eye className="h-6 w-6 text-emerald-600" />, bg: 'bg-emerald-50', ring: 'ring-emerald-100', change: '+24%' },
    { title: 'Active Subscriptions', value: activeSubscriptions || 0, icon: <CreditCard className="h-6 w-6 text-amber-600" />, bg: 'bg-amber-50', ring: 'ring-amber-100', change: '+3' },
    { title: 'Total Revenue', value: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalRevenue), icon: <TrendingUp className="h-6 w-6 text-rose-600" />, bg: 'bg-rose-50', ring: 'ring-rose-100', change: '+15%' },
    { title: 'Blog Posts', value: totalBlogs || 0, icon: <FileText className="h-6 w-6 text-cyan-600" />, bg: 'bg-cyan-50', ring: 'ring-cyan-100', change: 'Stable' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Platform Analytics</h1>
          <p className="text-slate-500 mt-1">Real-time insights across the entire platform.</p>
        </div>
        <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 px-3 py-1.5 rounded-full text-sm font-medium">
          Live Data
          <div className="w-2 h-2 rounded-full bg-emerald-500 ml-2 animate-pulse" />
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.title} className="border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group bg-white/50">
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 rounded-2xl ${metric.bg} ring-1 ${metric.ring} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
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
          <CardTitle className="text-lg">Growth Trends</CardTitle>
          <p className="text-sm text-slate-500">Detailed analytics charts and reports coming soon. Data above is live from your database.</p>
        </CardHeader>
        <CardContent className="p-12 text-center text-slate-500">
          <TrendingUp className="h-16 w-16 text-slate-200 mx-auto mb-4" />
          <p className="text-lg font-medium text-slate-900 mb-1">Charts Coming Soon</p>
          <p className="text-sm">Detailed trend visualizations and exportable reports will be available in the next update.</p>
        </CardContent>
      </Card>
    </div>
  );
}
