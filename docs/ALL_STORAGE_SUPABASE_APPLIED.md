# PRC App 전체 Storage Supabase 연결 적용

이번 버전은 아래 업로드를 모두 Supabase Storage로 연결합니다.

## 연결 대상

| 기능 | Bucket | 제한 |
|---|---|---|
| Memory Gallery | gallery | 이미지 10MB 이하 |
| Feed 사진 | feed | 이미지 10MB 이하 |
| Feed 동영상 | feed | 동영상 80MB 이하 |
| Profile 사진 | profile | 이미지 5MB 이하 |
| Hero 이미지 | hero | 이미지 10MB 이하 |
| Anniversary Timeline 이미지 | hero/timeline | 이미지 10MB 이하 |

## 필수 사전 조건

1. Supabase Storage bucket 4개 생성
   - gallery
   - feed
   - profile
   - hero

2. 각 bucket은 Public ON

3. SQL Editor에서 `docs/supabase-storage-setup.sql` 실행

4. Vercel Environment Variables 등록
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY

## 테스트 순서

1. Memory Gallery 업로드
2. Feed 사진 업로드
3. Feed 동영상 업로드
4. Profile 사진 변경
5. Admin → Hero 사진 업로드
6. Admin → Anniversary Timeline 사진 변경

## 주의

현재 게시글/갤러리 메타데이터는 아직 localStorage에 저장됩니다.
파일 자체만 Supabase Storage에 저장됩니다.
다음 단계에서 feed_posts, gallery_photos, users 같은 DB 테이블까지 Supabase Database로 전환하면 모든 멤버가 같은 데이터를 공유할 수 있습니다.
