# 💬 Czat na żywo (WebSocket)

Publiczny czat działający **w czasie rzeczywistym**. Wiadomość wysłana w jednej
karcie/przeglądarce pojawia się u wszystkich **natychmiast, bez odświeżania** —
przez kanał **WebSocket** (Supabase Realtime). Historia jest zapisywana w bazie.

**Stack:** Next.js 14 (App Router) + Supabase Realtime + Postgres · deploy **Vercel**.

**Demo:** https://czat-na-zywo.vercel.app/

## Jak to działa (WebSocket)

- Klient subskrybuje kanał Realtime i nasłuchuje zdarzeń **INSERT** na tabeli
  `messages` (`app/page.jsx` → `supabase.channel('czat').on('postgres_changes', …)`).
- Nowy wpis w tabeli jest **rozsyłany po WebSockecie** do wszystkich podłączonych
  klientów → wiadomość pojawia się na żywo, bez pollingu i bez odświeżania strony.
- Wysłanie = `INSERT` do `messages` kluczem publicznym (anon). Reguły **RLS**
  (patrz `supabase/schema.sql`) dopuszczają publiczny odczyt i dodawanie.
- Przy wejściu ładujemy ostatnie 50 wiadomości (historia z bazy), potem dokładają
  się nowe z kanału Realtime. Duplikaty (echo własnego wpisu) odsiewamy po `id`.
- Bez logowania — użytkownik podaje **ksywkę** (zapamiętaną w `localStorage`).

## Uruchomienie / deploy

1. **Załóż projekt** w [Supabase](https://supabase.com) (Dashboard → New project).
2. **Schemat + Realtime:** SQL Editor → New query → wklej i uruchom
   [`supabase/schema.sql`](supabase/schema.sql). Tworzy tabelę `messages`, reguły RLS
   i dodaje tabelę do publikacji `supabase_realtime` (włącza WebSocket).
3. **Klucze:** w `lib/config.js` wpisz `SUPABASE_URL` i `SUPABASE_ANON_KEY`
   (Dashboard → Project Settings → API → *Project URL* oraz klucz *anon public*).
   Oba są publiczne — dostęp ogranicza RLS.
4. **Lokalnie:** `npm install` → `npm run dev` → http://localhost:3000
5. **Deploy (Vercel):** New Project → import `Riceookie/czat-na-zywo` → Deploy.
   (Żadne sekrety serwerowe nie są potrzebne — czat używa tylko klucza anon.)

## Jak sprawdzić „na żywo"

Otwórz demo w **dwóch kartach** (albo na dwóch urządzeniach), ustaw różne ksywki
i napisz coś w jednej — wiadomość pojawi się w drugiej **od razu**. Kropka przy
nagłówku świeci na zielono, gdy kanał WebSocket jest połączony.
