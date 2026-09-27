import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, CheckCircle2, AlertCircle, Crown, ArrowRight, Calendar, Zap } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';

export const metadata: Metadata = { title: 'Subscription' };

export default async function CollegeSubscriptionPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: collegeUser } = await supabase.from('college_users').select('college_id, colleges(subscription_id)').eq('user_id', user.id).single();
  const subscriptionId = (collegeUser?.colleges as any)?.subscription_id;

  let subscription: any = null;
  let plan: any = null;

  if (subscriptionId) {
    const { data } = await supabase.from('subscriptions').select('*, plans(*)').eq('id', subscriptionId).single();
    subscription = data;
    plan = data?.plans;
  }

  // Fetch all plans for upgrade options
  const { data: allPlans } = await supabase.from('plans').select('*').eq('is_active', true).order('price_monthly', { ascending: true });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Subscription</h1>
        <p className="text-slate-500 mt-1">Manage your plan and billing.</p>
      </div>

      {/* Current Plan */}
      <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-[#D4FF00] flex items-center justify-center shadow-lg shadow-[#D4FF00]/20">
                <Crown className="h-6 w-6 text-black" />
              </div>
              <div>
                <CardTitle className="text-lg">{plan?.name || 'Free Plan'}</CardTitle>
                <p className="text-sm text-slate-500">{subscription ? 'Active Subscription' : 'No active subscription'}</p>
              </div>
            </div>
            {subscription && (
              <Badge className={`px-3 py-1.5 ${
                subscription.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                subscription.status === 'trial' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {subscription.status === 'active' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                {subscription.status === 'expired' && <AlertCircle className="h-3 w-3 mr-1" />}
                {subscription.status?.charAt(0).toUpperCase() + subscription.status?.slice(1)}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {subscription ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Billing Cycle</p>
                <p className="font-semibold text-slate-900 capitalize">{subscription.billing_cycle}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-500 flex items-center gap-1"><Calendar className="h-3 w-3" /> Current Period</p>
                <p className="font-semibold text-slate-900">
                  {format(new Date(subscription.current_period_start), 'MMM dd')} — {format(new Date(subscription.current_period_end), 'MMM dd, yyyy')}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Amount</p>
                <p className="font-semibold text-slate-900">
                  ₹{plan?.price_monthly?.toLocaleString()}/mo
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Zap className="h-10 w-10 text-black mx-auto mb-3 opacity-60" />
              <p className="text-slate-500 mb-4">Upgrade to unlock premium features like advanced analytics, priority leads, and more.</p>
              <Button className="shadow-md">
                View Plans <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Plans */}
      {allPlans && allPlans.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-slate-900">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allPlans.map((p) => (
              <Card key={p.id} className={`border shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden ${
                p.tier === 'premium' ? 'border-black ring-2 ring-black shadow-lg shadow-black/10' : 'border-slate-100'
              }`}>
                <CardContent className="p-6">
                  {p.tier === 'premium' && (
                    <Badge className="bg-black text-[#D4FF00] mb-3">Most Popular</Badge>
                  )}
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{p.name}</h3>
                  <p className="text-sm text-slate-500 mb-4">{p.description}</p>
                  <div className="mb-6">
                    <span className="text-3xl font-extrabold text-slate-900">₹{p.price_monthly?.toLocaleString()}</span>
                    <span className="text-slate-500">/month</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="text-sm text-slate-600 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      Up to {p.max_courses} courses
                    </li>
                    <li className="text-sm text-slate-600 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      Up to {p.max_photos} photos
                    </li>
                    <li className="text-sm text-slate-600 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      {p.max_leads_per_month} leads/month
                    </li>
                  </ul>
                  <Button className={`w-full ${
                    plan?.id === p.id 
                      ? 'bg-slate-100 text-slate-500 cursor-not-allowed border border-slate-200' 
                      : ''
                  }`} disabled={plan?.id === p.id} variant={plan?.id === p.id ? "outline" : "default"}>
                    {plan?.id === p.id ? 'Current Plan' : 'Select Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
