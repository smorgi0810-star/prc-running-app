# Supabase Storage 적용 다음 단계

## 1. 로컬 환경변수
프로젝트 루트의 `.env.local`에 Supabase URL과 Publishable Key가 들어 있습니다.
이 파일은 `.gitignore`에 포함되어 GitHub에 올라가지 않습니다.

## 2. Vercel 환경변수
Vercel Dashboard → Project → Settings → Environment Variables에 아래 2개를 추가하세요.

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

## 3. Storage Bucket
Supabase Dashboard → Storage에서 아래 bucket을 Public으로 생성하세요.

- gallery
- feed
- profile
- hero

## 4. Storage Policy
`docs/supabase-storage-setup.sql` 내용을 Supabase SQL Editor에서 실행하세요.

## 5. 코드 연결
이미 아래 파일을 추가했습니다.

- src/lib/supabase.ts
- src/lib/storage.ts

다음 코드 수정 단계에서는 기존 `fileToDataUrl()` 기반 업로드를 `uploadGalleryImage`, `uploadFeedMedia`, `uploadProfileImage`, `uploadHeroImage`로 교체하면 됩니다.

## 6. GitHub에 올리면 안 되는 항목
아래 항목은 `.gitignore`로 제외했습니다.

- node_modules
- dist
- .env
- .env.local
- .vercel
- .git
