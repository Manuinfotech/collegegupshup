import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { CollegeEditForm } from './edit-form';

export const metadata: Metadata = { title: 'Edit College Profile' };

export default async function EditCollegePage(
  props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }
) {
  const searchParams = await props.searchParams;
  const targetCollegeId = typeof searchParams?.id === 'string' ? searchParams.id : undefined;

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  let finalCollegeId = targetCollegeId;

  if (!finalCollegeId) {
    const { data: collegeUser } = await supabase
      .from('college_users')
      .select('college_id')
      .eq('user_id', user.id)
      .single();

    if (!collegeUser) redirect('/dashboard/college/create');
    finalCollegeId = collegeUser.college_id;
  } else {
    // Check access for specific college
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (profile?.role !== 'super_admin') {
      const { data: collegeUser } = await supabase
        .from('college_users')
        .select('college_id')
        .eq('user_id', user.id)
        .eq('college_id', finalCollegeId)
        .single();
      
      if (!collegeUser) redirect('/dashboard');
    }
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
    .eq('id', finalCollegeId)
    .single();

  if (!college) redirect('/dashboard/college/create');

  return <CollegeEditForm college={college} />;
}
