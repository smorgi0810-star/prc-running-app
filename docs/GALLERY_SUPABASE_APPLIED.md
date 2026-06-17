# Gallery Supabase Storage 연결 적용 내용

이번 버전은 Memory Gallery 업로드를 Supabase Storage `gallery` bucket과 연결합니다.

## 변경 내용

- `src/App.tsx`
  - `uploadGalleryImage` import 추가
  - `galleryUploading` 상태 추가
  - `handleGalleryImageUpload()` 함수 추가
  - Gallery 파일 선택 시 기존 `fileToDataUrl()` 대신 Supabase Storage 업로드 실행
  - 업로드 완료 후 반환된 public URL을 `galleryForm.image`에 저장
  - 등록 버튼에 업로드 중 상태 표시

- `src/lib/storage.ts`
  - `uploadGalleryImage(file)` 사용

## 사전 조건

Supabase Dashboard에서 아래 작업이 완료되어야 합니다.

1. Storage bucket 생성
   - `gallery`
   - Public ON

2. SQL Editor에서 Storage Policy 실행

```sql
create policy "Allow public read for PRC buckets"
on storage.objects
for select
to public
using (bucket_id in ('gallery', 'feed', 'profile', 'hero'));

create policy "Allow public upload for PRC buckets"
on storage.objects
for insert
to public
with check (bucket_id in ('gallery', 'feed', 'profile', 'hero'));
```

3. Vercel Environment Variables 등록
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## 테스트 방법

1. 관리자 또는 일반 사용자로 로그인
2. Memory Gallery 이동
3. 사진 선택
4. 업로드 완료 메시지 확인
5. 등록 버튼 클릭
6. Home의 최신 Memory Gallery 15장 영역에 표시 확인
7. Supabase Dashboard → Storage → gallery bucket에 파일 생성 여부 확인
