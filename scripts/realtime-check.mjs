// Test E2E kanału Realtime (WebSocket): subskrybent nasłuchuje INSERT-ów,
// a "nadawca" wstawia wiadomość — sprawdzamy, czy dotarła po WebSockecie.
import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../lib/config.js'

const listener = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } })
const sender = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } })

const marker = 'e2e-' + Math.floor(Date.now())
let got = false

const channel = listener
  .channel('czat')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (p) => {
    if (p.new.tresc === marker) {
      got = true
      console.log('✅ Odebrano po WebSockecie:', JSON.stringify(p.new))
    }
  })
  .subscribe(async (status) => {
    console.log('kanał status:', status)
    if (status === 'SUBSCRIBED') {
      const { error } = await sender.from('messages').insert({ nick: 'test-e2e', tresc: marker })
      if (error) { console.error('❌ INSERT błąd:', error.message); process.exit(1) }
      console.log('➡️  wysłano wiadomość:', marker)
    }
  })

setTimeout(async () => {
  await listener.removeChannel(channel)
  console.log(got ? '\nWYNIK: ✅ Realtime (WebSocket) działa' : '\nWYNIK: ❌ Nie doszła wiadomość realtime')
  process.exit(got ? 0 : 1)
}, 8000)
