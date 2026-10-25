create extension if not exists pgcrypto;

create table if not exists public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  name text not null check (char_length(name) between 1 and 40),
  character text not null check (char_length(character) between 1 and 16),
  character_name text not null check (char_length(character_name) between 1 and 80),
  country_code text not null check (char_length(country_code) between 1 and 8),
  country_name text not null check (char_length(country_name) between 1 and 80),
  flag text not null check (char_length(flag) between 1 and 16),
  content text not null check (char_length(content) between 1 and 260),
  created_at timestamptz not null default now()
);

create index if not exists guestbook_entries_created_at_idx
  on public.guestbook_entries (created_at desc, id desc);

alter table public.guestbook_entries enable row level security;

drop policy if exists "Guestbook is publicly readable" on public.guestbook_entries;
create policy "Guestbook is publicly readable"
  on public.guestbook_entries
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Visitors can add valid guestbook entries" on public.guestbook_entries;
create policy "Visitors can add valid guestbook entries"
  on public.guestbook_entries
  for insert
  to anon, authenticated
  with check (
    char_length(name) between 1 and 40
    and char_length(character) between 1 and 16
    and char_length(character_name) between 1 and 80
    and char_length(country_code) between 1 and 8
    and char_length(country_name) between 1 and 80
    and char_length(flag) between 1 and 16
    and char_length(content) between 1 and 260
    and created_at >= timestamptz '2020-01-01 00:00:00+00'
    and created_at <= now() + interval '1 minute'
    and (
      legacy_id is null
      or legacy_id ~ '^(entry|credits-quick|author)-[0-9]{13}$'
      or legacy_id ~ '^cache-[0-9a-fA-F-]{36}$'
      or legacy_id ~ '^seed-[1-8]$'
    )
  );

grant select, insert on public.guestbook_entries to anon, authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'guestbook_entries'
  ) then
    alter publication supabase_realtime add table public.guestbook_entries;
  end if;
end $$;
