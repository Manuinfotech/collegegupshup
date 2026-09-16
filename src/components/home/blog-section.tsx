import Link from 'next/link';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const blogPosts = [
  {
    id: 1,
    title: 'How to Choose the Right Engineering College in 2026',
    excerpt: 'A comprehensive guide to evaluating placements, faculty, and campus life before making your big decision.',
    category: 'Admissions',
    date: 'July 2, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop',
    color: 'indigo'
  },
  {
    id: 2,
    title: 'Top 10 Emerging Tech Careers You Should Know About',
    excerpt: 'From AI Prompt Engineering to Quantum Computing, discover the careers shaping the next decade.',
    category: 'Career Guide',
    date: 'June 28, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop',
    color: 'emerald'
  },
  {
    id: 3,
    title: 'MBA vs PGDM: Which One Should You Choose?',
    excerpt: 'Breaking down the differences, ROI, and industry acceptance of these two popular management programs.',
    category: 'Management',
    date: 'June 25, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop',
    color: 'rose'
  },
  {
    id: 4,
    title: 'Mastering the CAT Exam: Tips from 99 Percentilers',
    excerpt: 'Secret strategies and study plans used by top scorers to crack one of India\'s toughest exams.',
    category: 'Exams',
    date: 'June 20, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
    color: 'amber'
  },
  {
    id: 5,
    title: 'The Ultimate Guide to Education Loans in India',
    excerpt: 'Everything you need to know about interest rates, collateral, and repayment terms for studying in India or abroad.',
    category: 'Finance',
    date: 'June 15, 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop',
    color: 'blue'
  },
  {
    id: 6,
    title: 'Is a Gap Year Worth It? Pros and Cons',
    excerpt: 'Taking a year off to prepare for JEE or NEET? Read this before you make your final decision.',
    category: 'Student Life',
    date: 'June 10, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=800&auto=format&fit=crop',
    color: 'purple'
  },
  {
    id: 7,
    title: 'Top Medical Colleges with Lowest Fees',
    excerpt: 'A curated list of government and private medical institutions offering the best ROI in 2026.',
    category: 'Medical',
    date: 'June 5, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800&auto=format&fit=crop',
    color: 'teal'
  },
  {
    id: 8,
    title: 'Navigating College Placements: What HRs Really Want',
    excerpt: 'Insider tips from top recruiters on how to build your resume and ace the technical interview.',
    category: 'Placements',
    date: 'June 1, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop',
    color: 'orange'
  }
];

export function BlogSection() {
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
          {blogPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`}>
              <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${post.image})` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                  <Badge className="absolute bottom-4 left-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border-white/20">
                    {post.category}
                  </Badge>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-400 mt-auto pt-4 border-t border-gray-50">
                    <span>{post.date}</span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.readTime}
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
