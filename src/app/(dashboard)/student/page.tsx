import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, GraduationCap, FileText, Star, ArrowUpRight, Search, Building2, ArrowRight } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Student Dashboard',
};

export default async function StudentDashboardPage() {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch user profile
  const { data: profile } = await supabase
    .from('users')
    .select('full_name, email')
    .eq('id', user.id)
    .single();

  // Fetch student stats
  const [
    { count: savedCount },
    { count: reviewsCount },
  ] = await Promise.all([
    supabase.from('saved_colleges').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
  ]);

  // Fetch saved colleges
  const { data: savedColleges } = await supabase
    .from('saved_colleges')
    .select('college_id, colleges(id, name, slug, city_id, cities(name))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  const stats = [
    { title: 'Saved Colleges', value: savedCount || 0, icon: <Heart className="h-6 w-6 text-rose-600" />, bg: 'bg-rose-50', ring: 'ring-rose-100' },
    { title: 'My Reviews', value: reviewsCount || 0, icon: <Star className="h-6 w-6 text-amber-500" />, bg: 'bg-amber-50', ring: 'ring-amber-100' },
    { title: 'Applications', value: 0, icon: <FileText className="h-6 w-6 text-blue-600" />, bg: 'bg-blue-50', ring: 'ring-blue-100' },
    { title: 'Colleges Explored', value: (savedCount || 0) + (reviewsCount || 0), icon: <GraduationCap className="h-6 w-6 text-indigo-600" />, bg: 'bg-indigo-50', ring: 'ring-indigo-100' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome, {profile?.full_name || 'Student'}! 👋
          </h1>
          <p className="text-slate-500 mt-1.5 text-base">
            Explore colleges, track applications, and find your perfect fit.
          </p>
        </div>
        <Link href="/student/search">
          <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-500/20">
            <Search className="h-4 w-4 mr-2" />
            Find Colleges
          </Button>
        </Link>
      </div>

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
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/student/search" className="group">
          <Card className="border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-2xl overflow-hidden h-full">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-2xl bg-indigo-50 ring-1 ring-indigo-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Search className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Search Colleges</h3>
              <p className="text-sm text-slate-500">Find colleges by course, city, or ranking</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/student/saved" className="group">
          <Card className="border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-2xl overflow-hidden h-full">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-2xl bg-rose-50 ring-1 ring-rose-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Heart className="h-7 w-7 text-rose-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Saved Colleges</h3>
              <p className="text-sm text-slate-500">View and compare your shortlisted colleges</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/student/compare" className="group">
          <Card className="border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-2xl overflow-hidden h-full">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-2xl bg-emerald-50 ring-1 ring-emerald-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ArrowUpRight className="h-7 w-7 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Compare Colleges</h3>
              <p className="text-sm text-slate-500">Side-by-side comparison of colleges</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recently Saved Colleges */}
      <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100/60 pb-5 bg-white/40">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Recently Saved</CardTitle>
            <p className="text-sm text-slate-500 mt-1">Your shortlisted colleges</p>
          </div>
          <Link href="/student/saved" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center group">
            View All
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100/60">
            {savedColleges && savedColleges.length > 0 ? savedColleges.map((item: any) => (
              <Link
                key={item.college_id}
                href={`/${item.colleges?.slug || ''}`}
                className="flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 ring-1 ring-indigo-100 flex items-center justify-center shadow-inner">
                    <Building2 className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 group-hover:text-[#bce600] transition-colors">
                      {item.colleges?.name || 'Unknown College'}
                    </p>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {item.colleges?.cities?.name || 'India'}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
              </Link>
            )) : (
              <div className="p-12 text-center text-slate-500">
                <div className="h-16 w-16 bg-slate-50 ring-1 ring-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-slate-300" />
                </div>
                <p className="text-lg font-medium text-slate-900 mb-1">No saved colleges yet</p>
                <p>Start exploring and save colleges to compare later.</p>
                <Link href="/colleges">
                  <Button className="mt-4" variant="outline">
                    Browse Colleges
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
