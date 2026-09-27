'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { upsertPlan } from '@/lib/actions/admin-plans';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';

export function PlanFormDialog({ plan, children }: { plan?: any; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Explicitly handle checkboxes which don't show up in FormData if unchecked
    data.is_active = formData.get('is_active') ? 'true' : 'false';

    if (plan?.id) {
      data.id = plan.id;
    }

    const result = await upsertPlan(data);
    
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)} className="inline-block cursor-pointer">
        {children}
      </div>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto z-[9999]">
        <DialogHeader>
          <DialogTitle>{plan ? 'Edit Plan' : 'Create New Plan'}</DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="bg-rose-50 text-rose-600 p-3 rounded-md text-sm border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Plan Name <span className="text-red-500">*</span></Label>
              <Input id="name" name="name" required defaultValue={plan?.name} placeholder="e.g. Premium Plan" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tier">Tier Type <span className="text-red-500">*</span></Label>
              <select 
                id="tier" 
                name="tier" 
                required 
                defaultValue={plan?.tier || 'Free'}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Free">Free</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={plan?.description} placeholder="Short description of who this plan is for" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price_monthly">Monthly Price (₹) <span className="text-red-500">*</span></Label>
              <Input id="price_monthly" name="price_monthly" type="number" required defaultValue={plan?.price_monthly || 0} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price_yearly">Yearly Price (₹)</Label>
              <Input id="price_yearly" name="price_yearly" type="number" defaultValue={plan?.price_yearly || 0} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="max_courses" className="text-xs">Max Courses (-1 for unlimited)</Label>
              <Input id="max_courses" name="max_courses" type="number" defaultValue={plan?.max_courses ?? -1} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_leads_per_month" className="text-xs">Max Leads/mo (-1 for unlim)</Label>
              <Input id="max_leads_per_month" name="max_leads_per_month" type="number" defaultValue={plan?.max_leads_per_month ?? -1} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_photos" className="text-xs">Max Photos (-1 for unlimited)</Label>
              <Input id="max_photos" name="max_photos" type="number" defaultValue={plan?.max_photos ?? -1} />
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-4 mt-2">
            <Label htmlFor="features">Features (comma separated)</Label>
            <Textarea 
              id="features" 
              name="features" 
              defaultValue={Array.isArray(plan?.features) ? plan.features.join(', ') : ''} 
              placeholder="Priority Search Ranking, Advanced Analytics, Dedicated Account Manager"
            />
          </div>

          <div className="flex items-center space-x-2 border-t border-slate-100 pt-4 mt-2">
            <Checkbox id="is_active" name="is_active" defaultChecked={plan ? plan.is_active : true} />
            <Label htmlFor="is_active" className="cursor-pointer">Plan is Active (visible to colleges)</Label>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="" disabled={loading}>
              {loading ? 'Saving...' : 'Save Plan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
