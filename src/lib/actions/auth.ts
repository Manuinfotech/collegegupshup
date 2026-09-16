'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type { UserRole } from '@/types/database';

function getRoleDashboard(role: UserRole | null | undefined): string {
  switch (role) {
    case 'super_admin':
      return '/admin';
    case 'college_admin':
      return '/dashboard';
    case 'student':
      return '/student';
    case 'manager':
      return '/manager';
    default:
      return '/student';
  }
}

export async function signUp(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('full_name') as string;
  const accountType = (formData.get('account_type') as string) || 'student';

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        account_type: accountType === 'college' ? 'college' : 'student',
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/login?message=Check your email to confirm your account');
}

export async function signIn(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
    const destination = getRoleDashboard(profile?.role);
    revalidatePath('/', 'layout');
    redirect(destination);
  }

  revalidatePath('/', 'layout');
  redirect('/student');
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}

export async function getUserColleges() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from('college_users')
    .select('college_id, role, colleges(id, name, slug, logo_url)')
    .eq('user_id', user.id);

  return data || [];
}
