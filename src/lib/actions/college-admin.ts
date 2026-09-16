'use server';

import { createServerSupabaseClient, createServerSupabaseAdmin } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { TablesUpdate, OwnershipType } from '@/types/database';

function generateSlug(name: string | null): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// =============================================
// COLLEGE CRUD
// =============================================

export async function createCollegeWithProfile(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };



  const name = formData.get('name') as string;
  if (!name) return { error: 'College name is required' };
  
  const slug = generateSlug(name);

  // Check slug uniqueness
  const { data: slugCheck } = await supabase
    .from('colleges')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();
  const finalSlug = slugCheck ? `${slug}-${Date.now().toString(36)}` : slug;

  const collegeData = {
    name,
    slug: finalSlug,
    logo_url: null,
    cover_image_url: null,
    short_description: formData.get('short_description') as string || null,
    description: formData.get('description') as string || null,
    established_year: formData.get('established_year') ? Number(formData.get('established_year')) : null,
    ownership_type: (formData.get('ownership_type') as OwnershipType) || null,
    accreditation: formData.get('accreditation') as string || null,
    affiliation: formData.get('affiliation') as string || null,
    university: formData.get('university') as string || null,
    campus_area: formData.get('campus_area') as string || null,
    website: formData.get('website') as string || null,
    email: formData.get('email') as string || null,
    phone: formData.get('phone') as string || null,
    address: formData.get('address') as string || null,
    pincode: formData.get('pincode') as string || null,
    facilities: formData.get('facilities') ? (formData.get('facilities') as string).split(',').map(f => f.trim()).filter(Boolean) : [],
    status: 'draft' as const,
    is_active: false,
    is_featured: false,
    is_verified: false,
    average_rating: 0,
    review_count: 0,
  };

  const supabaseAdmin = createServerSupabaseAdmin();

  const { data: college, error: collegeError } = await supabaseAdmin
    .from('colleges')
    .insert(collegeData)
    .select('id')
    .single();

  if (collegeError || !college) {
    return { error: collegeError?.message || 'Failed to create college' };
  }

  // Link user as owner
  const { error: linkError } = await supabaseAdmin
    .from('college_users')
    .insert({ college_id: college.id, user_id: user.id, role: 'owner' });

  if (linkError) return { error: linkError.message };

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/colleges');
  return { success: true, collegeId: college.id };
}

export async function updateCollegeSection(collegeId: string, section: string, data: TablesUpdate<'colleges'>) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { error } = await supabase
    .from('colleges')
    .update(data)
    .eq('id', collegeId);

  if (error) return { error: error.message };

  revalidatePath('/dashboard/college/edit');
  revalidatePath('/dashboard/colleges');
  return { success: true };
}

// =============================================
// ADMISSIONS CRUD
// =============================================

export async function upsertAdmission(collegeId: string, data: {
  id?: string;
  process?: string;
  eligibility?: string;
  application_start_date?: string;
  application_end_date?: string;
  entrance_exams?: string[];
  counseling_process?: string;
  documents_required?: string[];
  selection_criteria?: string;
  year?: number;
}) {
  const supabase = await createServerSupabaseClient();
  const payload = { ...data, college_id: collegeId };

  if (data.id) {
    const { error } = await supabase.from('admissions').update(payload).eq('id', data.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from('admissions').insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath('/dashboard/college/edit');
  return { success: true };
}

// =============================================
// SCHOLARSHIPS CRUD
// =============================================

export async function upsertScholarship(collegeId: string, data: {
  id?: string;
  name: string;
  description?: string;
  amount?: number;
  eligibility?: string;
  type?: string;
  provider?: string;
}) {
  const supabase = await createServerSupabaseClient();
  const payload = { ...data, college_id: collegeId };

  if (data.id) {
    const { id, ...updateData } = payload;
    const { error } = await supabase.from('scholarships').update(updateData).eq('id', data.id);
    if (error) return { error: error.message };
  } else {
    const { id, ...insertData } = payload;
    const { error } = await supabase.from('scholarships').insert(insertData);
    if (error) return { error: error.message };
  }

  revalidatePath('/dashboard/college/edit');
  return { success: true };
}

export async function deleteScholarship(id: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('scholarships').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/dashboard/college/edit');
  return { success: true };
}

// =============================================
// HOSTEL DETAILS CRUD
// =============================================

export async function upsertHostelDetail(collegeId: string, data: {
  id?: string;
  type: string;
  capacity?: number;
  room_types?: string[];
  fees_per_year?: number;
  facilities?: string[];
  mess_menu?: string;
  rules?: string;
}) {
  const supabase = await createServerSupabaseClient();
  const payload = { ...data, college_id: collegeId };

  if (data.id) {
    const { id, ...updateData } = payload;
    const { error } = await supabase.from('hostel_details').update(updateData).eq('id', data.id);
    if (error) return { error: error.message };
  } else {
    const { id, ...insertData } = payload;
    const { error } = await supabase.from('hostel_details').insert(insertData);
    if (error) return { error: error.message };
  }

  revalidatePath('/dashboard/college/edit');
  return { success: true };
}

// =============================================
// CUTOFFS CRUD
// =============================================

export async function upsertCutoff(collegeId: string, data: {
  id?: string;
  course_id?: string;
  exam_name: string;
  category?: string;
  opening_rank?: number;
  closing_rank?: number;
  cutoff_score?: number;
  year: number;
}) {
  const supabase = await createServerSupabaseClient();
  const payload = { ...data, college_id: collegeId };

  if (data.id) {
    const { id, ...updateData } = payload;
    const { error } = await supabase.from('cutoffs').update(updateData).eq('id', data.id);
    if (error) return { error: error.message };
  } else {
    const { id, ...insertData } = payload;
    const { error } = await supabase.from('cutoffs').insert(insertData);
    if (error) return { error: error.message };
  }

  revalidatePath('/dashboard/college/edit');
  return { success: true };
}

export async function deleteCutoff(id: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('cutoffs').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/dashboard/college/edit');
  return { success: true };
}

// =============================================
// RANKINGS CRUD
// =============================================

export async function upsertRanking(collegeId: string, data: {
  id?: string;
  agency: string;
  rank: number;
  year: number;
  category?: string;
}) {
  const supabase = await createServerSupabaseClient();
  const payload = { ...data, college_id: collegeId };

  if (data.id) {
    const { id, ...updateData } = payload;
    const { error } = await supabase.from('rankings').update(updateData).eq('id', data.id);
    if (error) return { error: error.message };
  } else {
    const { id, ...insertData } = payload;
    const { error } = await supabase.from('rankings').insert(insertData);
    if (error) return { error: error.message };
  }

  revalidatePath('/dashboard/college/edit');
  return { success: true };
}

export async function deleteRanking(id: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('rankings').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/dashboard/college/edit');
  return { success: true };
}

// =============================================
// HELPER: Get college for current user
// =============================================

export async function getMyCollege() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: collegeUser } = await supabase
    .from('college_users')
    .select('college_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();

  if (!collegeUser) return null;

  const { data: college } = await supabase
    .from('colleges')
    .select('*')
    .eq('id', collegeUser.college_id)
    .single();

  return college;
}

export async function getMyColleges() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: collegeUsers } = await supabase
    .from('college_users')
    .select('college_id')
    .eq('user_id', user.id);

  if (!collegeUsers || collegeUsers.length === 0) return [];

  const collegeIds = collegeUsers.map(cu => cu.college_id);

  const { data: colleges } = await supabase
    .from('colleges')
    .select('*')
    .in('id', collegeIds)
    .order('created_at', { ascending: false });

  return colleges || [];
}

export async function deleteCollege(collegeId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // Verify ownership
  const { data: ownership } = await supabase
    .from('college_users')
    .select('id')
    .eq('user_id', user.id)
    .eq('college_id', collegeId)
    .maybeSingle();
    
  if (!ownership) return { error: 'Not authorized to delete this college' };

  const supabaseAdmin = createServerSupabaseAdmin();
  const { error } = await supabaseAdmin
    .from('colleges')
    .delete()
    .eq('id', collegeId);

  if (error) return { error: error.message };

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/colleges');
  return { success: true };
}

export async function getCollegeWithRelations(collegeId: string) {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from('colleges')
    .select(`
      *,
      admissions(*),
      scholarships(*),
      hostel_details(*),
      cutoffs(*, courses(name)),
      rankings(*),
      courses(*),
      faculty(*),
      galleries(*),
      videos(*),
      brochures(*),
      placements(*)
    `)
    .eq('id', collegeId)
    .single();

  return data;
}
