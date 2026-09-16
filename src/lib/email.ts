import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendLeadNotification(data: {
  collegeEmail: string;
  collegeName: string;
  leadName: string;
  leadEmail: string;
  leadPhone?: string;
  courseInterest?: string;
  source: string;
}) {
  try {
    await resend.emails.send({
      from: 'College Gupshup <notifications@collegegupshup.com>',
      to: data.collegeEmail,
      subject: `New Lead Received - ${data.leadName}`,
      html: `
        <h2>New Lead for ${data.collegeName}</h2>
        <p><strong>Name:</strong> ${data.leadName}</p>
        <p><strong>Email:</strong> ${data.leadEmail}</p>
        ${data.leadPhone ? `<p><strong>Phone:</strong> ${data.leadPhone}</p>` : ''}
        ${data.courseInterest ? `<p><strong>Course Interest:</strong> ${data.courseInterest}</p>` : ''}
        <p><strong>Source:</strong> ${data.source}</p>
        <hr />
        <p>Login to your dashboard to manage this lead.</p>
      `,
    });
  } catch (error) {
    console.error('Failed to send lead notification:', error);
  }
}

export async function sendSubscriptionExpiryReminder(data: {
  email: string;
  collegeName: string;
  expiryDate: string;
}) {
  try {
    await resend.emails.send({
      from: 'College Gupshup <billing@collegegupshup.com>',
      to: data.email,
      subject: `Subscription Expiring Soon - ${data.collegeName}`,
      html: `
        <h2>Subscription Expiry Reminder</h2>
        <p>Your subscription for <strong>${data.collegeName}</strong> will expire on <strong>${data.expiryDate}</strong>.</p>
        <p>Renew now to continue enjoying premium features.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription">Renew Subscription</a>
      `,
    });
  } catch (error) {
    console.error('Failed to send subscription reminder:', error);
  }
}

export async function sendWelcomeEmail(data: { email: string; name: string }) {
  try {
    await resend.emails.send({
      from: 'College Gupshup <welcome@collegegupshup.com>',
      to: data.email,
      subject: 'Welcome to College Gupshup!',
      html: `
        <h2>Welcome, ${data.name}!</h2>
        <p>Thank you for joining College Gupshup - India's leading education discovery platform.</p>
        <p>Start exploring colleges, courses, and more.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}">Explore Now</a>
      `,
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}
