import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/colleges`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  // Goal-based pages
  const goals = ['mba', 'engineering', 'medical', 'law', 'design', 'commerce', 'management', 'pharmacy', 'bca', 'mca'];
  const goalPages: MetadataRoute.Sitemap = goals.map((goal) => ({
    url: `${baseUrl}/${goal}-colleges`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // City-based pages
  const cities = ['mumbai', 'pune', 'bangalore', 'delhi', 'chennai', 'hyderabad', 'kolkata', 'ahmedabad', 'jaipur', 'lucknow'];
  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${baseUrl}/colleges-in-${city}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // Goal + City combination pages
  const combinationPages: MetadataRoute.Sitemap = goals.flatMap((goal) =>
    cities.map((city) => ({
      url: `${baseUrl}/${goal}-colleges-in-${city}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  );

  return [...staticPages, ...goalPages, ...cityPages, ...combinationPages];
}
