import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Check, Star, Zap, Shield } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { PlanFormDialog } from '@/components/admin/plan-form-dialog';

export const metadata: Metadata = { title: 'Subscription Plans' };

export default async function AdminPlansPage() {
  const supabase = await createServerSupabaseClient();
  
  const { data: plans } = await supabase
    .from('plans')
    .select('*')
    .order('price_monthly', { ascending: true });

  const getTierIcon = (tier: string) => {
    switch(tier?.toLowerCase()) {
      case 'premium': return <Star className="h-6 w-6 text-black" />;
      case 'standard': return <Zap className="h-6 w-6 text-black" />;
      default: return <Shield className="h-6 w-6 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Subscription Plans</h1>
          <p className="text-slate-500 mt-1">Manage pricing tiers and feature access for colleges.</p>
        </div>
        <PlanFormDialog>
          <Button className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Create New Plan
          </Button>
        </PlanFormDialog>
      </div>

      {plans && plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {plans.map((plan) => (
            <Card key={plan.id} className={`border-0 shadow-sm transition-transform hover:-translate-y-1 ${plan.tier?.toLowerCase() === 'premium' ? 'ring-2 ring-black shadow-lg shadow-black/10' : 'shadow-slate-200/50'}`}>
              {plan.tier?.toLowerCase() === 'premium' && (
                <div className="bg-black text-[#D4FF00] text-xs font-bold text-center py-1 uppercase tracking-wider rounded-t-xl">
                  Most Popular
                </div>
              )}
              <CardHeader className="p-6 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center">
                    {getTierIcon(plan.tier)}
                  </div>
                  <Badge variant={plan.is_active ? 'default' : 'secondary'} className={plan.is_active ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200' : ''}>
                    {plan.is_active ? 'Active' : 'Draft'}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">{plan.name}</CardTitle>
                <CardDescription className="h-10 text-sm mt-2">{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="p-6 pt-0 space-y-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(plan.price_monthly || 0)}
                  </span>
                  <span className="text-slate-500 font-medium">/month</span>
                </div>
                
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    Max Courses: <strong className="text-slate-900 ml-1">{plan.max_courses || 'Unlimited'}</strong>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    Max Leads: <strong className="text-slate-900 ml-1">{plan.max_leads_per_month || 'Unlimited'} /mo</strong>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    Max Photos: <strong className="text-slate-900 ml-1">{plan.max_photos || 'Unlimited'}</strong>
                  </li>
                  {Array.isArray(plan.features) && plan.features.slice(0, 3).map((feat: any, idx: number) => (
                    <li key={idx} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <PlanFormDialog plan={plan}>
                  <Button variant={plan.tier?.toLowerCase() === 'premium' ? 'default' : 'outline'} className="w-full">
                    Edit Plan
                  </Button>
                </PlanFormDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-sm shadow-slate-200/50 mt-8">
          <CardContent className="p-12 text-center text-slate-500">
            <Shield className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No plans configured</h3>
            <p className="mb-6">You need to set up subscription plans for colleges to enroll in.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
