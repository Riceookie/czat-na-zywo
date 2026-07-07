'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabaseBrowser'

const NICK_KEY = 'czat_nick'
const MAX_LEN = 500

// Godzina:minuta z timestampu wiadomości.
function godzina(iso) {
  const d = new Date(iso)
  return d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
}

export default function ChatPage() {
  const [nick, setNick] = useState(null)     // null = jeszcze nie wiadomo (SSR), '' = brak
  const [nickInput, setNickInput] = useState('')

  const [messages, setMessages] = useState([])
  const [tresc, setTresc] = useState('')
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const boxRef = useRef(null)

  // Ksywkę czytamy z localStorage dopiero po stronie klienta (bez mismatchu SSR).
  useEffect(() => {
    setNick(localStorage.getItem(NICK_KEY) || '')
  }, [])

  // Dopisz wiadomość, pomijając duplikaty (echo z Realtime po naszym własnym INSERT).
  function pushMessage(m) {
    setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]))
  }

  // Historia + subskrypcja Realtime (WebSocket). Uruchamiamy dopiero, gdy jest ksywka.
  useEffect(() => {
    if (!nick) return
    let alive = true

    async function loadHistory() {
      const { data, error } = await supabase
        .from('messages')
        .select('id, nick, tresc, created_at')
        .order('created_at', { ascending: true })
        .limit(50)
      if (!alive) return
      if (error) setError(error.message)
      else setMessages(data || [])
      setLoading(false)
    }
    loadHistory()

    // Kanał Realtime: nasłuch INSERT-ów na tabeli messages → nowe wiadomości „na żywo".
    const channel = supabase
      .channel('czat')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => pushMessage(payload.new),
      )
      .subscribe((status) => setConnected(status === 'SUBSCRIBED'))

    return () => {
      alive = false
      supabase.removeChannel(channel)
    }
  }, [nick])

  // Auto-scroll na dół przy każdej nowej wiadomości.
  useEffect(() => {
    const box = boxRef.current
    if (box) box.scrollTop = box.scrollHeight
  }, [messages])

  function zapiszNick(e) {
    e.preventDefault()
    const n = nickInput.trim().slice(0, 40)
    if (!n) return
    localStorage.setItem(NICK_KEY, n)
    setNick(n)
  }

  function zmienNick() {
    localStorage.removeItem(NICK_KEY)
    setNick('')
    setNickInput('')
    setMessages([])
    setLoading(true)
  }

  async function wyslij(e) {
    e.preventDefault()
    const body = tresc.trim()
    if (!body) return
    if (body.length > MAX_LEN) { setError(`Wiadomość jest zbyt długa (max ${MAX_LEN} znaków).`); return }
    setError(null)
    setTresc('')
    const { data, error } = await supabase
      .from('messages')
      .insert({ nick, tresc: body })
      .select('id, nick, tresc, created_at')
      .single()
    if (error) { setError(error.message); setTresc(body); return }
    // Pokaż od razu (Realtime i tak dośle echo — pushMessage odsieje duplikat po id).
    if (data) pushMessage(data)
  }

  // ── Ekran startowy: podaj ksywkę ────────────────────────────────────────────
  if (nick === null) return <p className="muted">Ładowanie…</p>
  if (nick === '') {
    return (
      <section className="narrow">
        <div className="card">
          <h1 style={{ marginTop: 0 }}>💬 Czat na żywo</h1>
          <p className="muted">Podaj ksywkę, żeby dołączyć do rozmowy.</p>
          <form onSubmit={zapiszNick}>
            <label>Ksywka
              <input className="input" maxLength={40} autoFocus
                placeholder="np. Karol" value={nickInput}
                onChange={(e) => setNickInput(e.target.value)} required />
            </label>
            <button className="btn full">Wejdź na czat</button>
          </form>
        </div>
      </section>
    )
  }

  // ── Czat ────────────────────────────────────────────────────────────────────
  return (
    <section>
      <div className="chat-head">
        <div>
          <h1>💬 Czat na żywo</h1>
          <p className="muted small">
            <span className={'dot ' + (connected ? 'on' : 'off')} />
            {connected ? 'Połączono (WebSocket)' : 'Łączenie…'} · jesteś jako <b>{nick}</b>
          </p>
        </div>
        <button className="btn ghost sm" onClick={zmienNick}>Zmień ksywkę</button>
      </div>

      <div className="messages" ref={boxRef}>
        {loading ? (
          <p className="muted empty">Ładowanie wiadomości…</p>
        ) : messages.length === 0 ? (
          <p className="muted empty">Brak wiadomości. Napisz pierwszą! 👇</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={'msg ' + (m.nick === nick ? 'mine' : 'other')}>
              <span className="msg-nick">{m.nick}</span>
              <span className="msg-text">{m.tresc}</span>
              <span className="msg-time">{godzina(m.created_at)}</span>
            </div>
          ))
        )}
      </div>

      {error && <p className="banner error">⚠️ {error}</p>}

      <form className="chat-form" onSubmit={wyslij}>
        <input className="input grow" placeholder="Napisz wiadomość…" maxLength={MAX_LEN}
          value={tresc} onChange={(e) => setTresc(e.target.value)} />
        <button className="btn" disabled={!tresc.trim()}>Wyślij</button>
      </form>
      <p className="muted small counter">{tresc.length}/{MAX_LEN}</p>
    </section>
  )
}
