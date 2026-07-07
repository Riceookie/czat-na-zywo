import './globals.css'

export const metadata = {
  title: 'Czat na żywo (WebSocket)',
  description: 'Publiczny czat w czasie rzeczywistym. Next.js + Supabase Realtime (WebSocket).',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>
        <main className="container">{children}</main>
      </body>
    </html>
  )
}
