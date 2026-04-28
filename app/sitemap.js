export const dynamic = "force-static"; // Yeh line build error ko fix karegi

import { trainsData } from '@/lib/trains';

export default function sitemap() {
  const baseUrl = 'https://therails.pk';

  // Saare naye aur purane routes
  const routes = [
    '',
    '/reviews',
    '/community',
    '/support',
    '/fares',
    '/schedule',
    '/locomotives',
    '/heritage',
    '/contact',
    '/refunds',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}