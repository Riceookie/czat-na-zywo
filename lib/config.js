// Wartości PUBLICZNE (bezpieczne w kodzie i w przeglądarce):
// - URL projektu Supabase,
// - klucz "anon / publishable" (przeznaczony do klienta; dostęp ogranicza RLS w bazie).
// Klucz "service_role" NIE jest tu potrzebny — czat pisze/czyta kluczem anon,
// a reguły RLS (patrz supabase/schema.sql) dopuszczają publiczny odczyt i dodawanie.
//
// ⬇️ WKLEJ WARTOŚCI Z NOWEGO PROJEKTU SUPABASE
//    Dashboard → Project Settings → API:
//    „Project URL" oraz klucz „anon public" (albo „publishable").
export const SUPABASE_URL = 'https://supabase.com/dashboard/project/bgtauybkpijwnaeiqayo'      // ⬅️ wklej Project URL
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJndGF1eWJrcGlqd25hZWlxYXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzODY3MjksImV4cCI6MjA5ODk2MjcyOX0.L0daYxMNYB2NIFZeKFSOHagF_bwycEfLxXMhhr7172k' // ⬅️ wklej anon/publishable key
