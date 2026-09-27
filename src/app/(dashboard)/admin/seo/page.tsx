import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Pencil, Trash2, Globe, TrendingUp } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatDistanceToNow } from 'date-fns';
import { SeoFormDialog } from '@/components/admin/seo-form-dialog';

export const metadata: Metadata = { title: 'SEO Management' };

export default async function AdminSeoPage() {
  const supabase = await createServerSupabaseClient();

  const { data: seoEntries } = await supabase
    .from('seo_meta')
    .select('*')
    .order('updated_at', { ascending: false });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">SEO Management</h1>
          <p className="text-slate-500 mt-1">Manage meta titles, descriptions, and schema markup for all pages.</p>
        </div>
        <SeoFormDialog>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200">
            <Plus className="h-4 w-4 mr-2" />
            Add SEO Entry
          </Button>
        </SeoFormDialog>
      </div>

      <Card className="border-0 shadow-sm shadow-slate-200/50">
        <CardContent className="p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search by page type or identifier..." className="pl-9 border-slate-200 focus-visible:ring-indigo-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm shadow-slate-200/50 overflow-hidden">
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="p-4 font-medium text-slate-500">Page</th>
                <th className="p-4 font-medium text-slate-500">Meta Title</th>
                <th className="p-4 font-medium text-slate-500">Description</th>
                <th className="p-4 font-medium text-slate-500">Updated</th>
                <th className="p-4 font-medium text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {seoEntries && seoEntries.length > 0 ? seoEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                        <Globe className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">{entry.page_type}</Badge>
                        <p className="text-xs text-slate-500 mt-0.5">{entry.page_identifier}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-900 font-medium max-w-[200px] truncate">{entry.meta_title || '—'}</td>
                  <td className="p-4 text-slate-500 max-w-[250px] truncate text-xs">{entry.meta_description || '—'}</td>
                  <td className="p-4 text-slate-500 text-xs">{formatDistanceToNow(new Date(entry.updated_at), { addSuffix: true })}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <SeoFormDialog entry={entry}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600"><Pencil className="h-4 w-4" /></Button>
                      </SeoFormDialog>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    <TrendingUp className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-lg font-medium text-slate-900 mb-1">No SEO entries yet</p>
                    <p className="text-sm">Add meta data for your pages to improve search rankings.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
