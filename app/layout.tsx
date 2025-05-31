import './globals.css'
import { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <main className="max-w-xl mx-auto p-4">{children}</main>
      </body>
    </html>
  )
}
