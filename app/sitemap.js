export const dynamic = "force-static"; // Yeh line build error ko fix karegi

import { trainsData } from '@/lib/trains';

export default function sitemap() {
  const baseUrl = 'https://therails.pk';

  const trainUrls = trainsData.map((train) => ({
    url: `${baseUrl}/reviews/${train.id}/`,
    lastModified: new Date(),
  }));

  return [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/community/`, lastModified: new Date() },
    { url: `${baseUrl}/reviews/`, lastModified: new Date() },
    ...trainUrls,
  ];
}