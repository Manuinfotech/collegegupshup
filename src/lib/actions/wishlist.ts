'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleFavorite(collegeId: string) {
  const supabase = await createServerSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'You must be logged in to save colleges.' };
  }

  // Check if already favorited
  const { data: existing } = await supabase
    .from('saved_colleges')
    .select('id')
    .eq('user_id', user.id)
    .eq('college_id', collegeId)
    .maybeSingle();

  if (existing) {
    // Remove it
    const { error } = await supabase
      .from('saved_colleges')
      .delete()
      .eq('id', existing.id);
      
    if (error) return { error: error.message };
    
    revalidatePath('/saved');
    revalidatePath('/student/saved');
    return { success: true, isSaved: false };
  } else {
    // Add it
    const { error } = await supabase
      .from('saved_colleges')
      .insert({ user_id: user.id, college_id: collegeId });
      
    if (error) return { error: error.message };
    
    revalidatePath('/saved');
    revalidatePath('/student/saved');
    return { success: true, isSaved: true };
  }
}

export async function getUserFavorites() {
  const supabase = await createServerSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null };

  const { data, error } = await supabase
    .from('saved_colleges')
    .select(`
      college_id,
      colleges (
        id,
        name,
        slug,
        logo_url,
        cover_image_url,
        city_id,
        state_id,
        cities (name),
        states (name),
        college_type
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return { error: error.message };
  return { data };
}
