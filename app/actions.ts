'use server';

import { publicClient } from '@/lib/supabase/server';

export type InquiryState = { ok: boolean; message: string } | null;

const KINDS = ['Foodly 도입', '스마트공장 · 스마트해썹', '식품 장비 공급사 협업'];

export async function submitInquiry(_prev: InquiryState, form: FormData): Promise<InquiryState> {
  // honeypot: real people never fill this hidden field
  if (String(form.get('website') || '').trim()) return { ok: true, message: '접수되었습니다.' };

  const kind = String(form.get('kind') || '');
  const company = String(form.get('company') || '').trim().slice(0, 100);
  const phone = String(form.get('phone') || '').trim().slice(0, 40);
  const message = String(form.get('message') || '').trim().slice(0, 4000);

  if (!KINDS.includes(kind)) return { ok: false, message: '문의 구분을 선택해 주세요.' };
  if (!company || !phone || !message) return { ok: false, message: '회사명, 연락처, 문의 내용을 모두 입력해 주세요.' };

  const sb = publicClient();
  if (!sb) return { ok: false, message: '지금은 접수할 수 없습니다. 전화나 이메일로 연락해 주세요.' };

  const { error } = await sb.from('inquiries').insert({ kind, company, phone, message });
  if (error) return { ok: false, message: '접수 중 문제가 생겼습니다. 전화나 이메일로 연락해 주세요.' };
  return { ok: true, message: '접수되었습니다. 빠르게 연락드리겠습니다.' };
}
