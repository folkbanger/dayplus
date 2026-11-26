// Structured data (JSON-LD). Only true facts: no ratings, no reviews, no prices (they differ per country).
import { APP_STORE_URL, SITE_URL, SUPPORT_EMAIL, LEGAL_NAME } from '../config';

const abs = (p: string) => new URL(p, SITE_URL).href;
const ORG_ID = abs('/#organization');

/** An article's day as a full timestamp: 10:00 UTC, when the daily rebuild publishes it. */
export const isoTime = (d: Date) => `${d.toISOString().slice(0, 10)}T10:00:00Z`;

export const organization = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'Day+',
  url: abs('/'),
  logo: abs('/icon-512.png'),
  email: SUPPORT_EMAIL,
  founder: { '@type': 'Person', name: LEGAL_NAME },
});

export const website = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Day+',
  url: abs('/'),
  publisher: { '@id': ORG_ID },
});

export const mobileApp = () => ({
  '@context': 'https://schema.org',
  '@type': 'MobileApplication',
  name: 'Day+: Habit Tracker',
  operatingSystem: 'iOS',
  applicationCategory: 'HealthApplication',
  applicationSubCategory: 'Productivity',
  description: 'Pick a few small habits, check them off in one tap, and see yourself get better week by week. Free for 3 days.',
  image: abs('/icon-512.png'),
  url: APP_STORE_URL || abs('/'),
  publisher: { '@id': ORG_ID },
});

export const faqPage = (items: string[][]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});

export const blogPosting = (o: { url: string; title: string; description: string; date: Date; updated?: Date; image: string; topic: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  mainEntityOfPage: abs(o.url),
  headline: o.title,
  description: o.description,
  datePublished: isoTime(o.date),
  dateModified: isoTime(o.updated ?? o.date),
  image: abs(o.image),
  articleSection: o.topic,
  inLanguage: 'en-US',
  author: { '@type': 'Organization', name: 'Day+ Blog', url: abs('/blog/') },
  publisher: { '@id': ORG_ID, '@type': 'Organization', name: 'Day+', logo: { '@type': 'ImageObject', url: abs('/icon-512.png') } },
});

export const breadcrumbs = (items: [string, string][]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(url) })),
});
