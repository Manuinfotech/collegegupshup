import { Metadata } from 'next';
import { Mail, Wallet, Lock, TrendingUp, ChevronLeft, ChevronRight, Plus, Users, Heart, FileText, Star, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

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

  let stats = { leadsCount: 0, savedCount: 0, brochuresCount: 0, avgRating: '0.0' };

  if (collegeId) {
    const [
      { count: leadsCount },
      { count: savedCount },
      { count: brochuresCount },
      { data: reviewsData },
    ] = await Promise.all([
      supabase.from('leads').select('*', { count: 'exact', head: true }).eq('college_id', collegeId),
      supabase.from('saved_colleges').select('*', { count: 'exact', head: true }).eq('college_id', collegeId),
      supabase.from('brochures').select('*', { count: 'exact', head: true }).eq('college_id', collegeId),
      supabase.from('reviews').select('rating').eq('college_id', collegeId),
    ]);

    const avgRating = reviewsData && reviewsData.length > 0 
      ? (reviewsData.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0) / reviewsData.length).toFixed(1)
      : '0.0';

    stats = {
      leadsCount: leadsCount || 0,
      savedCount: savedCount || 0,
      brochuresCount: brochuresCount || 0,
      avgRating,
    };
  }

  return (
    <div className="max-w-[1000px] font-sans">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-normal font-serif tracking-tight text-gray-900 mb-3">Overview</h1>
          <p className="text-gray-500 text-[15px]">
            Welcome back! Here&apos;s an overview of <span className="text-gray-900 font-medium">{collegeName}</span>.
          </p>
        </div>
        <div className="flex pb-1">
          <Button variant="outline" className="h-9 rounded-full px-4 text-sm font-medium border-gray-200 text-gray-700 bg-white hover:bg-gray-50 shadow-sm">
            <Mail className="h-4 w-4 mr-2 text-gray-500" />
            Performance digest: Weekly
          </Button>
        </div>
      </div>

      {/* Stats Container - replicating the white card with dividers */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col md:flex-row mb-8 overflow-hidden">
        
        {/* Stat 1 */}
        <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-gray-100">
          <div className="flex items-center gap-1.5 mb-3 text-gray-500">
            <Users className="h-3.5 w-3.5" />
            <span className="text-[11px] font-bold tracking-widest uppercase">Total Leads</span>
          </div>
          <div className="font-serif text-[32px] text-gray-900 leading-none mb-3">
            {stats.leadsCount}
          </div>
          <p className="text-[13px] text-gray-500 font-medium">Prospective students</p>
        </div>

        {/* Stat 2 */}
        <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-gray-100">
          <div className="flex items-center gap-1.5 mb-3 text-gray-500">
            <Heart className="h-3.5 w-3.5" />
            <span className="text-[11px] font-bold tracking-widest uppercase">Saved By</span>
          </div>
          <div className="font-serif text-[32px] text-gray-900 leading-none mb-3">
            {stats.savedCount}
          </div>
          <p className="text-[13px] text-gray-500 font-medium">Students shortlisting you</p>
        </div>

        {/* Stat 3 */}
        <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-gray-100">
          <div className="flex items-center gap-1.5 mb-3 text-gray-500">
            <FileText className="h-3.5 w-3.5" />
            <span className="text-[11px] font-bold tracking-widest uppercase">Brochures</span>
          </div>
          <div className="font-serif text-[32px] text-gray-900 leading-none mb-3">
            {stats.brochuresCount}
          </div>
          <p className="text-[13px] text-gray-500 font-medium">Documents available</p>
        </div>

        {/* Stat 4 */}
        <div className="flex-1 p-6">
          <div className="flex items-center gap-1.5 mb-3 text-gray-500">
            <Star className="h-3.5 w-3.5" />
            <span className="text-[11px] font-bold tracking-widest uppercase">Avg Rating</span>
          </div>
          <div className="font-serif text-[32px] text-emerald-600 leading-none mb-3">
            {stats.avgRating}
          </div>
          <p className="text-[13px] text-gray-500 font-medium">From student reviews</p>
        </div>
      </div>

      {/* Banner Carousel Area */}
      <div className="bg-gradient-to-r from-[#F0F4F8] to-white border border-gray-200 rounded-xl overflow-hidden flex flex-col md:flex-row relative">
        {/* Carousel controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10 text-gray-400">
          <span className="text-xs font-medium mr-1">1 / 3</span>
          <button className="hover:text-gray-900 transition-colors"><ChevronLeft className="h-4 w-4" /></button>
          <button className="hover:text-gray-900 transition-colors"><ChevronRight className="h-4 w-4" /></button>
        </div>

        <div className="w-full md:w-[45%] bg-[#F4F7FB] min-h-[280px] flex items-center justify-center p-8 relative">
          <div className="relative w-48 h-40">
            <div className="absolute top-0 left-4 w-24 h-24 bg-blue-100/80 backdrop-blur-md rounded-2xl border-2 border-white shadow-lg transform -rotate-6 flex items-center justify-center">
              <GraduationCap className="h-10 w-10 text-blue-500 opacity-80" />
            </div>
            <div className="absolute top-4 right-0 w-24 h-24 bg-blue-100/80 backdrop-blur-md rounded-2xl border-2 border-white shadow-lg transform rotate-12 flex items-center justify-center">
              <GraduationCap className="h-10 w-10 text-blue-500 opacity-80" />
            </div>
            <div className="absolute bottom-0 left-10 w-28 h-28 bg-blue-100/90 backdrop-blur-md rounded-2xl border-2 border-white shadow-xl transform z-10 flex items-center justify-center">
              <GraduationCap className="h-12 w-12 text-blue-600" />
            </div>
            <div className="absolute bottom-[-10px] left-20 w-8 h-4 bg-[#D4FF00] rounded-sm z-20 shadow-sm" />
          </div>
        </div>
        
        <div className="w-full md:w-[55%] p-10 flex flex-col justify-center bg-white">
          <h2 className="font-serif text-[32px] text-gray-900 leading-tight mb-4">
            Attract more students.
          </h2>
          <p className="text-[15px] text-gray-500 leading-relaxed mb-8 max-w-md">
            Complete your profile, upload brochures, and respond to reviews to stand out from the competition.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/college/edit">
              <Button className="bg-black hover:bg-gray-800 text-white rounded-full px-6 h-10 font-medium">
                <Plus className="h-4 w-4 mr-2" /> Edit Profile
              </Button>
            </Link>
          </div>
          
          {/* Carousel dots */}
          <div className="flex items-center gap-1.5 mt-10">
            <div className="w-6 h-1.5 bg-black rounded-full" />
            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
