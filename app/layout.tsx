import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Sprites } from '@/components/Sprites';
import { SITE } from '@/lib/site';

const galmuri = localFont({
  src: [
    { path: '../public/fonts/Galmuri11.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/Galmuri11-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-galmuri',
  display: 'swap',
  fallback: ['monospace'],
});

const verification: Metadata['verification'] = {
  google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
  other: process.env.NEXT_PUBLIC_NAVER_VERIFICATION
    ? { 'naver-site-verification': process.env.NEXT_PUBLIC_NAVER_VERIFICATION }
    : undefined,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'PAXC | 식품 제조 현장과 장비를 잇는 소프트웨어',
    template: '%s | PAXC',
  },
  description: SITE.description,
  applicationName: 'PAXC',
  keywords: ['식품제조', '식품 제조 MES', 'HACCP', '스마트해썹', '스마트공장', '식품 포장자동화', 'Foodly', 'BPK FIT', '식품제조 카페', 'PAXC'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'PAXC',
    url: SITE.url,
    title: 'PAXC | BETTER FACTORIES, BRIGHTER TOMORROW',
    description: SITE.description,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'PAXC' }],
  },
  twitter: { card: 'summary_large_image' },
  verification,
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: '#1B1F3B', width: 'device-width', initialScale: 1 };

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'PAXC',
  url: SITE.url,
  logo: `${SITE.url}/og.png`,
  slogan: SITE.slogan,
  email: SITE.email,
  telephone: SITE.tel,
  founder: SITE.ceo,
  address: { '@type': 'PostalAddress', streetAddress: '고산자로 34길 70, 527호', addressLocality: '동대문구', addressRegion: '서울', addressCountry: 'KR' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={galmuri.variable}>
      <body>
        <Sprites />
        <div className="page">{children}</div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
