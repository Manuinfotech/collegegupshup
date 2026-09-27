'use server';

import { createServerSupabaseClient, createServerSupabaseAdmin } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

function generateSlug(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export async function upsertBlog(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // check if super admin or authorized
  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'super_admin' && profile?.role !== 'college_admin') return { error: 'Not authorized' };

  const supabaseAdmin = createServerSupabaseAdmin();
  
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const excerpt = formData.get('excerpt') as string;
  const cover_image_url = formData.get('cover_image_url') as string;
  const status = (formData.get('status') as 'published' | 'draft') || 'draft';
  const is_featured = formData.get('is_featured') === 'true';

  let slug = generateSlug(title);

  // If creating new, ensure slug uniqueness
  if (!id) {
    const { data: existing } = await supabaseAdmin.from('blogs').select('id').eq('slug', slug).maybeSingle();
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }
  }

  const payload: any = {
    title,
    content,
    excerpt,
    cover_image_url,
    status,
    is_featured,
  };

  if (!id) {
    payload.slug = slug;
    payload.author_id = user.id;
    if (status === 'published') {
      payload.published_at = new Date().toISOString();
    }
    const { error } = await supabaseAdmin.from('blogs').insert(payload);
    if (error) return { error: error.message };
  } else {
    // If updating to published and it wasn't, we could set published_at but let's just keep it simple
    if (status === 'published') {
      const { data: curr } = await supabaseAdmin.from('blogs').select('status, published_at').eq('id', id).single();
      if (curr && curr.status !== 'published' && !curr.published_at) {
        payload.published_at = new Date().toISOString();
      }
    }
    const { error } = await supabaseAdmin.from('blogs').update(payload).eq('id', id);
    if (error) return { error: error.message };
  }

  revalidatePath('/admin/blogs');
  revalidatePath('/blog');
  revalidatePath('/');
  return { success: true };
}
