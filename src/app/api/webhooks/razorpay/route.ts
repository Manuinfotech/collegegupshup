import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { createServerSupabaseAdmin } from '@/lib/supabase/server';
import { completePayment } from '@/lib/subscriptions';

const webhookSchema = z.object({
  event: z.string(),
  payload: z.record(z.string(), z.unknown()),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    if (!verifyWebhookSignature(body, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const parsed = webhookSchema.safeParse(JSON.parse(body));
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid event payload' }, { status: 400 });
    }

    const event = parsed.data;
    const admin = createServerSupabaseAdmin();

    switch (event.event) {
      case 'payment.captured': {
        const entity = z.object({
          id: z.string(),
          order_id: z.string(),
          amount: z.number(),
          currency: z.string(),
        }).safeParse((event.payload.payment as { entity?: unknown } | undefined)?.entity);

        if (!entity.success) break;

        const { data: payment } = await admin
          .from('payments')
          .select('*')
          .eq('razorpay_order_id', entity.data.order_id)
          .maybeSingle();

        if (
          payment &&
          entity.data.amount === Math.round(payment.amount * 100) &&
          entity.data.currency === payment.currency
        ) {
          await completePayment(payment, entity.data.id);
        }
        break;
      }

      case 'payment.failed': {
        const entity = z.object({ order_id: z.string() })
          .safeParse((event.payload.payment as { entity?: unknown } | undefined)?.entity);
        if (entity.success) {
          await admin
            .from('payments')
            .update({ status: 'failed' })
            .eq('razorpay_order_id', entity.data.order_id)
            .eq('status', 'pending');
        }
        break;
      }

      case 'subscription.charged':
        // Handle recurring payment
        break;

      case 'subscription.cancelled':
        {
          const entity = z.object({ id: z.string() })
            .safeParse((event.payload.subscription as { entity?: unknown } | undefined)?.entity);
          if (entity.success) {
            await admin
              .from('subscriptions')
              .update({ status: 'cancelled' })
              .eq('razorpay_subscription_id', entity.data.id);
          }
        }
        break;
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
