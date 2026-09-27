import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, DollarSign, Wallet } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'Fee Structure Management' };

export default async function CollegeFeesPage() {
  const supabase = await createServerSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: collegeUser } = await supabase
    .from('college_users')
    .select('college_id')
    .eq('user_id', user.id)
    .single();

  const collegeId = collegeUser?.college_id;
  let fees: any[] = [];

  if (collegeId) {
    const { data } = await supabase
      .from('fees')
      .select('*, courses(name)')
      .eq('college_id', collegeId)
      .order('fee_year', { ascending: false });
    if (data) fees = data;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Fee Structure</h1>
          <p className="text-slate-500 mt-1">Manage tuition and additional fees for your courses.</p>
        </div>
        <Button className="shadow-sm" disabled={!collegeId}>
          <Plus className="h-4 w-4 mr-2" />
          Add Fee Structure
        </Button>
      </div>

      {!collegeId && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-center gap-3">
          <Wallet className="h-5 w-5" />
          <span>You must be linked to a college to manage fees.</span>
        </div>
      )}

      <Card className="border-0 shadow-sm shadow-slate-200/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search by course name..." className="pl-9 border-slate-200 focus-visible:ring-indigo-500" disabled={!collegeId} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm shadow-slate-200/50 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="p-4 font-medium text-slate-500">Course</th>
                  <th className="p-4 font-medium text-slate-500">Year</th>
                  <th className="p-4 font-medium text-slate-500 text-right">Tuition Fee</th>
                  <th className="p-4 font-medium text-slate-500 text-right">Hostel Fee</th>
                  <th className="p-4 font-medium text-slate-500 text-right">Total Fee</th>
                  <th className="p-4 font-medium text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fees.length > 0 ? (
                  fees.map((fee) => (
                    <tr key={fee.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-medium text-slate-900">
                        {/* @ts-ignore */}
                        {fee.courses?.name || 'Unknown Course'}
                      </td>
                      <td className="p-4 text-slate-600">{fee.fee_year}</td>
                      <td className="p-4 text-right text-slate-600">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(fee.tuition_fee || 0)}
                      </td>
                      <td className="p-4 text-right text-slate-600">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(fee.hostel_fee || 0)}
                      </td>
                      <td className="p-4 text-right font-semibold text-slate-900">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(fee.total_fee || 0)}
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">Edit</Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      <DollarSign className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                      <p>No fee structures added yet.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
