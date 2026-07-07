// Wartości PUBLICZNE (bezpieczne w kodzie i w przeglądarce):
// - URL projektu Supabase,
// - klucz "anon / publishable" (przeznaczony do klienta; dostęp ogranicza RLS w bazie).
// Klucz "service_role" NIE jest tu potrzebny — czat pisze/czyta kluczem anon,
// a reguły RLS (patrz supabase/schema.sql) dopuszczają publiczny odczyt i dodawanie.
//
// ⬇️ WKLEJ WARTOŚCI Z NOWEGO PROJEKTU SUPABASE
//    Dashboard → Project Settings → API:
//    „Project URL" oraz klucz „anon public" (albo „publishable").
export const SUPABASE_URL = 'https://TWOJ-PROJEKT.supabase.co'      // ⬅️ wklej Project URL
export const SUPABASE_ANON_KEY = 'WKLEJ_TUTAJ_ANON_PUBLISHABLE_KEY' // ⬅️ wklej anon/publishable key
