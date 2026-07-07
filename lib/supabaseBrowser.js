import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js'

// Klient dla przeglądarki. Czat jest anonimowy (bez logowania), więc nie trzymamy
// sesji. Ten sam klient obsługuje zwykłe zapytania (select/insert) ORAZ kanał
// Realtime (WebSocket), na którym nasłuchujemy nowych wiadomości.
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
})
