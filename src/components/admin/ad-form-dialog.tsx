'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { upsertAd, deleteAd } from '@/lib/actions/admin-ads';
import { Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export function AdFormDialog({ ad, children }: { ad?: any; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [adType, setAdType] = useState(ad?.script_code ? 'adsense' : 'image');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    if (ad?.id) {
      formData.append('id', ad.id);
    }
    
    // Add adType to formData
    formData.append('ad_type', adType);
    
    // Handle switch value
    const isActive = formData.get('is_active') === 'on';
    formData.set('is_active', isActive.toString());

    const result = await upsertAd(formData);
    
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setOpen(false);
    }
  }

  async function handleDelete() {
    if (!ad?.id || !confirm('Are you sure you want to delete this Advertisement?')) return;
    setLoading(true);
    const result = await deleteAd(ad.id);
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto z-[9999]">
        <DialogHeader>
          <DialogTitle>{ad ? 'Edit Advertisement' : 'Create Campaign'}</DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="bg-rose-50 text-rose-600 p-3 rounded-md text-sm border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Campaign Title <span className="text-red-500">*</span></Label>
            <Input id="title" name="title" required defaultValue={ad?.title} placeholder="e.g. Summer Admissions 2026" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="position">Placement Location <span className="text-red-500">*</span></Label>
            <select 
              id="position" 
              name="position" 
              required 
              defaultValue={ad?.position || 'homepage_hero'}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="homepage_hero">Main Hero Banner (Homepage)</option>
              <option value="homepage_sidebar">Homepage Sidebar</option>
              <option value="homepage_content">Homepage Content (Inline)</option>
              <option value="blog_sidebar">Blog Sidebar</option>
              <option value="blog_content">Blog Content (Inline)</option>
              <option value="college_sidebar">College Profile Sidebar</option>
            </select>
          </div>

          <div className="space-y-2 border-b border-slate-100 pb-4 mb-4">
            <Label>Advertisement Type</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  checked={adType === 'image'} 
                  onChange={() => setAdType('image')} 
                  className="text-indigo-600"
                />
                <span className="text-sm font-medium">Image Ad (Internal)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  checked={adType === 'adsense'} 
                  onChange={() => setAdType('adsense')} 
                  className="text-indigo-600"
                />
                <span className="text-sm font-medium">Google AdSense / Custom Script</span>
              </label>
            </div>
          </div>

          {adType === 'image' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL <span className="text-red-500">*</span></Label>
                <Input id="image_url" name="image_url" required={adType === 'image'} defaultValue={ad?.image_url} placeholder="https://..." />
                <p className="text-xs text-slate-500">For Hero Banners, use 1200x400px. For sidebars, use 300x250px or 300x600px.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="link_url">Target Link URL</Label>
                <Input id="link_url" name="link_url" defaultValue={ad?.link_url} placeholder="https://..." />
              </div>
            </>
          )}

          {adType === 'adsense' && (
            <div className="space-y-2">
              <Label htmlFor="script_code">AdSense Snippet / Custom HTML <span className="text-red-500">*</span></Label>
              <Textarea 
                id="script_code" 
                name="script_code" 
                required={adType === 'adsense'}
                defaultValue={ad?.script_code} 
                placeholder='<script async src="https://pagead2.googlesyndication.com/..."></script>' 
                className="h-32 font-mono text-xs"
              />
            </div>
          )}

          <div className="flex items-center space-x-2 pt-2">
            <Switch id="is_active" name="is_active" defaultChecked={ad ? ad.is_active : true} />
            <Label htmlFor="is_active">Campaign is Active</Label>
          </div>

          <DialogFooter className="pt-4 flex justify-between items-center sm:justify-between">
            {ad?.id ? (
              <Button type="button" variant="ghost" onClick={handleDelete} className="text-red-600 hover:text-red-700 hover:bg-red-50" disabled={loading}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={loading}>
                {loading ? 'Saving...' : 'Save Campaign'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
