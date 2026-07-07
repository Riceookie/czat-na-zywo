// Wartości PUBLICZNE (bezpieczne w kodzie i w przeglądarce):
// - URL projektu Supabase,
// - klucz "anon" (przeznaczony do klienta; dostęp ogranicza RLS w bazie).
// Klucz "service_role" NIE jest tu potrzebny — czat pisze/czyta kluczem anon,
// a reguły RLS (patrz supabase/schema.sql) dopuszczają publiczny odczyt i dodawanie.
//
// ⚠️ WAŻNE (dwa częste błędy):
// 1) SUPABASE_URL to adres API projektu (`https://<ref>.supabase.co`), a NIE adres
//    dashboardu (`https://supabase.com/dashboard/project/<ref>`).
// 2) Dla Realtime (postgres_changes) używamy KLASYCZNEGO anon key w formacie JWT
//    (Dashboard → Project Settings → API → „anon public", zaczyna się od `eyJ...`).
//    Nowy klucz „publishable" (`sb_publishable_...`) łączy się, ale NIE dostarcza
//    eventów realtime (autoryzacja RLS przy kanale wymaga JWT).
export const SUPABASE_URL = 'https://bgtauybkpijwnaeiqayo.supabase.co'
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJndGF1eWJrcGlqd25hZWlxYXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzODY3MjksImV4cCI6MjA5ODk2MjcyOX0.L0daYxMNYB2NIFZeKFSOHagF_bwycEfLxXMhhr7172k'
