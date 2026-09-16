import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog - Education News & Articles',
  description: 'Read latest education news, admission updates, exam notifications, and expert guidance on College Gupshup blog.',
};

const sampleBlogs = [
  {
    id: '1',
    title: 'Top 10 MBA Colleges in India 2025 - Complete Guide',
    slug: 'top-10-mba-colleges-india-2025',
    excerpt: 'A comprehensive guide to the best MBA colleges in India with fees, placements, and admission details.',
    cover_image_url: null,
    category: 'Rankings',
    author: 'Admin',
    published_at: '2025-01-15',
    tags: ['MBA', 'Rankings', 'India'],
  },
  {
    id: '2',
    title: 'CAT 2025 Exam Pattern & Preparation Strategy',
    slug: 'cat-2025-exam-pattern-preparation',
    excerpt: 'Everything you need to know about CAT 2025 - exam pattern, syllabus, preparation tips, and more.',
    cover_image_url: null,
    category: 'Entrance Exams',
    author: 'Admin',
    published_at: '2025-01-10',
    tags: ['CAT', 'Exam', 'Preparation'],
  },
  {
    id: '3',
    title: 'Engineering vs Management: Which Career Path is Right for You?',
    slug: 'engineering-vs-management-career-path',
    excerpt: 'A detailed comparison of engineering and management careers to help students make informed decisions.',
    cover_image_url: null,
    category: 'Careers',
    author: 'Admin',
    published_at: '2025-01-05',
    tags: ['Career', 'Engineering', 'Management'],
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Blog</span>
      </nav>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Education Blog</h1>
        <p className="text-gray-600 mt-2">Latest news, guides, and expert insights on Indian education</p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {['All', 'Admissions', 'Entrance Exams', 'Placements', 'Rankings', 'Careers', 'Scholarships'].map((cat) => (
          <Badge
            key={cat}
            variant={cat === 'All' ? 'default' : 'secondary'}
            className={`cursor-pointer ${cat === 'All' ? 'bg-blue-600' : 'hover:bg-blue-50'}`}
          >
            {cat}
          </Badge>
        ))}
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleBlogs.map((blog) => (
          <Link key={blog.id} href={`/blog/${blog.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow group">
              <CardContent className="p-0">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-t-lg flex items-center justify-center">
                  <span className="text-4xl text-blue-200 font-bold">{blog.title.charAt(0)}</span>
                </div>
                <div className="p-5">
                  <Badge variant="secondary" className="mb-2 text-xs">{blog.category}</Badge>
                  <h2 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{blog.excerpt}</p>
                  <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {blog.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(blog.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
