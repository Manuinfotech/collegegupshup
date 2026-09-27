'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { upsertBlog } from '@/lib/actions/admin-blogs';

export function BlogFormDialog({ blog, children }: { blog?: any; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    if (blog?.id) {
      formData.append('id', blog.id);
    }
    
    // Explicitly handle checkboxes
    formData.set('is_featured', formData.get('is_featured') ? 'true' : 'false');

    const result = await upsertBlog(formData);
    
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
          <DialogTitle>{blog ? 'Edit Blog Post' : 'Write New Blog Post'}</DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="bg-rose-50 text-rose-600 p-3 rounded-md text-sm border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
            <Input id="title" name="title" required defaultValue={blog?.title} placeholder="Enter blog title" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea id="excerpt" name="excerpt" defaultValue={blog?.excerpt} placeholder="Short summary for the blog card..." className="h-20" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover_image_url">Featured Image URL</Label>
            <Input id="cover_image_url" name="cover_image_url" defaultValue={blog?.cover_image_url} placeholder="https://..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content <span className="text-red-500">*</span></Label>
            <Textarea 
              id="content" 
              name="content" 
              required 
              defaultValue={blog?.content} 
              placeholder="Write your blog content here (Supports HTML/Markdown in frontend)..." 
              className="h-48"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select 
                id="status" 
                name="status" 
                defaultValue={blog?.status || 'draft'}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2 pt-8">
              <Checkbox id="is_featured" name="is_featured" defaultChecked={blog?.is_featured} />
              <Label htmlFor="is_featured" className="cursor-pointer">Mark as Featured Post</Label>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={loading}>
              {loading ? 'Saving...' : 'Save Post'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
