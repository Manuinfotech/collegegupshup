'use server';

import { createServerSupabaseAdmin, createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function upsertPlan(data: any) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // check if super admin
  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'super_admin') return { error: 'Not authorized' };

  const supabaseAdmin = createServerSupabaseAdmin();
  
  // Clean up data for insertion (features might come in as a comma-separated string)
  let featuresArray = [];
  if (typeof data.features === 'string') {
    featuresArray = data.features.split(',').map((f: string) => f.trim()).filter(Boolean);
  } else if (Array.isArray(data.features)) {
    featuresArray = data.features;
  }

  const payload = {
    name: data.name,
    tier: data.tier,
    description: data.description,
    price_monthly: Number(data.price_monthly) || 0,
    price_yearly: Number(data.price_yearly) || 0,
    max_courses: data.max_courses ? Number(data.max_courses) : -1,
    max_leads_per_month: data.max_leads_per_month ? Number(data.max_leads_per_month) : -1,
    max_photos: data.max_photos ? Number(data.max_photos) : -1,
    is_active: data.is_active === 'on' || data.is_active === true,
    features: featuresArray,
  };

  if (data.id) {
    const { error } = await supabaseAdmin.from('plans').update(payload).eq('id', data.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabaseAdmin.from('plans').insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath('/admin/plans');
  revalidatePath('/dashboard/subscription');
  return { success: true };
}
