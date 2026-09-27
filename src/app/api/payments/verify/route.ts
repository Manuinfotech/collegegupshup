import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getRazorpay, verifyPaymentSignature } from '@/lib/razorpay';
import { createServerSupabaseAdmin, createServerSupabaseClient } from '@/lib/supabase/server';
import { canManageCollege } from '@/lib/authorization';
import { completePayment } from '@/lib/subscriptions';

const verificationSchema = z.object({
  razorpay_order_id: z.string().min(1).max(255),
  razorpay_payment_id: z.string().min(1).max(255),
  razorpay_signature: z.string().regex(/^[a-f0-9]{64}$/i),
});

export async function POST(request: NextRequest) {
  try {
    const parsed = verificationSchema.safeParse(await request.json().catch(() => null));

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid verification request' }, { status: 400 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify signature
    const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    const admin = createServerSupabaseAdmin();
    const { data: payment, error: paymentError } = await admin
      .from('payments')
      .select('*')
      .eq('razorpay_order_id', razorpay_order_id)
      .maybeSingle();

    if (paymentError || !payment) {
      return NextResponse.json({ error: 'Payment order not found' }, { status: 404 });
    }

    if (!(await canManageCollege(supabase, user.id, payment.college_id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const remotePayment = await getRazorpay().payments.fetch(razorpay_payment_id);
    const matchesOrder = remotePayment.order_id === razorpay_order_id;
    const matchesAmount = Number(remotePayment.amount) === Math.round(payment.amount * 100);
    const matchesCurrency = remotePayment.currency === payment.currency;
    const isCaptured = remotePayment.status === 'captured';

    if (!matchesOrder || !matchesAmount || !matchesCurrency || !isCaptured) {
      return NextResponse.json({ error: 'Payment details could not be confirmed' }, { status: 400 });
    }

    const subscription = await completePayment(payment, razorpay_payment_id);

    return NextResponse.json({ success: true, subscription });
  } catch {
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
