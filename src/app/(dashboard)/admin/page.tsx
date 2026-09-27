import { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Mail, Wallet, Lock, TrendingUp, ChevronLeft, ChevronRight, Plus, Building2, Users, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = { title: 'Admin Overview' };

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
    <div className="max-w-[1000px] font-sans">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-normal font-serif tracking-tight text-gray-900 mb-3">Overview</h1>
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
          <div className="font-serif text-[32px] text-gray-900 leading-none mb-3">
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
          <div className="font-serif text-[32px] text-gray-900 leading-none mb-3">
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
          <div className="font-serif text-[32px] text-gray-900 leading-none mb-3">
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
          <div className="font-serif text-[32px] text-emerald-600 leading-none mb-3">
            {formattedRevenue}
          </div>
          <p className="text-[13px] text-gray-500 font-medium">Platform lifetime revenue</p>
        </div>
      </div>

      {/* Banner Carousel Area */}
      <div className="bg-gradient-to-r from-[#F0F4F8] to-white border border-gray-200 rounded-xl overflow-hidden flex flex-col md:flex-row relative">
        {/* Carousel controls - Top Right */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10 text-gray-400">
          <span className="text-xs font-medium mr-1">1 / 4</span>
          <button className="hover:text-gray-900 transition-colors"><ChevronLeft className="h-4 w-4" /></button>
          <button className="hover:text-gray-900 transition-colors"><ChevronRight className="h-4 w-4" /></button>
        </div>

        <div className="w-full md:w-[45%] bg-[#F4F7FB] min-h-[280px] flex items-center justify-center p-8 relative">
          {/* Abstract placeholder for the 3D icons from the design */}
          <div className="relative w-48 h-40">
            <div className="absolute top-0 left-4 w-24 h-24 bg-blue-100/80 backdrop-blur-md rounded-2xl border-2 border-white shadow-lg transform -rotate-6 flex items-center justify-center">
              <Users className="h-10 w-10 text-blue-500 opacity-80" />
            </div>
            <div className="absolute top-4 right-0 w-24 h-24 bg-blue-100/80 backdrop-blur-md rounded-2xl border-2 border-white shadow-lg transform rotate-12 flex items-center justify-center">
              <Users className="h-10 w-10 text-blue-500 opacity-80" />
            </div>
            <div className="absolute bottom-0 left-10 w-28 h-28 bg-blue-100/90 backdrop-blur-md rounded-2xl border-2 border-white shadow-xl transform z-10 flex items-center justify-center">
              <Users className="h-12 w-12 text-blue-600" />
            </div>
            {/* Lime green badge accent */}
            <div className="absolute bottom-[-10px] left-20 w-8 h-4 bg-indigo-600 rounded-sm z-20 shadow-sm" />
          </div>
        </div>
        
        <div className="w-full md:w-[55%] p-10 flex flex-col justify-center bg-white">
          <h2 className="font-serif text-[32px] text-gray-900 leading-tight mb-4">
            Manage platform managers.
          </h2>
          <p className="text-[15px] text-gray-500 leading-relaxed mb-8 max-w-md">
            Create manager accounts and assign them to specific tasks. Invite them by email or send them a join link.
          </p>
          <div className="flex items-center gap-4">
            <Button className="bg-black hover:bg-gray-800 text-white rounded-full px-6 h-10 font-medium">
              <Plus className="h-4 w-4 mr-2" /> Create a manager
            </Button>
          </div>
          
          {/* Carousel dots */}
          <div className="flex items-center gap-1.5 mt-10">
            <div className="w-6 h-1.5 bg-black rounded-full" />
            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
