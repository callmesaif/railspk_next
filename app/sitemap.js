export const dynamic = "force-static";

import { trainsData } from '@/lib/trains';

export default function sitemap() {
  const baseUrl = 'https://therails.pk';

  // 1. Tamaam Static Routes
  const staticRoutes = [
    '',
    '/reviews',
    '/community',
    '/community/view',
    '/support',
    '/fares',
    '/schedule',
    '/locomotives',
    '/heritage',
    '/about',
    '/contact',
    '/refunds',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Dynamic Review Routes (Har train ke liye entries)
  const reviewRoutes = trainsData.map((train) => ({
    url: `${baseUrl}/reviews/${train.id}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // Combine static and dynamic routes
  return [...staticRoutes, ...reviewRoutes];
}