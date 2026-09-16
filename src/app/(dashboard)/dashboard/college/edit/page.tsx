import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { CollegeEditForm } from './edit-form';

export const metadata: Metadata = { title: 'Edit College Profile' };

export default async function EditCollegePage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: collegeUser } = await supabase
    .from('college_users')
    .select('college_id')
    .eq('user_id', user.id)
    .single();

  if (!collegeUser) redirect('/dashboard/college/create');

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
    .eq('id', collegeUser.college_id)
    .single();

  if (!college) redirect('/dashboard/college/create');

  return <CollegeEditForm college={college} />;
}
