'use server';

import { createServerSupabaseClient, createServerSupabaseAdmin } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function upsertAd(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'super_admin' && profile?.role !== 'college_admin') return { error: 'Not authorized' };

  const supabaseAdmin = createServerSupabaseAdmin();
  
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const position = formData.get('position') as string;
  const link_url = formData.get('link_url') as string;
  
  // Custom Ad type fields
  const ad_type = formData.get('ad_type') as string; // 'image' or 'adsense'
  const image_url = formData.get('image_url') as string;
  const script_code = formData.get('script_code') as string; // for adsense/html
  const is_active = formData.get('is_active') === 'true';

  const payload: any = {
    title,
    position,
    link_url,
    image_url: ad_type === 'image' ? image_url : null,
    script_code: ad_type === 'adsense' ? script_code : null,
    is_active,
  };

  if (!id) {
    const { error } = await supabaseAdmin.from('advertisements').insert(payload);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabaseAdmin.from('advertisements').update(payload).eq('id', id);
    if (error) return { error: error.message };
  }

  revalidatePath('/admin/advertisements');
  revalidatePath('/');
  revalidatePath('/blog');
  return { success: true };
}

export async function deleteAd(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'super_admin') return { error: 'Not authorized' };

  const supabaseAdmin = createServerSupabaseAdmin();
  const { error } = await supabaseAdmin.from('advertisements').delete().eq('id', id);
  
  if (error) return { error: error.message };
  
  revalidatePath('/admin/advertisements');
  revalidatePath('/');
  revalidatePath('/blog');
  return { success: true };
}
