import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Plus, FileText, Calendar, Eye } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatDistanceToNow, format } from 'date-fns';
import { BlogFormDialog } from '@/components/admin/blog-form-dialog';

export const metadata: Metadata = { title: 'Blog Management' };

export default async function AdminBlogsPage() {
  const supabase = await createServerSupabaseClient();
  
  // Fetch blogs with joined author (user)
  const { data: blogs } = await supabase
    .from('blogs')
    .select('*, users(full_name)')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Blog Posts</h1>
          <p className="text-slate-500 mt-1">Manage articles, news, and SEO content.</p>
        </div>
        <BlogFormDialog>
          <Button className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Write Post
          </Button>
        </BlogFormDialog>
      </div>

      <Card className="border-0 shadow-sm shadow-slate-200/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search articles..." className="pl-9 border-slate-200 focus-visible:ring-indigo-500" />
            </div>
            <select className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white text-slate-700 outline-none focus:border-indigo-500 transition-all">
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {blogs && blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Card key={blog.id} className="border-0 shadow-sm shadow-slate-200/50 hover:shadow-md transition-shadow group overflow-hidden flex flex-col">
              <div className="h-48 bg-slate-100 relative overflow-hidden">
                {blog.cover_image_url ? (
                  <img src={blog.cover_image_url} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <FileText className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  {blog.is_featured && <Badge className="bg-amber-500 hover:bg-amber-600 border-0">Featured</Badge>}
                  <Badge variant="secondary" className={`
                    ${blog.status === 'published' ? 'bg-emerald-500 text-white border-0 hover:bg-emerald-600' : 'bg-slate-800 text-white border-0 hover:bg-slate-900'}
                  `}>
                    {blog.status?.toUpperCase() || 'DRAFT'}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-[#bce600] transition-colors">
                  <BlogFormDialog blog={blog}>
                    <button className="text-left hover:underline focus:outline-none">{blog.title}</button>
                  </BlogFormDialog>
                </h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">
                  {blog.excerpt || 'No description provided.'}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-auto pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDistanceToNow(new Date(blog.created_at), { addSuffix: true })}
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-slate-700">
                    {/* @ts-ignore */}
                    {blog.users?.full_name || 'Admin'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-sm shadow-slate-200/50">
          <CardContent className="p-12 text-center text-slate-500">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No blog posts found</h3>
            <p className="mb-6">Start writing to improve your platform SEO and engage students.</p>
            <BlogFormDialog>
              <Button className="shadow-sm">
                <Plus className="h-4 w-4 mr-2" />
                Write Your First Post
              </Button>
            </BlogFormDialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
