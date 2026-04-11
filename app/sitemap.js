// app/sitemap.js
import { trainsData } from '@/lib/trains';

export const dynamic = 'force-static';

export default async function sitemap() {
  const baseUrl = 'https://therails.pk'; // Apni domain yahan likhein

  // Train detail pages links
  const trainUrls = trainsData.map((train) => ({
    url: `${baseUrl}/reviews/${train.id}`,
    lastModified: new Date(),
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/reviews`, lastModified: new Date() },
    { url: `${baseUrl}/community`, lastModified: new Date() },
    { url: `${baseUrl}/support`, lastModified: new Date() },
    ...trainUrls,
  ];
}