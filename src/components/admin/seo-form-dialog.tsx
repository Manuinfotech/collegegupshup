'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { upsertSeoEntry, deleteSeoEntry } from '@/lib/actions/admin-seo';
import { Trash2 } from 'lucide-react';

export function SeoFormDialog({ entry, children }: { entry?: any; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    if (entry?.id) {
      formData.append('id', entry.id);
    }

    const result = await upsertSeoEntry(formData);
    
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setOpen(false);
    }
  }

  async function handleDelete() {
    if (!entry?.id || !confirm('Are you sure you want to delete this SEO entry?')) return;
    setLoading(true);
    const result = await deleteSeoEntry(entry.id);
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
          <DialogTitle>{entry ? 'Edit SEO Entry' : 'Add SEO Entry'}</DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="bg-rose-50 text-rose-600 p-3 rounded-md text-sm border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="page_type">Page Type <span className="text-red-500">*</span></Label>
              <select 
                id="page_type" 
                name="page_type" 
                required 
                defaultValue={entry?.page_type || 'college'}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="college">College</option>
                <option value="blog">Blog</option>
                <option value="course">Course</option>
                <option value="exam">Exam</option>
                <option value="category">Category</option>
                <option value="static">Static Page</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="page_identifier">Page Identifier / Slug <span className="text-red-500">*</span></Label>
              <Input id="page_identifier" name="page_identifier" required defaultValue={entry?.page_identifier} placeholder="e.g. iit-bombay" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_title">Meta Title</Label>
            <Input id="meta_title" name="meta_title" defaultValue={entry?.meta_title} placeholder="Title for Search Engines..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea id="meta_description" name="meta_description" defaultValue={entry?.meta_description} placeholder="Short description for SERP..." className="h-20" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="canonical_url">Canonical URL</Label>
              <Input id="canonical_url" name="canonical_url" defaultValue={entry?.canonical_url} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="og_image">OG Image URL</Label>
              <Input id="og_image" name="og_image" defaultValue={entry?.og_image} placeholder="https://..." />
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-4 mt-2">
            <Label htmlFor="schema_markup">Schema Markup (JSON-LD)</Label>
            <Textarea 
              id="schema_markup" 
              name="schema_markup" 
              defaultValue={entry?.schema_markup ? JSON.stringify(entry.schema_markup, null, 2) : ''} 
              placeholder='{ "@context": "https://schema.org", "@type": "CollegeOrUniversity" }' 
              className="h-40 font-mono text-xs"
            />
          </div>

          <DialogFooter className="pt-4 flex justify-between items-center sm:justify-between">
            {entry?.id ? (
              <Button type="button" variant="ghost" onClick={handleDelete} className="text-red-600 hover:text-red-700 hover:bg-red-50" disabled={loading}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" className="" disabled={loading}>
                {loading ? 'Saving...' : 'Save SEO Entry'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
