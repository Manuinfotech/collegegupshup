import Link from 'next/link';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

import { formatDistanceToNow, format } from 'date-fns';

export function BlogSection({ blogs = [] }: { blogs?: any[] }) {
  if (!blogs || blogs.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Badge className="bg-indigo-50 text-indigo-600 border-indigo-100 mb-4 px-4 py-1.5 rounded-full shadow-sm">
            <BookOpen className="h-4 w-4 mr-2" />
            Insights & Guides
          </Badge>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Latest News & Articles</h2>
          <p className="text-gray-500 mt-4 text-xl max-w-2xl mx-auto">Expert advice, exam strategies, and college reviews to help you make informed decisions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogs.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug || post.id}`}>
              <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col cursor-pointer">
                <div className="relative h-48 overflow-hidden bg-slate-100 flex items-center justify-center">
                  {post.cover_image_url ? (
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${post.cover_image_url})` }} />
                  ) : (
                    <BookOpen className="h-12 w-12 text-slate-300" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                  <Badge className="absolute bottom-4 left-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border-white/20">
                    {post.is_featured ? 'Featured' : 'Article'}
                  </Badge>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-3 flex-1">
                    {post.excerpt || 'Read the full article...'}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-400 mt-auto pt-4 border-t border-gray-50">
                    <span>{format(new Date(post.published_at || post.created_at), 'MMMM d, yyyy')}</span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      5 min read
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/blog">
            <button className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-indigo-600 transition-all duration-200 bg-indigo-50 border border-transparent rounded-full hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
              View All Articles
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
