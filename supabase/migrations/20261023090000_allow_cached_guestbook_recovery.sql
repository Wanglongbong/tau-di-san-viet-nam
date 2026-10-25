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
