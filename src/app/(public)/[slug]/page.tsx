import { Metadata } from 'next';
import Link from 'next/link';
import { CollegeCard } from '@/components/colleges/college-card';

interface Props {
  params: Promise<{ slug: string }>;
}

function parseSlug(slug: string) {
  // Parse slugs like "mba-colleges-in-pune" or "engineering-colleges-in-mumbai"
  const match = slug.match(/^(.+)-colleges(?:-in-(.+))?$/);
  if (!match) return { goal: slug, city: null };
  return { goal: match[1], city: match[2] || null };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { goal, city } = parseSlug(slug);
  const goalName = goal.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const cityName = city ? city.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : null;

  const title = cityName
    ? `Top ${goalName} Colleges in ${cityName} 2025 - Fees, Placements, Rankings`
    : `Top ${goalName} Colleges in India 2025 - Fees, Placements, Rankings`;

  const description = cityName
    ? `Find the best ${goalName} colleges in ${cityName}. Compare fees, placements, rankings, reviews and get detailed admission information.`
    : `Find the best ${goalName} colleges in India. Compare fees, placements, rankings, reviews and get detailed admission information.`;

  return { title, description };
}

export default async function DynamicSEOPage({ params }: Props) {
  const { slug } = await params;
  const { goal, city } = parseSlug(slug);
  const goalName = goal.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const cityName = city ? city.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : null;

  const pageTitle = cityName
    ? `Top ${goalName} Colleges in ${cityName}`
    : `Top ${goalName} Colleges in India`;

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/colleges" className="hover:text-blue-600">Colleges</Link>
        <span className="mx-2">/</span>
        {cityName && (
          <>
            <Link href={`/${goal}-colleges`} className="hover:text-blue-600">
              {goalName} Colleges
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-gray-900">{pageTitle}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
        <p className="text-gray-600 mt-2">
          {cityName
            ? `Showing ${goalName} colleges in ${cityName}. Compare fees, placements, and find your ideal college.`
            : `Explore top ${goalName} colleges across India with fees, placements, and admission details.`}
        </p>
      </div>

      {/* College Grid - Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CollegeCard
            key={i}
            college={{
              id: `${i}`,
              name: `${goalName} Institute ${i + 1}`,
              slug: `${goal}-institute-${i + 1}`,
              logo_url: null,
              cover_image_url: null,
              short_description: `Premier ${goalName} institution`,
              city_name: cityName || 'Pune',
              state_name: 'Maharashtra',
              ownership_type: i % 2 === 0 ? 'private' : 'government',
              established_year: 1990 + i * 3,
              is_featured: i < 2,
              is_verified: true,
              average_rating: 4.0 + i * 0.1,
              review_count: 50 + i * 30,
              fees_range: '3-8 L',
              highest_package: 2000000 + i * 200000,
              average_package: 700000 + i * 80000,
            }}
          />
        ))}
      </div>
    </div>
  );
}
