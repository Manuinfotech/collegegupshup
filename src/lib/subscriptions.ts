import 'server-only';

import { createServerSupabaseAdmin } from '@/lib/supabase/server';
import type { Tables } from '@/types/database';

const BILLING_MONTHS = {
  monthly: 1,
  quarterly: 3,
  yearly: 12,
} as const;

export async function completePayment(
  payment: Tables<'payments'>,
  razorpayPaymentId: string,
) {
  const admin = createServerSupabaseAdmin();

  if (payment.status === 'success' && payment.subscription_id) {
    const { data } = await admin
      .from('subscriptions')
      .select('*')
      .eq('id', payment.subscription_id)
      .maybeSingle();

    return data;
  }

  if (!payment.plan_id || !payment.billing_cycle) {
    throw new Error('Payment is missing its subscription details');
  }

  const periodStart = new Date();
  const periodEnd = new Date(periodStart);
  periodEnd.setMonth(periodEnd.getMonth() + BILLING_MONTHS[payment.billing_cycle]);

  const { data: subscription, error: subscriptionError } = await admin
    .from('subscriptions')
    .upsert(
      {
        college_id: payment.college_id,
        plan_id: payment.plan_id,
        status: 'active',
        billing_cycle: payment.billing_cycle,
        current_period_start: periodStart.toISOString(),
        current_period_end: periodEnd.toISOString(),
      },
      { onConflict: 'college_id' },
    )
    .select()
    .single();

  if (subscriptionError) throw subscriptionError;

  const { error: collegeError } = await admin
    .from('colleges')
    .update({ subscription_id: subscription.id })
    .eq('id', payment.college_id);

  if (collegeError) throw collegeError;

  const { error: paymentError } = await admin
    .from('payments')
    .update({
      status: 'success',
      razorpay_payment_id: razorpayPaymentId,
      subscription_id: subscription.id,
    })
    .eq('id', payment.id);

  if (paymentError) throw paymentError;

  return subscription;
}
