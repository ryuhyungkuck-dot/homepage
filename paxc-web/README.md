# PAXC 홈페이지 (paxc.co.kr)

장비를 고민하는 순간부터, 매일의 현장까지 팍스는 함께합니다.

- Next.js 14 (App Router) + TypeScript
- Supabase: 인기글 저장, 문의 저장, 관리자 로그인
- Vercel 배포
- 글꼴: 갈무리(Galmuri) — SIL Open Font License 1.1 (`public/fonts/ofl.md`)

## 화면 구성

| 주소 | 내용 |
| --- | --- |
| `/` | 홈: 로고, PAXC의 의미, 솔루션(BPK FIT, Foodly), 어제의 인기글 TOP 5, 상담 신청 |
| `/today` | 날짜별 인기글 모아보기 |
| `/today/2026-10-22` | 그날의 TOP 5와 PAXC 해설 (구글 검색용 페이지) |
| `/admin` | 관리자: 글 목록, 문의 내역 |
| `/admin/write` | 관리자: 하루치 TOP 5 쓰기·발행 |
| `/sitemap.xml`, `/robots.txt` | 검색엔진용, 자동 생성 |

## 처음 배포하는 순서

### 1. Supabase 만들기 (10분)
1. https://supabase.com 에서 새 프로젝트를 만듭니다. 지역은 **Northeast Asia (Seoul)**.
2. **SQL Editor**에서 `supabase/schema.sql` 내용을 붙여넣고 Run.
3. **Authentication > Sign In / Providers**에서 *Allow new users to sign up*을 **끕니다**. (아무나 가입하지 못하게)
4. **Authentication > Users > Add user**로 관리자 계정을 만듭니다.
   - 이메일: `smart@paxc.co.kr`, 비밀번호: 원하는 값, *Auto Confirm User* 체크
5. **Project Settings > API**에서 `Project URL`과 `anon public` 키를 복사해 둡니다.

### 2. GitHub에 올리기
기존 홈페이지 저장소에 이 폴더의 내용을 그대로 올립니다(기존 파일은 교체).

### 3. Vercel 환경변수
Vercel 프로젝트 > Settings > Environment Variables 에 `.env.example`의 항목을 넣습니다.

| 이름 | 값 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public 키 |
| `ADMIN_EMAIL` | `smart@paxc.co.kr` |
| `NEXT_PUBLIC_SITE_URL` | `https://paxc.co.kr` |
| `NEXT_PUBLIC_CAFE_NAME` | 카페의 정확한 이름 |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | (4단계에서 받는 코드) |
| `NEXT_PUBLIC_NAVER_VERIFICATION` | (4단계에서 받는 코드) |

저장 후 **Redeploy**. 도메인(paxc.co.kr) 연결은 기존 설정 그대로 유지됩니다.

### 4. 검색엔진 등록
1. **Google Search Console** (https://search.google.com/search-console) → 속성 추가 → URL 접두어 `https://paxc.co.kr` → *HTML 태그* 방식의 `content` 값을 `NEXT_PUBLIC_GOOGLE_VERIFICATION`에 넣고 재배포 → 확인 → **Sitemaps**에 `sitemap.xml` 제출.
2. **네이버 서치어드바이저** (https://searchadvisor.naver.com) → 사이트 등록 → *HTML 태그* 값을 `NEXT_PUBLIC_NAVER_VERIFICATION`에 → 확인 → 요청 > 사이트맵 제출에 `https://paxc.co.kr/sitemap.xml`.

## 매일 하는 일 (5분)
1. 아침에 카페 통계에서 어제 조회수 상위 글 5개를 확인합니다.
2. `paxc.co.kr/admin` 로그인 → **+ 오늘 TOP 5 쓰기**.
3. 순위별로 제목, 원문 링크, **직접 쓴** 한 줄 정리를 넣고, 아래 *오늘의 해설*을 3~5문장 씁니다.
4. **발행하기**. 홈 화면, `/today/날짜` 페이지, 사이트맵이 바로 바뀝니다.

> 카페 글 본문은 복사해 붙이지 마세요. 저작권은 글쓴이에게 있고, 구글은 복사한 글을 중복 문서로 보고 노출하지 않습니다. 제목 + PAXC가 쓴 요약·해설 + 원문 링크 구조가 검색에도, 카페 유입에도 가장 좋습니다.

## 개발
```bash
cp .env.example .env.local   # 값 채우기
npm install
npm run dev                  # http://localhost:3000
npm run build                # 배포 전 확인
```
환경변수가 없어도 화면은 뜨고, 인기글 자리는 "준비 중"으로 표시됩니다.
