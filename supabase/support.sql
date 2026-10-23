-- 식품관련업 사장님을 위한 지원사업 (기업마당 → PAXC 홈페이지 → 네이버 카페)
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 Run 하세요. (schema.sql 을 먼저 실행한 뒤)

create table if not exists public.support_programs (
  id            text primary key check (id ~ '^[A-Za-z0-9_-]{1,64}$'),  -- 기업마당 공고 ID 등
  category      text not null check (category in ('manufacturing', 'distribution', 'education')),
  title         text not null check (char_length(title) <= 300),
  agency        text not null default '',          -- 소관·수행 기관
  target        text not null default '',          -- 지원 대상
  summary       text not null default '',          -- PAXC가 정리한 요약 (원문 복사 금지)
  period_start  date,                              -- 신청 시작일 (상시면 비움)
  period_end    date,                              -- 신청 마감일 (상시면 비움)
  source_url    text not null,                     -- 기업마당 원문 주소
  cafe_url      text,                              -- 네이버 카페에 올린 글 주소
  tags          text[] not null default '{}',
  status        text not null default 'published' check (status in ('published', 'hidden')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists support_programs_list_idx
  on public.support_programs (status, category, period_end);

alter table public.support_programs enable row level security;

drop policy if exists "공개: 지원사업 읽기" on public.support_programs;
create policy "공개: 지원사업 읽기" on public.support_programs
  for select to anon, authenticated
  using (status = 'published' or public.is_admin());

drop policy if exists "관리자: 지원사업 수정" on public.support_programs;
create policy "관리자: 지원사업 수정" on public.support_programs
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 파이프라인의 등록은 홈페이지 서버(/api/support)가 service_role 키로 처리하므로
-- anon 에게는 쓰기 권한을 주지 않습니다.
