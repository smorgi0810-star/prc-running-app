-- PRC Running App Supabase Storage 초기 정책
-- Supabase SQL Editor에서 실행하세요.
-- 먼저 Storage 화면에서 아래 bucket 4개를 Public으로 생성하세요.
-- gallery, feed, profile, hero

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

-- 운영 단계에서는 public upload 대신 authenticated upload 정책으로 전환하는 것을 권장합니다.
-- create policy "Allow authenticated upload for PRC buckets"
-- on storage.objects
-- for insert
-- to authenticated
-- with check (bucket_id in ('gallery', 'feed', 'profile', 'hero'));
