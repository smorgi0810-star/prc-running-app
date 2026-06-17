# TypeScript Build Fix 2

수정 내용:
1. FeedPost 타입의 mediaType 중복 선언 제거
2. 기존 로컬 함수 uploadFeedMedia와 Supabase import 함수 이름 충돌 해결
   - Supabase import를 uploadFeedMediaToStorage alias로 변경
3. Feed 파일 input이 기존 localStorage 함수가 아닌 handleFeedMediaUpload를 호출하도록 수정
4. Vite 환경변수 타입 인식을 위해 src/vite-env.d.ts 추가
