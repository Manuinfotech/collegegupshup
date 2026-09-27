import { Metadata } from 'next';
import { Mail, Wallet, Lock, TrendingUp, ChevronLeft, ChevronRight, Plus, Users, Heart, FileText, Star, GraduationCap, Video, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { DashboardCarousel, Slide } from '@/components/dashboard/dashboard-carousel';

export const metadata: Metadata = {
  title: 'College Dashboard',
};

const collegeSlides: Slide[] = [
  {
    id: 1,
    title: 'Attract more students.',
    description: 'Complete your profile, upload brochures, and respond to reviews to stand out from the competition.',
    buttonText: 'Edit Profile',
    buttonIcon: Plus,
    buttonLink: '/dashboard/college/edit',
    icon: GraduationCap,
    accentColor: 'text-black',
    bgColor: 'bg-[#D4FF00]'
  },
  {
    id: 2,
    title: 'Upload virtual tours.',
    description: 'Give prospective students a real feel of your campus by uploading high-quality video tours.',
    buttonText: 'Manage Videos',
    buttonIcon: Video,
    buttonLink: '/dashboard/videos',
    icon: Video,
    accentColor: 'text-rose-500',
    bgColor: 'bg-rose-500'
  },
  {
    id: 3,
    title: 'Showcase your success.',
    description: 'Update your latest placement statistics to build trust with students and parents.',
    buttonText: 'Update Placements',
    buttonIcon: Trophy,
    buttonLink: '/dashboard/placements',
    icon: Trophy,
    accentColor: 'text-amber-500',
    bgColor: 'bg-amber-500'
  },
  {
    id: 4,
    title: 'Keep course fees updated.',
    description: 'Ensure your fee structure is transparent and up-to-date to avoid student confusion.',
    buttonText: 'Manage Fees',
    buttonIcon: FileText,
    buttonLink: '/dashboard/fees',
    icon: FileText,
    accentColor: 'text-emerald-500',
    bgColor: 'bg-emerald-500'
  }
];

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
    <div className="w-full font-sans">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[32px] md:text-4xl font-serif font-normal tracking-tight text-gray-900 mb-2">Overview</h1>
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
          <div className="font-semibold text-3xl tracking-tight text-gray-900 leading-none mb-3">
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
          <div className="font-semibold text-3xl tracking-tight text-gray-900 leading-none mb-3">
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
          <div className="font-semibold text-3xl tracking-tight text-gray-900 leading-none mb-3">
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
          <div className="font-semibold text-3xl tracking-tight text-indigo-600 leading-none mb-3">
            {stats.avgRating}
          </div>
          <p className="text-[13px] text-gray-500 font-medium">From student reviews</p>
        </div>
      </div>

      {/* Dynamic Interactive Banner Carousel Area */}
      <DashboardCarousel slides={collegeSlides} />
    </div>
  );
}
