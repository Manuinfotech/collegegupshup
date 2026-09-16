import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseAdmin, createServerSupabaseClient } from '@/lib/supabase/server';
import type { Json } from '@/types/database';

const auditSchema = z.object({
  action: z.string().trim().min(1).max(50).regex(/^[a-z0-9_.:-]+$/i),
  entity_type: z.string().trim().min(1).max(50).regex(/^[a-z0-9_.:-]+$/i),
  entity_id: z.string().uuid().nullable().optional(),
  old_values: z.unknown().optional(),
  new_values: z.unknown().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (profile?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const parsed = auditSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid audit event' }, { status: 400 });
    }

    const { action, entity_type, entity_id, old_values, new_values } = parsed.data;
    const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();

    const logEntry = {
      user_id: user.id,
      action: action as string,
      entity_type: entity_type as string,
      entity_id: entity_id as string | null,
      old_values: old_values ?? null,
      new_values: new_values ?? null,
      ip_address: forwardedFor || request.headers.get('x-real-ip'),
      user_agent: request.headers.get('user-agent'),
    };
    const admin = createServerSupabaseAdmin();
    const { error } = await admin.from('audit_logs').insert({
      ...logEntry,
      old_values: logEntry.old_values as Json,
      new_values: logEntry.new_values as Json,
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to log' }, { status: 500 });
  }
}
