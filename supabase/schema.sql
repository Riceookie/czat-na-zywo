-- Schemat dla „Czat na żywo (WebSocket)".
-- Uruchom w Supabase → SQL Editor → New query → Run.

-- ── Wiadomości czatu ─────────────────────────────────────────────────────────
create table if not exists messages (
  id         uuid primary key default gen_random_uuid(),
  nick       text not null,
  tresc      text not null,
  created_at timestamptz not null default now(),
  -- Walidacja także po stronie bazy (nie tylko we froncie):
  constraint messages_tresc_len check (char_length(btrim(tresc)) between 1 and 500),
  constraint messages_nick_len  check (char_length(btrim(nick))  between 1 and 40)
);

-- Historia ładowana wg czasu — indeks przyspiesza sortowanie.
create index if not exists messages_created_idx on messages(created_at);

-- ── RLS: czat publiczny ──────────────────────────────────────────────────────
-- Każdy (klucz anon) może CZYTAĆ i DODAWAĆ wiadomości. Brak update/delete —
-- nikt nie edytuje ani nie kasuje cudzych wpisów kluczem publicznym.
alter table messages enable row level security;

drop policy if exists "czat_select_all" on messages;
create policy "czat_select_all" on messages
  for select using (true);

drop policy if exists "czat_insert_all" on messages;
create policy "czat_insert_all" on messages
  for insert with check (true);

-- ── Realtime (WebSocket) ─────────────────────────────────────────────────────
-- Dodanie tabeli do publikacji `supabase_realtime` sprawia, że INSERT-y są
-- rozsyłane po WebSockecie do wszystkich zasubskrybowanych klientów „na żywo".
alter publication supabase_realtime add table messages;
