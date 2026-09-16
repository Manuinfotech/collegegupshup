import { cookies } from 'next/headers';
import { Metadata } from 'next';
import { CollegeCard } from '@/components/colleges/college-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { OWNERSHIP_TYPES } from '@/lib/constants';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'All Colleges in India',
  description: 'Browse and discover top colleges in India. Compare fees, placements, rankings and reviews.',
};

export default async function CollegesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const cookieStore = await cookies();
  const cookieCity = cookieStore.get('selected_city')?.value;

  const resolvedParams = await searchParams;
  const urlCity = typeof resolvedParams.city === 'string' ? resolvedParams.city : '';
  const selectedCity = urlCity || cookieCity || '';
  const selectedGoal = typeof resolvedParams.goal === 'string' ? resolvedParams.goal : '';
  const selectedState = typeof resolvedParams.state === 'string' ? resolvedParams.state : '';

  let pageTitle = 'All Colleges in India';
  if (selectedCity) {
    pageTitle = `Colleges in ${selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}`;
  } else if (selectedState) {
    pageTitle = `Colleges in ${selectedState.charAt(0).toUpperCase() + selectedState.slice(1)}`;
  } else if (selectedGoal) {
    pageTitle = `Top ${selectedGoal.toUpperCase()} Colleges in India`;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Colleges</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>

              {/* Stream / Goal */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Stream / Course</h4>
                <div className="space-y-2">
                  {['Engineering', 'Management', 'Medical', 'Law', 'Design'].map((stream) => (
                    <label key={stream} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox checked={selectedGoal.toLowerCase() === stream.toLowerCase()} />
                      <span className="text-sm text-gray-600">{stream}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* State / City */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">State / City</h4>
                <div className="space-y-2">
                  {['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh'].map((state) => (
                    <label key={state} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox checked={selectedState.toLowerCase() === state.toLowerCase() || (Boolean(selectedCity) && ['mumbai', 'pune'].includes(selectedCity.toLowerCase()) && state === 'Maharashtra')} />
                      <span className="text-sm text-gray-600">{state}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ownership Type */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Ownership Type</h4>
                <div className="space-y-2">
                  {OWNERSHIP_TYPES.map((type) => (
                    <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox />
                      <span className="text-sm text-gray-600">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fees Range */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Fees Range</h4>
                <div className="space-y-2">
                  {['Under 1 Lakh', '1-3 Lakhs', '3-5 Lakhs', '5-10 Lakhs', '10+ Lakhs'].map((range) => (
                    <label key={range} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox />
                      <span className="text-sm text-gray-600">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Accreditation */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Accreditation</h4>
                <div className="space-y-2">
                  {['NAAC A++', 'NAAC A+', 'NAAC A', 'NBA', 'AACSB', 'AMBA'].map((acc) => (
                    <label key={acc} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox />
                      <span className="text-sm text-gray-600">{acc}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
              <p className="text-sm text-gray-500 mt-1">Showing 1-20 of 10,000+ colleges</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select className="text-sm border rounded-md px-3 py-1.5 text-gray-700">
                <option value="relevance">Relevance</option>
                <option value="rating">Rating</option>
                <option value="fees_low">Fees: Low to High</option>
                <option value="fees_high">Fees: High to Low</option>
              </select>
            </div>
          </div>

          {/* College Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Placeholder cards - will be replaced with actual data */}
            {Array.from({ length: 9 }).map((_, i) => (
              <CollegeCard
                key={i}
                college={{
                  id: `${i}`,
                  name: `Sample College ${i + 1}`,
                  slug: `sample-college-${i + 1}`,
                  logo_url: null,
                  cover_image_url: null,
                  short_description: 'A premier institution offering quality education.',
                  city_name: 'Pune',
                  state_name: 'Maharashtra',
                  ownership_type: 'private',
                  established_year: 1990 + i,
                  is_featured: i < 3,
                  is_verified: true,
                  average_rating: 4.2 + (i * 0.1),
                  review_count: 100 + i * 20,
                  fees_range: '2-5 L',
                  highest_package: 2500000,
                  average_package: 800000 + i * 50000,
                }}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            {[1, 2, 3, 4, 5].map((page) => (
              <Button key={page} variant={page === 1 ? 'default' : 'outline'} size="sm" className={page === 1 ? 'bg-blue-600' : ''}>
                {page}
              </Button>
            ))}
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
