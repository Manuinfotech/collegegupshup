import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Image as ImageIcon, Trash2 } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'Gallery Management' };

export default async function CollegeGalleryPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: collegeUser } = await supabase.from('college_users').select('college_id').eq('user_id', user.id).single();
  const collegeId = collegeUser?.college_id;

  let images: any[] = [];
  if (collegeId) {
    const { data } = await supabase.from('galleries').select('*').eq('college_id', collegeId).order('sort_order', { ascending: true });
    images = data || [];
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Photo Gallery</h1>
          <p className="text-slate-500 mt-1">Upload campus and event photos to showcase your institution.</p>
        </div>
        <Button className="shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Upload Photos
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.length > 0 ? images.map((img) => (
          <Card key={img.id} className="border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group relative">
            <div className="aspect-square bg-slate-100 relative overflow-hidden">
              <img src={img.image_url} alt={img.title || 'Gallery image'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button size="sm" variant="secondary" className="shadow-lg"><Trash2 className="h-3 w-3 mr-1" /> Remove</Button>
              </div>
            </div>
            {img.title && (
              <CardContent className="p-3">
                <p className="text-xs font-medium text-slate-700 truncate">{img.title}</p>
                {img.category && <p className="text-xs text-slate-400">{img.category}</p>}
              </CardContent>
            )}
          </Card>
        )) : (
          <div className="col-span-full p-12 text-center text-slate-500">
            <ImageIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-900 mb-1">No photos uploaded</p>
            <p className="text-sm">Upload campus photos to give students a virtual tour.</p>
          </div>
        )}
      </div>
    </div>
  );
}
