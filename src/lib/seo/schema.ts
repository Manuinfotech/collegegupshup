export function generateCollegeSchema(college: {
  name: string;
  description?: string;
  url: string;
  logo_url?: string;
  address?: string;
  city?: string;
  state?: string;
  rating?: number;
  review_count?: number;
  established_year?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: college.name,
    description: college.description,
    url: college.url,
    logo: college.logo_url,
    foundingDate: college.established_year ? `${college.established_year}` : undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: college.city,
      addressRegion: college.state,
      addressCountry: 'IN',
    },
    ...(college.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: college.rating,
        reviewCount: college.review_count || 0,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
}

export function generateCourseSchema(course: {
  name: string;
  description?: string;
  provider: string;
  url: string;
  duration?: string;
  fees?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    provider: {
      '@type': 'EducationalOrganization',
      name: course.provider,
    },
    url: course.url,
    ...(course.duration && { timeRequired: course.duration }),
    ...(course.fees && {
      offers: {
        '@type': 'Offer',
        price: course.fees,
        priceCurrency: 'INR',
      },
    }),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateBlogSchema(blog: {
  title: string;
  description?: string;
  url: string;
  image?: string;
  author: string;
  published_at: string;
  modified_at?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.description,
    url: blog.url,
    image: blog.image,
    author: {
      '@type': 'Person',
      name: blog.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'College Gupshup',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
      },
    },
    datePublished: blog.published_at,
    dateModified: blog.modified_at || blog.published_at,
  };
}
