# 검정 화면 방지 수정

Supabase 환경변수가 Vercel에 반영되지 않았을 때 `src/lib/supabase.ts`에서 throw가 발생하여 React 앱 전체가 검정 화면으로 멈추는 문제를 방지했습니다.

## 수정 내용

- 환경변수가 없어도 앱 초기 렌더링은 정상 진행
- Storage 업로드 시점에만 오류 메시지 발생
- Vercel 환경변수 등록 후 Redeploy하면 정상 업로드 가능

## 확인할 Vercel 환경변수

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
