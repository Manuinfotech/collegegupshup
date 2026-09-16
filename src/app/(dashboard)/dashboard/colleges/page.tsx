import { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getMyColleges } from '@/lib/actions/college-admin';
import { CollegeListTable } from './college-list-table';

export const metadata: Metadata = {
  title: 'My Colleges',
};

export default async function CollegesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  const colleges = await getMyColleges();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">My Colleges</h1>
          <p className="text-slate-500 mt-1.5 text-base">
            Manage your registered institutions.
          </p>
        </div>
      </div>
      
      <CollegeListTable initialColleges={colleges} />
    </div>
  );
}
