-- PAXC 홈페이지 데이터베이스
-- Supabase 대시보드 > SQL Editor 에 통째로 붙여넣고 Run 하세요.
-- 관리자 이메일이 다르면 아래 'smart@paxc.co.kr' 를 바꾸세요 (.env 의 ADMIN_EMAIL 과 같아야 합니다).

create or replace function public.is_admin()
returns boolean
language sql stable
as $$
  select coalesce(lower(auth.jwt() ->> 'email') = 'smart@paxc.co.kr', false);
$$;

-- 1) 매일의 인기글 TOP 5
create table if not exists public.daily_top5 (
  date          date primary key,
  status        text not null default 'draft' check (status in ('draft', 'published')),
  items         jsonb not null default '[]'::jsonb,   -- [{rank, title, link, summary}]
  note          text not null default '',
  published_at  timestamptz,
  updated_at    timestamptz not null default now()
);

alter table public.daily_top5 enable row level security;

drop policy if exists "공개: 발행된 글 읽기" on public.daily_top5;
create policy "공개: 발행된 글 읽기" on public.daily_top5
  for select to anon, authenticated
  using (status = 'published' or public.is_admin());

drop policy if exists "관리자: 쓰기" on public.daily_top5;
create policy "관리자: 쓰기" on public.daily_top5
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 2) 홈페이지 문의
create table if not exists public.inquiries (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  kind        text not null,
  company     text not null check (char_length(company) <= 100),
  phone       text not null check (char_length(phone) <= 40),
  message     text not null check (char_length(message) <= 4000)
);

alter table public.inquiries enable row level security;

drop policy if exists "공개: 문의 남기기" on public.inquiries;
create policy "공개: 문의 남기기" on public.inquiries
  for insert to anon, authenticated
  with check (true);

drop policy if exists "관리자: 문의 보기" on public.inquiries;
create policy "관리자: 문의 보기" on public.inquiries
  for select to authenticated
  using (public.is_admin());
