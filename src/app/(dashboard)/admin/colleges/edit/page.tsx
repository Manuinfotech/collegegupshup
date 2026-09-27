import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { CollegeEditForm } from '@/app/(dashboard)/dashboard/college/edit/edit-form';

export const metadata: Metadata = { title: 'Edit College (Admin)' };

export default async function AdminCollegeEditPage(
  props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }
) {
  const searchParams = await props.searchParams;
  const targetCollegeId = typeof searchParams?.id === 'string' ? searchParams.id : undefined;

  if (!targetCollegeId) {
    redirect('/admin/colleges');
  }

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'super_admin') {
    redirect('/dashboard');
  }

  const { data: college } = await supabase
    .from('colleges')
    .select(`
      *,
      admissions(*),
      scholarships(*),
      hostel_details(*),
      cutoffs(*),
      rankings(*),
      courses(id, name)
    `)
    .eq('id', targetCollegeId)
    .single();

  if (!college) redirect('/admin/colleges');

  return (
    <div className="flex-1 w-full flex flex-col min-h-0 bg-slate-50/50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit College (Admin Mode)</h1>
          <p className="text-slate-500 mt-1">You are editing {college.name} as an administrator.</p>
        </div>
        <CollegeEditForm college={college} />
      </div>
    </div>
  );
}
