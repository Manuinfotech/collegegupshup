'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export async function completeCollegeSignup(collegeName: string) {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Check if user already has a college linked
  const { data: existing } = await supabase
    .from('college_users')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing) {
    return { error: 'You already have a college registered' };
  }

  const slug = generateSlug(collegeName);

  // Check slug uniqueness
  const { data: slugCheck } = await supabase
    .from('colleges')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  const finalSlug = slugCheck ? `${slug}-${Date.now().toString(36)}` : slug;

  // Create college record
  const { data: college, error: collegeError } = await supabase
    .from('colleges')
    .insert({
      name: collegeName,
      slug: finalSlug,
      status: 'draft',
      is_active: false,
      is_featured: false,
      is_verified: false,
      average_rating: 0,
      review_count: 0,
    })
    .select('id')
    .single();

  if (collegeError || !college) {
    return { error: collegeError?.message || 'Failed to create college' };
  }

  // Link user to college as owner
  const { error: linkError } = await supabase
    .from('college_users')
    .insert({
      college_id: college.id,
      user_id: user.id,
      role: 'owner',
    });

  if (linkError) {
    return { error: linkError.message };
  }

  return { success: true, collegeId: college.id };
}
