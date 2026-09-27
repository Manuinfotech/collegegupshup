import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Video, Play, Trash2, ExternalLink } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

export const metadata: Metadata = { title: 'Video Gallery' };

export default async function CollegeVideosPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: collegeUser } = await supabase.from('college_users').select('college_id').eq('user_id', user.id).single();
  const collegeId = collegeUser?.college_id;

  let videos: any[] = [];
  if (collegeId) {
    const { data } = await supabase.from('videos').select('*').eq('college_id', collegeId).order('created_at', { ascending: false });
    videos = data || [];
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Videos</h1>
          <p className="text-slate-500 mt-1">Upload promotional videos and campus tours.</p>
        </div>
        <Button className="shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Video
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.length > 0 ? videos.map((video) => (
          <Card key={video.id} className="border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
            <div className="aspect-video bg-slate-100 relative overflow-hidden">
              {video.thumbnail_url ? (
                <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                  <Video className="h-12 w-12 text-slate-300" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all">
                <div className="h-14 w-14 rounded-full bg-white/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity group-hover:scale-100 scale-75">
                  <Play className="h-6 w-6 text-indigo-600 ml-1" />
                </div>
              </div>
            </div>
            <CardContent className="p-5">
              <h3 className="font-bold text-slate-900 mb-1 group-hover:text-[#bce600] transition-colors">{video.title}</h3>
              {video.category && <p className="text-xs text-slate-500 mb-3">{video.category}</p>}
              <div className="flex items-center gap-2">
                <a href={video.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full"><ExternalLink className="h-3 w-3 mr-1" /> Watch</Button>
                </a>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50"><Trash2 className="h-3 w-3" /></Button>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="col-span-full p-12 text-center text-slate-500">
            <Video className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-900 mb-1">No videos added</p>
            <p className="text-sm">Add campus tours and promotional videos for students.</p>
          </div>
        )}
      </div>
    </div>
  );
}
