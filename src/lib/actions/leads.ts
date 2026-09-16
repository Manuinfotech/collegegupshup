'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createLead(data: {
  college_id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  course_interest?: string;
  source: string;
}) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from('leads').insert(data);

  return { error: error?.message || null };
}

export async function getLeads(collegeId: string, params?: {
  page?: number;
  limit?: number;
  status?: string;
  source?: string;
}) {
  const supabase = await createServerSupabaseClient();
  const { page = 1, limit = 20, status, source } = params || {};

  let query = supabase
    .from('leads')
    .select('*', { count: 'exact' })
    .eq('college_id', collegeId)
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);
  if (source) query = query.eq('source', source);

  const from = (page - 1) * limit;
  query = query.range(from, from + limit - 1);

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

export async function updateLeadStatus(leadId: string, status: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', leadId);

  if (!error) revalidatePath('/dashboard/leads');

  return { error: error?.message || null };
}

export async function getBlogs(params?: {
  page?: number;
  limit?: number;
  category?: string;
}) {
  const supabase = await createServerSupabaseClient();
  const { page = 1, limit = 12, category } = params || {};

  let query = supabase
    .from('blogs')
    .select(`
      id, title, slug, excerpt, cover_image_url, tags, is_featured, published_at,
      users!author_id(full_name, avatar_url),
      blog_categories(name, slug)
    `, { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (category) {
    query = query.eq('blog_categories.slug', category);
  }

  const from = (page - 1) * limit;
  query = query.range(from, from + limit - 1);

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

export async function getBlogBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('blogs')
    .select(`
      *,
      users!author_id(full_name, avatar_url),
      blog_categories(name, slug)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  return { data, error: error?.message || null };
}
