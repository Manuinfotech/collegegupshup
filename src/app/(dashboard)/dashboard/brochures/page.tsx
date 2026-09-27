import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Download, FileText, Trash2, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

export const metadata: Metadata = { title: 'Brochure Management' };

export default async function CollegeBrochuresPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: collegeUser } = await supabase.from('college_users').select('college_id').eq('user_id', user.id).single();
  const collegeId = collegeUser?.college_id;

  let brochures: any[] = [];
  if (collegeId) {
    const { data } = await supabase.from('brochures').select('*').eq('college_id', collegeId).order('created_at', { ascending: false });
    brochures = data || [];
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Brochures</h1>
          <p className="text-slate-500 mt-1">Upload course brochures and prospectus PDFs for students.</p>
        </div>
        <Button className="shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Upload Brochure
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brochures.length > 0 ? brochures.map((brochure) => (
          <Card key={brochure.id} className="border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
            <CardContent className="p-6">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 ring-1 ring-blue-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <FileText className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1 group-hover:text-[#bce600] transition-colors">{brochure.title}</h3>
              {brochure.file_size && (
                <p className="text-xs text-slate-500 mb-3">{(brochure.file_size / 1024 / 1024).toFixed(1)} MB</p>
              )}
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                <Download className="h-3 w-3" />
                <span>{brochure.downloads} downloads</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex-1"><Eye className="h-3 w-3 mr-1" /> View</Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50"><Trash2 className="h-3 w-3" /></Button>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="col-span-full p-12 text-center text-slate-500">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-900 mb-1">No brochures uploaded</p>
            <p className="text-sm">Upload your first brochure to share with prospective students.</p>
          </div>
        )}
      </div>
    </div>
  );
}
