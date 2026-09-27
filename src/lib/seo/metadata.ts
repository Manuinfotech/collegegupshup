import { Metadata } from 'next';
import { siteConfig, GOALS } from '@/lib/constants';

export function generateCollegeMetadata(params: {
  name: string;
  slug: string;
  city?: string;
  state?: string;
  description?: string;
}): Metadata {
  const title = `${params.name} - Admissions, Courses, Fees, Placements, Rankings | ${siteConfig.name}`;
  const description = params.description ||
    `Get detailed information about ${params.name}${params.city ? ` in ${params.city}` : ''}. View courses, fees, placements, rankings, reviews and admission details.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/colleges/${params.slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${siteConfig.url}/colleges/${params.slug}`,
    },
  };
}

export function generateListingMetadata(params: {
  goal?: string;
  city?: string;
  state?: string;
}): Metadata {
  const matchedGoal = params.goal ? GOALS.find(g => g.slug === params.goal) : null;
  const goalName = matchedGoal ? matchedGoal.name : (params.goal ? params.goal.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '');
  const cityName = params.city ? params.city.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '';

  let title: string;
  let description: string;
  let path: string;

  if (goalName && cityName) {
    title = `Top ${goalName} Colleges in ${cityName} 2025 - Fees, Placements, Rankings`;
    description = `Find the best ${goalName} colleges in ${cityName}. Compare fees, placements, rankings, and reviews. Get complete admission information for ${goalName} programs.`;
    path = `/${params.goal}-colleges-in-${params.city}`;
  } else if (goalName) {
    title = `Top ${goalName} Colleges in India 2025 - Fees, Placements, Rankings`;
    description = `Explore best ${goalName} colleges in India. Compare fees, placements, rankings. Get admission details, eligibility, entrance exams for ${goalName}.`;
    path = `/${params.goal}-colleges`;
  } else if (cityName) {
    title = `Top Colleges in ${cityName} 2025 - Courses, Fees, Placements`;
    description = `Find best colleges in ${cityName}. Browse courses, compare fees, check placements and reviews. Complete guide to education in ${cityName}.`;
    path = `/colleges-in-${params.city}`;
  } else {
    title = `All Colleges in India - Compare Courses, Fees, Placements`;
    description = `Browse 10,000+ colleges in India. Compare courses, fees, placements, rankings and reviews.`;
    path = '/colleges';
  }

  return {
    title,
    description,
    openGraph: { title, description, url: `${siteConfig.url}${path}` },
    alternates: { canonical: `${siteConfig.url}${path}` },
  };
}
