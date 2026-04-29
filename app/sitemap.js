export const dynamic = "force-static";

import { trainsData } from '@/lib/trains';

export default function sitemap() {
  const baseUrl = 'https://therails.pk';

  // 1. Tamaam Static Routes (Jo humne files mein dekhe)
  const staticRoutes = [
    '',
    '/reviews',
    '/community',
    '/community/view', // Post Viewer Page
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

  // 2. Dynamic Review Routes (Har train ke liye alag entry)
  const reviewRoutes = trainsData.map((train) => ({
    url: `${baseUrl}/reviews/${train.id}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // Dono ko combine karke return karna
  return [...staticRoutes, ...reviewRoutes];
}