import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Compare Colleges',
  description: 'Compare colleges side by side - fees, placements, rankings, facilities and more.',
};

export default function ComparePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Compare Colleges</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Compare Colleges</h1>
      <p className="text-gray-600 mb-8">
        Compare colleges side by side to make the best decision for your education.
      </p>

      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-gray-500 mb-4">
            Add colleges to compare. You can compare up to 4 colleges at a time.
          </p>
          <Link href="/colleges">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Browse Colleges
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
