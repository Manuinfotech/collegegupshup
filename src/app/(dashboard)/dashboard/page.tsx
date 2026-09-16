import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Download, Star, Heart, FileText, ArrowUpRight, ChevronRight } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatDistanceToNow } from 'date-fns';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { calculateProfileCompletion } from '@/lib/utils/college-completion';

export const metadata: Metadata = {
  title: 'College Dashboard',
};

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: collegeUser } = await supabase
    .from('college_users')
    .select('college_id, colleges(name)')
    .eq('user_id', user.id)
    .single();

  const collegeId = collegeUser?.college_id;
  const collegeName = (collegeUser?.colleges as any)?.name || 'Your College';

  let stats = [
    { title: 'Total Leads', value: 0, icon: <Users className="h-6 w-6 text-indigo-600" />, bg: 'bg-indigo-50', ring: 'ring-indigo-100', trend: '+12%' },
    { title: 'Saved by Students', value: 0, icon: <Heart className="h-6 w-6 text-rose-600" />, bg: 'bg-rose-50', ring: 'ring-rose-100', trend: '+5%' },
    { title: 'Brochure Views', value: 0, icon: <Download className="h-6 w-6 text-blue-600" />, bg: 'bg-blue-50', ring: 'ring-blue-100', trend: '+18%' },
    { title: 'Avg Rating', value: '0.0', icon: <Star className="h-6 w-6 text-amber-500" />, bg: 'bg-amber-50', ring: 'ring-amber-100', trend: 'Stable' },
  ];
  
  let recentLeads: any[] = [];

  if (collegeId) {
    const [
      { count: leadsCount },
      { count: savedCount },
      { count: brochuresCount },
      { data: reviewsData },
      { data: leadsData }
    ] = await Promise.all([
      supabase.from('leads').select('*', { count: 'exact', head: true }).eq('college_id', collegeId),
      supabase.from('saved_colleges').select('*', { count: 'exact', head: true }).eq('college_id', collegeId),
      supabase.from('brochures').select('*', { count: 'exact', head: true }).eq('college_id', collegeId),
      supabase.from('reviews').select('rating').eq('college_id', collegeId),
      supabase.from('leads').select('name, email, course_interest, source, created_at').eq('college_id', collegeId).order('created_at', { ascending: false }).limit(5)
    ]);

    const avgRating = reviewsData && reviewsData.length > 0 
      ? (reviewsData.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0) / reviewsData.length).toFixed(1)
      : '0.0';

    stats = [
      { title: 'Total Leads', value: leadsCount || 0, icon: <Users className="h-6 w-6 text-indigo-600" />, bg: 'bg-indigo-50', ring: 'ring-indigo-100', trend: '+12%' },
      { title: 'Saved by Students', value: savedCount || 0, icon: <Heart className="h-6 w-6 text-rose-600" />, bg: 'bg-rose-50', ring: 'ring-rose-100', trend: '+5%' },
      { title: 'Brochure Uploads', value: brochuresCount || 0, icon: <FileText className="h-6 w-6 text-blue-600" />, bg: 'bg-blue-50', ring: 'ring-blue-100', trend: '+18%' },
      { title: 'Avg Rating', value: avgRating, icon: <Star className="h-6 w-6 text-amber-500" />, bg: 'bg-amber-50', ring: 'ring-amber-100', trend: 'Stable' },
    ];
    
    recentLeads = leadsData || [];
  }
  
  const completionPercentage = collegeUser?.colleges ? calculateProfileCompletion(collegeUser.colleges) : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1.5 text-base">
            Welcome back! Here&apos;s an overview of <span className="font-semibold text-indigo-600">{collegeName}</span>.
          </p>
        </div>
        <div className="flex gap-3">
          <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200 px-3 py-1.5 rounded-full shadow-sm text-sm font-medium transition-colors">
            Live Analytics
            <div className="w-2 h-2 rounded-full bg-emerald-500 ml-2 animate-pulse" />
          </Badge>
        </div>
      </div>

      {!collegeId && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-5 rounded-2xl shadow-sm">
          <strong className="block text-lg mb-1">Action Required</strong>
          You are not currently linked to any college profile. Please contact support to link your account and access analytics.
        </div>
      )}

      {collegeId && completionPercentage < 100 && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0">
              <svg className="h-16 w-16 -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" className="fill-transparent stroke-indigo-100" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" className="fill-transparent stroke-indigo-600 transition-all duration-1000 ease-out" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * completionPercentage) / 100} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-indigo-700">{completionPercentage}%</span>
              </div>
            </div>
            <div>
              <strong className="block text-lg mb-1 text-slate-900">Complete Your College Listing</strong>
              <p className="text-slate-600 text-sm">You&apos;re missing some details! A complete profile attracts more students and improves your ranking.</p>
            </div>
          </div>
          <Link 
            href="/dashboard/college/edit"
            className={buttonVariants({ variant: 'default', className: "shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white" })}
          >
            Complete Profile <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Recent Leads */}
      <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100/60 pb-5 bg-white/40">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Recent Leads</CardTitle>
            <p className="text-sm text-slate-500 mt-1">Prospective students who engaged recently.</p>
          </div>
          <Link href="/dashboard/leads" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center group">
            View All
            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100/60">
            {recentLeads.length ? recentLeads.map((lead, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-slate-50/50 transition-colors gap-4 group">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 ring-1 ring-indigo-100 flex items-center justify-center shadow-inner">
                    <span className="text-lg font-bold text-indigo-600">
                      {lead.name?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{lead.name}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{lead.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end sm:text-right gap-6">
                  <div>
                    <Badge variant="outline" className="bg-white text-slate-600 border-slate-200 font-medium px-3 py-1">
                      {lead.course_interest || 'General'}
                    </Badge>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <Badge variant="secondary" className="text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {lead.source || 'Direct'}
                    </Badge>
                    <p className="text-xs text-slate-400 mt-2 font-medium flex items-center justify-end">
                      {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-12 text-center text-slate-500">
                <div className="h-16 w-16 bg-slate-50 ring-1 ring-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-slate-300" />
                </div>
                <p className="text-lg font-medium text-slate-900 mb-1">No leads yet</p>
                <p>When students inquire about your college, they will appear here.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
