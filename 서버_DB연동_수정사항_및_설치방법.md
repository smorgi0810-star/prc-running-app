# PRC Running App 서버 DB 연동 수정본

## 반영 내용

이번 수정본은 기존 Supabase Storage 파일 업로드에 더해, 아래 데이터를 Supabase Database에 저장하고 불러오도록 수정했습니다.

- Feed 게시글
- Feed 러닝 기록
- Schedule 일정
- Gallery 사진 목록

이제 PC와 모바일이 같은 Vercel 앱 URL에 접속하면 Supabase DB의 공통 데이터를 기준으로 Feed/Gallery/Schedule을 불러옵니다.

## 반드시 먼저 실행할 SQL

Supabase Dashboard > SQL Editor에서 아래 파일 내용을 실행하세요.

```text
docs/supabase-db-setup.sql
```

실행 성공 메시지:

```text
Success. No rows returned
```

## 설치 및 배포

```powershell
npm install
npm run build
git add .
git commit -m "Connect feed gallery schedule to Supabase DB"
git push origin main
```

Vercel에서 자동 배포가 되지 않으면:

```text
Vercel > Project > Deployments > Redeploy
```

## Vercel 환경변수

Vercel > Settings > Environment Variables에 아래 2개가 있어야 합니다.

```env
VITE_SUPABASE_URL=본인 Supabase Project URL
VITE_SUPABASE_ANON_KEY=본인 Supabase anon public key
```

## 주의사항

- 회원가입/회원승인/프로필/Hero/Timeline은 아직 localStorage 중심입니다.
- 이번 단계는 요청하신 Feed, Gallery, Schedule 서버 공통 저장/불러오기에 집중했습니다.
- 새 데이터를 등록한 뒤 다른 기기에서는 새로고침 또는 앱 재접속 시 서버 데이터를 불러옵니다.
