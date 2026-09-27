'use server';

import { createServerSupabaseClient, createServerSupabaseAdmin } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function upsertSeoEntry(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'super_admin' && profile?.role !== 'college_admin') return { error: 'Not authorized' };

  const supabaseAdmin = createServerSupabaseAdmin();
  
  const id = formData.get('id') as string;
  const page_type = formData.get('page_type') as string;
  const page_identifier = formData.get('page_identifier') as string;
  const meta_title = formData.get('meta_title') as string;
  const meta_description = formData.get('meta_description') as string;
  const canonical_url = formData.get('canonical_url') as string;
  const og_image = formData.get('og_image') as string;
  const schema_markup_raw = formData.get('schema_markup') as string;

  let schema_markup = null;
  if (schema_markup_raw) {
    try {
      schema_markup = JSON.parse(schema_markup_raw);
    } catch (e) {
      return { error: 'Schema markup must be valid JSON' };
    }
  }

  const payload = {
    page_type,
    page_identifier,
    meta_title,
    meta_description,
    canonical_url,
    og_image,
    schema_markup,
  };

  if (!id) {
    const { error } = await supabaseAdmin.from('seo_meta').insert(payload);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabaseAdmin.from('seo_meta').update(payload).eq('id', id);
    if (error) return { error: error.message };
  }

  revalidatePath('/admin/seo');
  // Optional: revalidate the specific public page
  return { success: true };
}

export async function deleteSeoEntry(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'super_admin') return { error: 'Not authorized' };

  const supabaseAdmin = createServerSupabaseAdmin();
  const { error } = await supabaseAdmin.from('seo_meta').delete().eq('id', id);
  
  if (error) return { error: error.message };
  
  revalidatePath('/admin/seo');
  return { success: true };
}
