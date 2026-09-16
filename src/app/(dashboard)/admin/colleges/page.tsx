import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Pencil, Eye, Ban, Building2 } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatDistanceToNow } from 'date-fns';

export const metadata: Metadata = { title: 'Colleges Management' };

export default async function AdminCollegesPage() {
  const supabase = await createServerSupabaseClient();
  
  // Fetch colleges
  const { data: colleges } = await supabase
    .from('colleges')
    .select('*, cities(name)')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Colleges</h1>
          <p className="text-slate-500 mt-1">Manage all registered colleges on the platform.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200">
          <Plus className="h-4 w-4 mr-2" />
          Add College
        </Button>
      </div>

      <Card className="border-0 shadow-sm shadow-slate-200/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search colleges..." className="pl-9 border-slate-200 focus-visible:ring-indigo-500" />
            </div>
            <select className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all">
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="pending_review">Pending Review</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm shadow-slate-200/50 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="p-4 font-medium text-slate-500">College</th>
                  <th className="p-4 font-medium text-slate-500">City</th>
                  <th className="p-4 font-medium text-slate-500">Status</th>
                  <th className="p-4 font-medium text-slate-500">Added</th>
                  <th className="p-4 font-medium text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {colleges && colleges.length > 0 ? (
                  colleges.map((college) => (
                    <tr key={college.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-indigo-600" />
                          </div>
                          <span className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {college.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">
                        {/* @ts-ignore */}
                        {college.cities?.name || 'Unknown'}
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className={`
                          ${college.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                            college.status === 'pending_review' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                            'bg-slate-50 text-slate-700 border-slate-200'}
                        `}>
                          {college.status?.replace('_', ' ') || 'Unknown'}
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-500">
                        {formatDistanceToNow(new Date(college.created_at), { addSuffix: true })}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600"><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600"><Ban className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      <Building2 className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                      <p>No colleges found.</p>
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
