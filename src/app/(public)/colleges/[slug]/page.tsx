import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { createServerSupabaseClient, createServerSupabaseAdmin } from '@/lib/supabase/server';
import { CollegeDetailClient } from './college-client';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabaseAdmin = createServerSupabaseAdmin();
  const { data: college } = await supabaseAdmin.from('colleges').select('name, short_description').eq('slug', slug).single();
  
  if (!college) return { title: 'College Not Found' };
  
  return {
    title: `${college.name} - Admissions, Courses, Fees, Placements`,
    description: college.short_description || `Get detailed information about ${college.name} including courses, fees, placements, and reviews.`,
  };
}

export default async function CollegeDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabaseAdmin = createServerSupabaseAdmin();

  const { data: college, error } = await supabaseAdmin
    .from('colleges')
    .select(`
      *,
      cities(name),
      states(name),
      rankings(*),
      courses(*),
      fees(*, courses(name, duration, degree_type)),
      placements(*),
      faculty(*),
      galleries(*),
      videos(*),
      reviews(*),
      admissions(*),
      scholarships(*),
      hostel_details(*),
      cutoffs(*, courses(name))
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Supabase query error for slug', slug, ':', error);
  }

  const UnpublishedState = () => (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <Building2 className="h-12 w-12 text-slate-400" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">College Not Published</h1>
      <p className="text-lg text-slate-500 max-w-md leading-relaxed">
        This college is currently in draft mode or has not been published on College Gupshup yet.
      </p>
      <Link href="/colleges" className="mt-8 px-6 py-3 bg-[#D4FF00] text-black font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20">
        Browse other colleges
      </Link>
    </div>
  );

  const DisabledState = () => (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-red-100">
        <Building2 className="h-12 w-12 text-red-400" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">College Disabled</h1>
      <p className="text-lg text-slate-500 max-w-md leading-relaxed">
        This college is disabled from our portal. Please contact Campus Gupshup for more information.
      </p>
      <Link href="/colleges" className="mt-8 px-6 py-3 bg-[#D4FF00] text-black font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20">
        Browse other colleges
      </Link>
    </div>
  );

  if (!college) {
    return <UnpublishedState />;
  }

  if (college.is_active === false) {
    return <DisabledState />;
  }

  if (college.status !== 'published') {
    const supabaseUser = await createServerSupabaseClient();
    const { data: { user } } = await supabaseUser.auth.getUser();
    
    if (!user) {
      return <UnpublishedState />;
    }
    
    const { data: ownership } = await supabaseAdmin
      .from('college_users')
      .select('id')
      .eq('user_id', user.id)
      .eq('college_id', college.id)
      .maybeSingle();
      
    if (!ownership) {
      return <UnpublishedState />;
    }
  }

  return <CollegeDetailClient college={college} />;
}
