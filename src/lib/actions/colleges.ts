'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getColleges(params: {
  page?: number;
  limit?: number;
  goal?: string;
  city?: string;
  state?: string;
  ownership?: string;
  fees_min?: number;
  fees_max?: number;
  sort?: string;
  q?: string;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    page = 1,
    limit = 20,
    goal,
    city,
    state,
    ownership,
    fees_min,
    fees_max,
    sort = 'name',
    q,
  } = params;

  let query = supabase
    .from('colleges')
    .select(`
      *,
      cities(name, slug),
      states(name, slug),
      courses(id, name, fees_min, fees_max),
      placements(highest_package, average_package, year)
    `, { count: 'exact' })
    .eq('is_active', true)
    .eq('status', 'published');

  if (q) {
    query = query.ilike('name', `%${q}%`);
  }

  if (city) {
    query = query.eq('cities.slug', city);
  }

  if (state) {
    query = query.eq('states.slug', state);
  }

  if (ownership) {
    query = query.eq('ownership_type', ownership as any);
  }

  // Sorting
  switch (sort) {
    case 'rating':
      query = query.order('average_rating', { ascending: false });
      break;
    case 'established':
      query = query.order('established_year', { ascending: true });
      break;
    case 'featured':
      query = query.order('is_featured', { ascending: false });
      break;
    default:
      query = query.order('name', { ascending: true });
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  return {
    data: data || [],
    error: error?.message || null,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  };
}

export async function getCollegeBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('colleges')
    .select(`
      *,
      cities(id, name, slug),
      states(id, name, slug),
      courses(*, course_specializations(*)),
      placements(*),
      recruiters(*),
      faculty(*),
      galleries(*),
      videos(*),
      brochures(*),
      rankings(*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  return { data, error: error?.message || null };
}

export async function updateCollege(collegeId: string, updates: any) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('colleges')
    .update(updates)
    .eq('id', collegeId)
    .select()
    .single();

  if (!error) {
    revalidatePath(`/colleges/${data.slug}`);
    revalidatePath('/colleges');
  }

  return { data, error: error?.message || null };
}

export async function getFeaturedColleges() {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from('colleges')
    .select(`
      id, name, slug, logo_url, cover_image_url, short_description,
      ownership_type, established_year, is_verified, average_rating, review_count,
      cities(name, slug),
      states(name, slug)
    `)
    .eq('is_active', true)
    .eq('status', 'published')
    .eq('is_featured', true)
    .limit(12);

  return data || [];
}
