import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${title} - College Gupshup Blog`,
    description: `Read ${title} on College Gupshup Blog.`,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-blue-600">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 truncate">Article</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>By Admin</span>
          <span>Published on Jan 15, 2025</span>
          <span>5 min read</span>
        </div>
      </header>

      <div className="prose prose-lg max-w-none">
        <p>
          This is a detailed blog article about the topic. In production, this content
          will be fetched from Supabase and rendered with rich HTML formatting.
        </p>
        <p>
          The blog system supports rich text editing, SEO fields, tags, categories,
          featured articles, and author profiles.
        </p>
      </div>
    </article>
  );
}
