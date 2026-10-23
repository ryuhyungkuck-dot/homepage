import type { MetadataRoute } from 'next';
import { publishedDates } from '@/lib/posts';
import { CATEGORY_KEYS, listPrograms } from '@/lib/support';
import { SITE } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [days, programs] = await Promise.all([publishedDates(5000), listPrograms(undefined, 5000)]);
  const latestDay = days[0]?.updated_at ? new Date(days[0].updated_at) : new Date();
  const latestProgram = programs.reduce<Date>((m, p) => (new Date(p.updated_at) > m ? new Date(p.updated_at) : m), new Date(0));
  const home = new Date(Math.max(latestDay.getTime(), latestProgram.getTime()));
  return [
    { url: `${SITE.url}/`, lastModified: home, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE.url}/today`, lastModified: latestDay, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE.url}/support`, lastModified: programs.length ? latestProgram : home, changeFrequency: 'daily', priority: 0.8 },
    ...CATEGORY_KEYS.map((c) => ({ url: `${SITE.url}/support?c=${c}`, lastModified: programs.length ? latestProgram : home, changeFrequency: 'daily' as const, priority: 0.7 })),
    ...days.map((d) => ({
      url: `${SITE.url}/today/${d.date}`,
      lastModified: new Date(d.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...programs.map((p) => ({
      url: `${SITE.url}/support/${p.id}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ];
}
