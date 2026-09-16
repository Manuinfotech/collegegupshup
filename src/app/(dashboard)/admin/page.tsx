import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, CreditCard, TrendingUp, Eye, FileText, ArrowUpRight, ChevronRight } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Admin Dashboard' };

export default async function AdminDashboard() {
  const supabase = await createServerSupabaseClient();

  // Fetch all stats in parallel
  const [
    { count: collegesCount },
    { count: usersCount },
    { count: subscriptionsCount },
    { count: leadsCount },
    { count: blogsCount },
    { data: paymentsData },
    { data: recentColleges }
  ] = await Promise.all([
    supabase.from('colleges').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('blogs').select('*', { count: 'exact', head: true }),
    supabase.from('payments').select('amount').eq('status', 'success'),
    supabase.from('colleges').select('id, name, status, created_at').order('created_at', { ascending: false }).limit(5)
  ]);

  // Calculate total revenue
  const totalRevenue = paymentsData?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0;
  const formattedRevenue = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalRevenue);

  const stats = [
    { title: 'Total Colleges', value: collegesCount || 0, icon: <Building2 className="h-6 w-6 text-blue-600" />, bg: 'bg-blue-50', ring: 'ring-blue-100', trend: '+4 this week' },
    { title: 'Total Users', value: usersCount || 0, icon: <Users className="h-6 w-6 text-emerald-600" />, bg: 'bg-emerald-50', ring: 'ring-emerald-100', trend: '+12% active' },
    { title: 'Active Subscriptions', value: subscriptionsCount || 0, icon: <CreditCard className="h-6 w-6 text-indigo-600" />, bg: 'bg-indigo-50', ring: 'ring-indigo-100', trend: '+2 new' },
    { title: 'Total Revenue', value: formattedRevenue, icon: <TrendingUp className="h-6 w-6 text-amber-600" />, bg: 'bg-amber-50', ring: 'ring-amber-100', trend: '+8% MoM' },
    { title: 'Platform Leads', value: leadsCount || 0, icon: <Eye className="h-6 w-6 text-rose-600" />, bg: 'bg-rose-50', ring: 'ring-rose-100', trend: '+24% MoM' },
    { title: 'Blog Posts', value: blogsCount || 0, icon: <FileText className="h-6 w-6 text-cyan-600" />, bg: 'bg-cyan-50', ring: 'ring-cyan-100', trend: 'Stable' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Platform Overview</h1>
          <p className="text-slate-500 mt-1.5 text-base">Super Admin dashboard for platform-wide metrics and management.</p>
        </div>
        <div className="flex gap-3">
          <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200 px-3 py-1.5 rounded-full shadow-sm text-sm font-medium transition-colors">
            Live Analytics
            <div className="w-2 h-2 rounded-full bg-emerald-500 ml-2 animate-pulse" />
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6 relative">
              <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-white/0 to-slate-50/50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
              <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 rounded-2xl ${stat.bg} ring-1 ${stat.ring} flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-inner`}>
                  {stat.icon}
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full ring-1 ring-emerald-100">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  {stat.trend}
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Colleges */}
      <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100/60 pb-5 bg-white/40">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Recently Onboarded</CardTitle>
            <p className="text-sm text-slate-500 mt-1">New colleges registered on the platform.</p>
          </div>
          <Link href="/admin/colleges" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center group">
            View All
            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100/60">
            {recentColleges?.length ? recentColleges.map((college) => (
              <div key={college.id} className="flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 ring-1 ring-indigo-100 flex items-center justify-center shadow-inner">
                    <Building2 className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{college.name}</p>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Added {formatDistanceToNow(new Date(college.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={`px-3 py-1 font-medium
                    ${college.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                      college.status === 'pending_review' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                      'bg-slate-50 text-slate-700 border-slate-200'}
                  `}>
                    {college.status?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
                  </Badge>
                </div>
              </div>
            )) : (
              <div className="p-12 text-center text-slate-500">
                <div className="h-16 w-16 bg-slate-50 ring-1 ring-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-slate-300" />
                </div>
                <p className="text-lg font-medium text-slate-900 mb-1">No colleges found</p>
                <p>Register your first college to see it appear here.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
