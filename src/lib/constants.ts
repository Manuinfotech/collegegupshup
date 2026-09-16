export const siteConfig = {
  name: 'College Gupshup',
  description: 'India\'s leading education discovery and college management platform',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/collegegupshup',
    github: 'https://github.com/collegegupshup',
  },
  contact: {
    email: 'info@collegegupshup.com',
    phone: '+91-XXXXXXXXXX',
  },
};

export const ITEMS_PER_PAGE = 20;

export const GOALS = [
  { name: 'MBA', slug: 'mba', icon: 'Briefcase' },
  { name: 'Engineering', slug: 'engineering', icon: 'Cpu' },
  { name: 'Medical', slug: 'medical', icon: 'Stethoscope' },
  { name: 'Law', slug: 'law', icon: 'Scale' },
  { name: 'Design', slug: 'design', icon: 'Palette' },
  { name: 'Commerce', slug: 'commerce', icon: 'TrendingUp' },
  { name: 'Management', slug: 'management', icon: 'Users' },
  { name: 'Pharmacy', slug: 'pharmacy', icon: 'Pill' },
  { name: 'BCA', slug: 'bca', icon: 'Monitor' },
  { name: 'MCA', slug: 'mca', icon: 'Code' },
] as const;

export const OWNERSHIP_TYPES = [
  { label: 'Government', value: 'government' },
  { label: 'Private', value: 'private' },
  { label: 'Deemed', value: 'deemed' },
  { label: 'Autonomous', value: 'autonomous' },
] as const;

export const DEGREE_TYPES = [
  { label: 'Undergraduate', value: 'undergraduate' },
  { label: 'Postgraduate', value: 'postgraduate' },
  { label: 'Diploma', value: 'diploma' },
  { label: 'Doctorate', value: 'doctorate' },
  { label: 'Certificate', value: 'certificate' },
] as const;
