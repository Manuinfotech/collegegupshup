'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { upsertBlog } from '@/lib/actions/admin-blogs';
import { Loader2, Upload, X, ImageIcon } from 'lucide-react';
import Image from 'next/image';

export function BlogFormDialog({ blog, children }: { blog?: any; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [coverImage, setCoverImage] = useState(blog?.cover_image_url || '');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', 'blogs');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setCoverImage(data.url);
      } else {
        setError(data.error || 'Failed to upload image');
      }
    } catch (err) {
      setError('An error occurred during upload');
    } finally {
      setUploadingImage(false);
    }
  }

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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto z-[9999] p-6 sm:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold text-slate-900">{blog ? 'Edit Blog Post' : 'Write New Blog Post'}</DialogTitle>
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

          <div className="space-y-3">
            <Label>Featured Image</Label>
            <input type="hidden" name="cover_image_url" value={coverImage} />
            
            {coverImage ? (
              <div className="relative h-48 w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200 group">
                <Image src={coverImage} alt="Cover Preview" fill className="object-cover" unoptimized />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setCoverImage('')}
                    className="shadow-xl"
                  >
                    <X className="h-4 w-4 mr-2" /> Remove Image
                  </Button>
                </div>
              </div>
            ) : (
              <div 
                className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/50 transition-colors rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadingImage ? (
                  <div className="flex flex-col items-center text-indigo-500">
                    <Loader2 className="h-8 w-8 animate-spin mb-2" />
                    <span className="text-sm font-medium">Uploading image...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-slate-500">
                    <div className="h-12 w-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                      <Upload className="h-5 w-5 text-indigo-500" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">Click to upload featured image</span>
                    <span className="text-xs text-slate-400 mt-1">JPG, PNG or WebP (max 5MB)</span>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/jpeg,image/png,image/webp" 
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
              </div>
            )}
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

          <DialogFooter className="pt-6 border-t border-slate-100 mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-full px-6">Cancel</Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 shadow-sm" disabled={loading || uploadingImage}>
              {loading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
              ) : 'Save Post'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
