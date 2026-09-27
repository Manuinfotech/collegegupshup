import { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AdminCollegesClient } from './admin-colleges-client';

export const metadata: Metadata = { title: 'Colleges Management' };

export default async function AdminCollegesPage() {
  const supabase = await createServerSupabaseClient();
  
  // Fetch colleges with city names
  const { data: colleges } = await supabase
    .from('colleges')
    .select('id, name, slug, status, created_at, is_active, is_featured, ownership_type, logo_url, cities(name)')
    .order('created_at', { ascending: false });

  const { data: { user } } = await supabase.auth.getUser();
  const userRole = user?.user_metadata?.role || 'admin';

  return <AdminCollegesClient initialColleges={colleges || []} userRole={userRole} />;
}
