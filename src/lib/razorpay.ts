import Razorpay from 'razorpay';
import { createHmac, timingSafeEqual } from 'crypto';

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createOrder(amount: number, currency = 'INR') {
  const order = await razorpay.orders.create({
    amount: amount * 100, // Razorpay expects paise
    currency,
    receipt: `receipt_${Date.now()}`,
  });
  return order;
}

export async function createSubscription(planId: string, customerId?: string) {
  const subscription = await razorpay.subscriptions.create({
    plan_id: planId,
    total_count: 12,
    ...(customerId && { customer_id: customerId }),
  });
  return subscription;
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const body = orderId + '|' + paymentId;
  const expectedSignature = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex');

  const expected = Buffer.from(expectedSignature, 'hex');
  const received = Buffer.from(signature, 'hex');

  return received.length === expected.length && timingSafeEqual(received, expected);
}

export function verifyWebhookSignature(body: string, signature: string): boolean {
  const expectedSignature = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex');
  const expected = Buffer.from(expectedSignature, 'hex');
  const received = Buffer.from(signature, 'hex');

  return received.length === expected.length && timingSafeEqual(received, expected);
}
