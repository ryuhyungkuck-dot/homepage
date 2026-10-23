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
| `NEXT_PUBLIC_CAFE_NAME` | `식품제조` |
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

## 지원사업 자동 등록 (기업마당 → 홈페이지 → 네이버 카페)

홈페이지가 **원본**이 되도록, 파이프라인은 카페보다 홈페이지에 먼저 올립니다.

```
기업마당 API → 필터링·분류 → ① POST /api/support (홈페이지 주소 받음)
                              → ② 네이버 카페 글쓰기 (본문에 홈페이지 주소 포함)
                              → ③ PATCH /api/support (카페 글 주소 기록)
```

### 준비 (한 번만)
1. Supabase SQL Editor에서 `supabase/support.sql` 실행
2. Vercel 환경변수 추가 (Type: **Secret**, Production + Preview)
   - `SUPABASE_SERVICE_ROLE_KEY` — Supabase > Project Settings > API 의 `service_role`(또는 Secret) 키
   - `SUPPORT_API_TOKEN` — 24자 이상의 임의 문자열. 파이프라인에도 같은 값을 넣습니다.
3. Redeploy

### API
모든 요청에 헤더 `Authorization: Bearer <SUPPORT_API_TOKEN>`, 본문은 JSON.

**POST `/api/support`** — 등록·수정 (한 건 또는 최대 100건 배열, 같은 `id`면 덮어씀)

| 필드 | 필수 | 설명 |
| --- | --- | --- |
| `id` | ✓ | 공고 고유 ID (영문·숫자·`-`·`_`, 64자 이내). 기업마당 공고 ID 사용 권장 |
| `category` | ✓ | `manufacturing`(제조업) · `distribution`(유통) · `education`(교육) |
| `title` | ✓ | 공고명 |
| `source_url` | ✓ | 기업마당 원문 주소 |
| `agency` |  | 소관·수행 기관 |
| `target` |  | 지원 대상 |
| `summary` |  | PAXC가 쓴 요약 (원문 통째 복사 금지) |
| `period_start`, `period_end` |  | `2026-10-31`, `20261031`, `2026.10.31` 모두 가능. 상시면 생략 |
| `tags` |  | 문자열 배열 (최대 10개) |

응답: `{"ok": true, "results": [{"id": "...", "url": "https://paxc.co.kr/support/..."}]}` → 이 `url`을 카페 글 본문에 넣으세요.

**PATCH `/api/support`** — `{"id": "...", "cafe_url": "https://cafe.naver.com/food2008/12345"}` 카페 글 주소 기록.
`{"id": "...", "status": "hidden"}`이면 홈페이지에서 내립니다.

### 파이프라인 예시 (Python)
```python
import os, requests

API = "https://paxc.co.kr/api/support"
H = {"Authorization": f"Bearer {os.environ['SUPPORT_API_TOKEN']}"}

def publish(item, category, summary):
    # item: 기업마당에서 받아 필터링한 공고 한 건 (필드 이름은 사용 중인 코드에 맞게)
    res = requests.post(API, headers=H, json={
        "id": item["id"],
        "category": category,            # manufacturing / distribution / education
        "title": item["title"],
        "agency": item.get("agency", ""),
        "target": item.get("target", ""),
        "summary": summary,
        "period_start": item.get("start"),
        "period_end": item.get("end"),
        "source_url": item["url"],
        "tags": item.get("tags", []),
    }, timeout=20)
    res.raise_for_status()
    home_url = res.json()["results"][0]["url"]

    cafe_url = post_to_naver_cafe(item, summary, home_url)   # 기존 카페 글쓰기 함수 (본문에 home_url 포함)

    requests.patch(API, headers=H, json={"id": item["id"], "cafe_url": cafe_url}, timeout=20).raise_for_status()
```

## 기업마당 자동 수집 (홈페이지가 직접)

매일 오전 7시(한국 시간)쯤 Vercel Cron이 `/api/cron/bizinfo`를 호출합니다.

1. 기업마당 지원사업정보 API에서 최신 공고 500건을 받습니다.
2. 식품 관련 공고만 고릅니다 (식품·HACCP·해썹·김치·장류·제과·음료·밀키트 등, 또는 스마트공장).
3. 제목·개요로 3개 분류에 자동 배치합니다: 교육(교육·아카데미·설명회 …) → 유통(판로·입점·수출·박람회 …) → 나머지는 제조업.
4. 이미 마감된 공고는 건너뛰고, 같은 공고는 갱신합니다. 관리자가 숨긴 공고와 카페 주소는 그대로 둡니다.

관리자 화면의 **기업마당에서 지금 불러오기** 버튼으로 바로 실행할 수도 있습니다.

필요한 환경변수: `BIZINFO_API_KEY`(기업마당 인증키), `CRON_SECRET`(24자 이상 임의 문자열), `SUPABASE_SERVICE_ROLE_KEY`.

### 네이버 카페 글쓰기 파이프라인과 연결
카페 파이프라인은 더 이상 기업마당을 직접 부를 필요가 없습니다. 홈페이지에서 아직 카페에 안 올린 공고를 받아 올리고, 올린 주소를 알려주면 됩니다.

```python
import os, requests
BASE = "https://paxc.co.kr"
H = {"Authorization": f"Bearer {os.environ['SUPPORT_API_TOKEN']}"}

items = requests.get(f"{BASE}/api/support/pending", headers=H, timeout=20).json()["items"]
for it in items:
    # it: id, category_label, title, agency, target, summary, period_start, period_end, source_url, home_url, tags
    cafe_url = post_to_naver_cafe(it)   # 기존 카페 글쓰기 함수 — 본문에 it["home_url"]을 넣어 주세요
    requests.patch(f"{BASE}/api/support", headers=H, json={"id": it["id"], "cafe_url": cafe_url}, timeout=20).raise_for_status()
```
