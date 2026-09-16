import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, Award, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about College Gupshup - India\'s leading education discovery and college management platform.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">About Us</span>
      </nav>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About College Gupshup</h1>
          <p className="text-lg text-gray-600">
            Empowering students to make informed education decisions since 2024.
          </p>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-gray-600">
            College Gupshup is India&apos;s leading education discovery and college management platform.
            We help students discover, compare, and choose the right college for their career aspirations.
            At the same time, we empower colleges to manage their digital presence and connect with
            prospective students through our powerful SaaS tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[
            { icon: Target, title: 'Our Mission', description: 'To democratize access to education information and help every student find their perfect college.' },
            { icon: Globe, title: 'Our Vision', description: 'To become India\'s most trusted platform for education discovery and college management.' },
            { icon: Users, title: 'Our Community', description: 'Over 1 million students and 10,000+ colleges trust College Gupshup for their education journey.' },
            { icon: Award, title: 'Our Values', description: 'Transparency, accuracy, and student-first approach guide everything we do.' },
          ].map((item) => (
            <Card key={item.title}>
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
