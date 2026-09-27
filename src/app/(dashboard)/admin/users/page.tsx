import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, MoreVertical, User, ShieldAlert, Mail } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatDistanceToNow } from 'date-fns';
import { AdminUsersClient } from './admin-users-client';

export const metadata: Metadata = { title: 'User Management' };

export default async function AdminUsersPage() {
  const supabase = await createServerSupabaseClient();
  
  // Fetch users
  const { data: users } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  return <AdminUsersClient initialUsers={users || []} />;
}
