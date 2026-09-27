import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Eye, Pencil, Trash2, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatDistanceToNow } from 'date-fns';
import { AdFormDialog } from '@/components/admin/ad-form-dialog';

export const metadata: Metadata = { title: 'Advertisement Campaigns' };

export default async function AdminAdsPage() {
  const supabase = await createServerSupabaseClient();

  const { data: ads } = await supabase
    .from('advertisements')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Advertisements</h1>
          <p className="text-slate-500 mt-1">Manage banner ads, sponsored colleges, and featured listings.</p>
        </div>
        <AdFormDialog>
          <Button className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </AdFormDialog>
      </div>

      <Card className="border-0 shadow-sm shadow-slate-200/50">
        <CardContent className="p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search advertisements..." className="pl-9 border-slate-200 focus-visible:ring-indigo-500" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ads && ads.length > 0 ? ads.map((ad) => (
          <Card key={ad.id} className="border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
            <div className="aspect-video bg-slate-100 relative overflow-hidden">
              {ad.image_url ? (
                <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-slate-300" />
                </div>
              )}
              <Badge className={`absolute top-3 right-3 ${ad.is_active ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'}`}>
                {ad.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <CardContent className="p-5">
              <h3 className="font-bold text-slate-900 mb-1 group-hover:text-[#bce600] transition-colors">{ad.title}</h3>
              <p className="text-xs text-slate-500 mb-3">
                Position: <span className="font-medium text-slate-700">{ad.position}</span>
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                <span><Eye className="h-3 w-3 inline mr-1" />{ad.impressions.toLocaleString()} views</span>
                <span><ExternalLink className="h-3 w-3 inline mr-1" />{ad.clicks.toLocaleString()} clicks</span>
              </div>
              <div className="flex items-center gap-2">
                <AdFormDialog ad={ad}>
                  <Button variant="outline" size="sm" className="flex-1"><Pencil className="h-3 w-3 mr-1" /> Edit Campaign</Button>
                </AdFormDialog>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="col-span-full p-12 text-center text-slate-500">
            <ImageIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-900 mb-1">No advertisements yet</p>
            <p className="text-sm">Create your first ad campaign to reach more students.</p>
          </div>
        )}
      </div>
    </div>
  );
}
