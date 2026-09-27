import { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Mail, Wallet, Lock, TrendingUp, ChevronLeft, ChevronRight, Plus, Building2, Users, CreditCard, Settings, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { DashboardCarousel, Slide } from '@/components/dashboard/dashboard-carousel';

export const metadata: Metadata = { title: 'Admin Overview' };

const adminSlides: Slide[] = [
  {
    id: 1,
    title: 'Manage platform managers.',
    description: 'Create manager accounts and assign them to specific tasks. Invite them by email or send them a join link.',
    buttonText: 'Create a manager',
    buttonIconName: 'Plus',
    buttonLink: '/admin/managers',
    iconName: 'Users',
    accentColor: 'text-black',
    bgColor: 'bg-[#D4FF00]'
  },
  {
    id: 2,
    title: 'Review SEO performance.',
    description: 'Monitor how your platform is ranking on search engines and update metadata for better visibility.',
    buttonText: 'View SEO Settings',
    buttonIconName: 'BarChart',
    buttonLink: '/admin/seo',
    iconName: 'TrendingUp',
    accentColor: 'text-emerald-500',
    bgColor: 'bg-emerald-500'
  },
  {
    id: 3,
    title: 'Configure platform settings.',
    description: 'Manage global platform configurations, email templates, and other core settings in one place.',
    buttonText: 'Platform Settings',
    buttonIconName: 'Settings',
    buttonLink: '/admin/settings',
    iconName: 'Settings',
    accentColor: 'text-slate-700',
    bgColor: 'bg-slate-700'
  },
  {
    id: 4,
    title: 'Monitor subscription growth.',
    description: 'Track how many colleges have upgraded to premium plans and manage their billing cycles.',
    buttonText: 'View Subscriptions',
    buttonIconName: 'CreditCard',
    buttonLink: '/admin/plans',
    iconName: 'CreditCard',
    accentColor: 'text-amber-500',
    bgColor: 'bg-amber-500'
  }
];

export default async function AdminDashboard() {
  const supabase = await createServerSupabaseClient();

  const [
    { count: collegesCount },
    { count: usersCount },
    { count: subscriptionsCount },
    { data: paymentsData },
  ] = await Promise.all([
    supabase.from('colleges').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('payments').select('amount').eq('status', 'success'),
  ]);

  const totalRevenue = paymentsData?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0;
  const formattedRevenue = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalRevenue);

  return (
    <div className="w-full font-sans">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[32px] md:text-4xl font-serif font-normal tracking-tight text-gray-900 mb-2">Overview</h1>
          <p className="text-gray-500 text-[15px]">Super Admin dashboard for platform-wide metrics and management.</p>
        </div>
        <div className="flex pb-1">
          <Button variant="outline" className="h-9 rounded-full px-4 text-sm font-medium border-gray-200 text-gray-700 bg-white hover:bg-gray-50 shadow-sm">
            <Mail className="h-4 w-4 mr-2 text-gray-500" />
            Report digest: Monthly
          </Button>
        </div>
      </div>

      {/* Stats Container - replicating the white card with dividers */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col md:flex-row mb-8 overflow-hidden">
        
        {/* Stat 1 */}
        <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-gray-100">
          <div className="flex items-center gap-1.5 mb-3 text-gray-500">
            <Building2 className="h-3.5 w-3.5" />
            <span className="text-[11px] font-bold tracking-widest uppercase">Colleges</span>
          </div>
          <div className="font-semibold text-3xl tracking-tight text-gray-900 leading-none mb-3">
            {collegesCount || 0}
          </div>
          <p className="text-[13px] text-gray-500 font-medium">Total colleges onboarded</p>
        </div>

        {/* Stat 2 */}
        <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-gray-100">
          <div className="flex items-center gap-1.5 mb-3 text-gray-500">
            <Users className="h-3.5 w-3.5" />
            <span className="text-[11px] font-bold tracking-widest uppercase">Users</span>
          </div>
          <div className="font-semibold text-3xl tracking-tight text-gray-900 leading-none mb-3">
            {usersCount || 0}
          </div>
          <p className="text-[13px] text-gray-500 font-medium">Registered on platform</p>
        </div>

        {/* Stat 3 */}
        <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-gray-100">
          <div className="flex items-center gap-1.5 mb-3 text-gray-500">
            <CreditCard className="h-3.5 w-3.5" />
            <span className="text-[11px] font-bold tracking-widest uppercase">Subscriptions</span>
          </div>
          <div className="font-semibold text-3xl tracking-tight text-gray-900 leading-none mb-3">
            {subscriptionsCount || 0}
          </div>
          <p className="text-[13px] text-gray-500 font-medium">Active paying colleges</p>
        </div>

        {/* Stat 4 */}
        <div className="flex-1 p-6">
          <div className="flex items-center gap-1.5 mb-3 text-gray-500">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="text-[11px] font-bold tracking-widest uppercase">Total Revenue</span>
          </div>
          <div className="font-semibold text-3xl tracking-tight text-indigo-600 leading-none mb-3">
            {formattedRevenue}
          </div>
          <p className="text-[13px] text-gray-500 font-medium">Platform lifetime revenue</p>
        </div>
      </div>

      {/* Dynamic Interactive Banner Carousel Area */}
      <DashboardCarousel slides={adminSlides} />
    </div>
  );
}
