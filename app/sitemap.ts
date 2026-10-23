import type { MetadataRoute } from 'next';
import { publishedDates } from '@/lib/posts';
import { SITE } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const days = await publishedDates(5000);
  const latest = days[0]?.updated_at ? new Date(days[0].updated_at) : new Date();
  return [
    { url: `${SITE.url}/`, lastModified: latest, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE.url}/today`, lastModified: latest, changeFrequency: 'daily', priority: 0.8 },
    ...days.map((d) => ({
      url: `${SITE.url}/today/${d.date}`,
      lastModified: new Date(d.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
