import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const leadSchema = z.object({
  college_id: z.string().uuid(),
  name: z.string().trim().min(2).max(255),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(20).regex(/^[0-9+()\s-]+$/).optional().or(z.literal('')),
  city: z.string().trim().max(100).optional().or(z.literal('')),
  course_interest: z.string().trim().max(255).optional().or(z.literal('')),
  source: z.enum(['apply_now', 'download_brochure', 'contact_form', 'admission_enquiry']),
});

export async function POST(request: NextRequest) {
  try {
    const parsed = leadSchema.safeParse(await request.json().catch(() => null));

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid enquiry details' }, { status: 400 });
    }

    const { college_id, name, email, phone, city, course_interest, source } = parsed.data;
    const supabase = await createServerSupabaseClient();

    const { data: college } = await supabase
      .from('colleges')
      .select('id')
      .eq('id', college_id)
      .eq('is_active', true)
      .maybeSingle();

    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('leads')
      .insert({
        college_id,
        name,
        email: email.toLowerCase(),
        phone: phone || null,
        city: city || null,
        course_interest: course_interest || null,
        source,
        status: 'new',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Unable to submit enquiry' }, { status: 500 });
    }

    // TODO: Send notification email asynchronously
    // await sendLeadNotification(...)

    return NextResponse.json({ data, message: 'Lead created successfully' });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
