import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatDistanceToNow, format } from 'date-fns';
import { Clock, Calendar, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: blog } = await supabase.from('blogs').select('title, excerpt, cover_image_url').or(`slug.eq.${slug},id.eq.${slug}`).single();
  
  if (!blog) return { title: 'Blog Not Found' };
  
  return {
    title: `${blog.title} - College Gupshup Blog`,
    description: blog.excerpt || `Read ${blog.title} on College Gupshup Blog.`,
    openGraph: {
      images: blog.cover_image_url ? [blog.cover_image_url] : [],
    }
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  
  // Try to match by slug or id (since we passed id as fallback in frontend)
  const { data: blog } = await supabase
    .from('blogs')
    .select('*, users(full_name)')
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .single();

  if (!blog) {
    notFound();
  }

  // Fetch recent colleges for sidebar
  const { data: recentCollegesData } = await supabase
    .from('colleges')
    .select('id, name, logo_url, cities(name), states(name)')
    .eq('is_active', true)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(5);

  const recentColleges = recentCollegesData || [];

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <nav className="flex items-center text-sm text-slate-500 mb-8 font-medium">
          <Link href="/" className="hover:text-[#bce600] transition-colors">Home</Link>
          <span className="mx-2 text-slate-300">/</span>
          <Link href="/blog" className="hover:text-[#bce600] transition-colors">Blog</Link>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-slate-900 truncate max-w-[200px] md:max-w-none">{blog.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <article className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            {blog.cover_image_url && (
              <div className="w-full h-[400px] relative">
                <img src={blog.cover_image_url} alt={blog.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <Badge className="absolute bottom-6 left-6 bg-indigo-600 hover:bg-indigo-700 text-white border-0 px-3 py-1 text-sm shadow-lg">
                  {blog.is_featured ? 'Featured' : 'Article'}
                </Badge>
              </div>
            )}
            
            <div className="p-8 md:p-12">
              <header className="mb-10">
                <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
                  {blog.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 border-y border-slate-100 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 text-indigo-600 font-bold">
                      {/* @ts-ignore */}
                      {blog.users?.full_name?.charAt(0) || 'A'}
                    </div>
                    <span className="font-medium text-slate-700">
                      {/* @ts-ignore */}
                      {blog.users?.full_name || 'Admin'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{format(new Date(blog.published_at || blog.created_at), 'MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>5 min read</span>
                  </div>
                </div>
              </header>

              <div 
                className="prose prose-lg md:prose-xl prose-slate max-w-none prose-headings:font-bold prose-a:text-indigo-600 prose-img:rounded-xl prose-img:shadow-md"
                dangerouslySetInnerHTML={{ __html: blog.content }} 
              />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Recent Colleges</h3>
              <div className="space-y-6">
                {recentColleges.map((college) => (
                  <Link key={college.id} href={`/colleges/${college.id}`} className="group flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
                      {college.logo_url ? (
                        <img src={college.logo_url} alt={college.name} className="w-full h-full object-contain p-2" />
                      ) : (
                        <span className="text-lg font-bold text-slate-400">{college.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-[#bce600] transition-colors line-clamp-2 text-sm">
                        {college.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        {/* @ts-ignore */}
                        {college.cities?.name}, {college.states?.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              
              <Link href="/colleges" className="mt-8 flex items-center justify-center w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium rounded-xl transition-colors border border-slate-200 text-sm">
                View All Colleges
                <ArrowRight className="w-4 h-4 ml-2 text-slate-400" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
