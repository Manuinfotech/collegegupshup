import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createOrder } from '@/lib/razorpay';
import { createServerSupabaseAdmin, createServerSupabaseClient } from '@/lib/supabase/server';
import { canManageCollege } from '@/lib/authorization';

const createOrderSchema = z.object({
  college_id: z.string().uuid(),
  plan_id: z.string().uuid(),
  billing_cycle: z.enum(['monthly', 'quarterly', 'yearly']),
});

export async function POST(request: NextRequest) {
  try {
    const parsed = createOrderSchema.safeParse(await request.json().catch(() => null));

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payment request' }, { status: 400 });
    }

    const { college_id, plan_id, billing_cycle } = parsed.data;
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!(await canManageCollege(supabase, user.id, college_id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data: plan, error: planError } = await supabase
      .from('plans')
      .select('price_monthly, price_quarterly, price_yearly')
      .eq('id', plan_id)
      .eq('is_active', true)
      .maybeSingle();

    if (planError || !plan) {
      return NextResponse.json({ error: 'Subscription plan not found' }, { status: 404 });
    }

    const amountByCycle = {
      monthly: plan.price_monthly,
      quarterly: plan.price_quarterly,
      yearly: plan.price_yearly,
    };
    const amount = Number(amountByCycle[billing_cycle]);

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: 'This plan does not require an online payment' }, { status: 400 });
    }

    const order = await createOrder(amount);

    // Store order reference
    const admin = createServerSupabaseAdmin();
    const { error: paymentError } = await admin.from('payments').insert({
      college_id,
      plan_id,
      billing_cycle,
      amount,
      currency: 'INR',
      status: 'pending',
      razorpay_order_id: order.id,
    });

    if (paymentError) throw paymentError;

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
