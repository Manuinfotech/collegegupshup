import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, TrendingUp, Briefcase } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'Placement Records' };

export default async function CollegePlacementsPage() {
  const supabase = await createServerSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: collegeUser } = await supabase
    .from('college_users')
    .select('college_id')
    .eq('user_id', user.id)
    .single();

  const collegeId = collegeUser?.college_id;
  let placements: any[] = [];

  if (collegeId) {
    const { data } = await supabase
      .from('placements')
      .select('*, courses(name)')
      .eq('college_id', collegeId)
      .order('year', { ascending: false });
    if (data) placements = data;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Placement Records</h1>
          <p className="text-slate-500 mt-1">Manage placement statistics and top recruiters.</p>
        </div>
        <Button className="shadow-sm" disabled={!collegeId}>
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </Button>
      </div>

      {!collegeId && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-center gap-3">
          <TrendingUp className="h-5 w-5" />
          <span>You must be linked to a college to manage placements.</span>
        </div>
      )}

      <Card className="border-0 shadow-sm shadow-slate-200/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search by course or year..." className="pl-9 border-slate-200 focus-visible:ring-indigo-500" disabled={!collegeId} />
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
                  <th className="p-4 font-medium text-slate-500 text-right">Highest Package</th>
                  <th className="p-4 font-medium text-slate-500 text-right">Average Package</th>
                  <th className="p-4 font-medium text-slate-500 text-right">Placement %</th>
                  <th className="p-4 font-medium text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {placements.length > 0 ? (
                  placements.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-medium text-slate-900">
                        {/* @ts-ignore */}
                        {p.courses?.name || 'Unknown Course'}
                      </td>
                      <td className="p-4 text-slate-600">{p.year}</td>
                      <td className="p-4 text-right font-semibold text-emerald-600">
                        {p.highest_package ? `${p.highest_package} LPA` : '-'}
                      </td>
                      <td className="p-4 text-right text-slate-600">
                        {p.average_package ? `${p.average_package} LPA` : '-'}
                      </td>
                      <td className="p-4 text-right text-slate-600">
                        {p.placement_percentage ? `${p.placement_percentage}%` : '-'}
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">Edit</Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      <Briefcase className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                      <p>No placement records added yet.</p>
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
