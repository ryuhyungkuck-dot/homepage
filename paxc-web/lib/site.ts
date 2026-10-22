export const SITE = {
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://paxc.co.kr').replace(/\/$/, ''),
  name: 'PAXC',
  slogan: 'BETTER FACTORIES, BRIGHTER TOMORROW',
  acronym: 'Pre-sale to After-sale, eXperience Connected',
  declaration: '장비를 고민하는 순간부터, 매일의 현장까지 팍스는 함께합니다.',
  description:
    '식품 제조사와 식품 장비 공급사를 하나의 데이터로 잇는 PAXC. 식품 제조 MES Foodly, 식품 장비 영업관리 BPK FIT, 그리고 매일 아침 식품제조 카페 인기글 TOP 5.',
  ceo: '류형국',
  bizNo: '102-42-012449',
  tel: '010-2997-3070',
  email: 'smart@paxc.co.kr',
  address: '서울시 동대문구 고산자로 34길 70, 527호',
  cafe: {
    name: process.env.NEXT_PUBLIC_CAFE_NAME || '식품제조 카페',
    url: 'https://cafe.naver.com/food2008',
  },
  foodly: 'https://www.foodly.co.kr/',
} as const;

export type Top5Item = { rank: number; title: string; link: string; summary: string };
export type Top5Post = {
  date: string; // YYYY-MM-DD
  status: 'draft' | 'published';
  items: Top5Item[];
  note: string;
  published_at: string | null;
  updated_at: string;
};

export function isDate(s: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));
}

export function koDate(d: string) {
  const [y, m, day] = d.split('-').map(Number);
  return `${y}년 ${m}월 ${day}일`;
}

/** Only allow links that point at the Naver cafe (or any https URL as a fallback). */
export function safeLink(href: string) {
  try {
    const u = new URL(href);
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.toString() : SITE.cafe.url;
  } catch {
    return SITE.cafe.url;
  }
}
