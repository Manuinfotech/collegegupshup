import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

export async function canManageCollege(
  supabase: SupabaseClient<Database>,
  userId: string,
  collegeId: string,
) {
  const [{ data: profile }, { data: membership }, { data: managedCollege }] = await Promise.all([
    supabase.from('users').select('role').eq('id', userId).maybeSingle(),
    supabase
      .from('college_users')
      .select('id')
      .eq('user_id', userId)
      .eq('college_id', collegeId)
      .maybeSingle(),
    supabase
      .from('colleges')
      .select('id')
      .eq('id', collegeId)
      .eq('manager_id', userId)
      .maybeSingle(),
  ]);

  return profile?.role === 'super_admin' || Boolean(membership || managedCollege);
}
