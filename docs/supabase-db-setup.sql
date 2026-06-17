-- PRC Running App: PC/모바일 공통 데이터 저장용 Supabase Database 설정
-- Supabase Dashboard > SQL Editor 에서 전체 실행하세요.
-- 기존 feed/gallery/schedule 연동 테이블이 있어도 안전하게 확장됩니다.

create table if not exists public.prc_shared_state (
  id text primary key default 'main',
  users jsonb not null default '[]'::jsonb,
  run_records jsonb not null default '[]'::jsonb,
  feed_posts jsonb not null default '[]'::jsonb,
  run_events jsonb not null default '[]'::jsonb,
  gallery_photos jsonb not null default '[]'::jsonb,
  hero_slides jsonb not null default '[]'::jsonb,
  timeline_slides jsonb not null default '[]'::jsonb,
  notices jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.prc_shared_state add column if not exists users jsonb not null default '[]'::jsonb;
alter table public.prc_shared_state add column if not exists run_records jsonb not null default '[]'::jsonb;
alter table public.prc_shared_state add column if not exists feed_posts jsonb not null default '[]'::jsonb;
alter table public.prc_shared_state add column if not exists run_events jsonb not null default '[]'::jsonb;
alter table public.prc_shared_state add column if not exists gallery_photos jsonb not null default '[]'::jsonb;
alter table public.prc_shared_state add column if not exists hero_slides jsonb not null default '[]'::jsonb;
alter table public.prc_shared_state add column if not exists timeline_slides jsonb not null default '[]'::jsonb;
alter table public.prc_shared_state add column if not exists notices jsonb not null default '[]'::jsonb;
alter table public.prc_shared_state add column if not exists updated_at timestamptz not null default now();

insert into public.prc_shared_state (
  id, users, run_records, feed_posts, run_events, gallery_photos, hero_slides, timeline_slides, notices
)
values (
  'main', '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb
)
on conflict (id) do nothing;

alter table public.prc_shared_state enable row level security;

drop policy if exists "Allow public read PRC shared state" on public.prc_shared_state;
drop policy if exists "Allow public insert PRC shared state" on public.prc_shared_state;
drop policy if exists "Allow public update PRC shared state" on public.prc_shared_state;

create policy "Allow public read PRC shared state"
on public.prc_shared_state
for select
to public
using (true);

create policy "Allow public insert PRC shared state"
on public.prc_shared_state
for insert
to public
with check (id = 'main');

create policy "Allow public update PRC shared state"
on public.prc_shared_state
for update
to public
using (id = 'main')
with check (id = 'main');
