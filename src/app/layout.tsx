import type { Metadata } from 'next'
import { Sarabun } from 'next/font/google'
import './globals.css'

import { Toaster } from '@/components/ui/sonner'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import { OverlayProvider } from '@/hooks/contexts/use-overlay'

const sarabun = Sarabun({
  variable: '--font-sarabun',
  subsets: ['latin', 'thai'],
  weight: ['100', '200', '300', '400', '500'],
})

export const metadata: Metadata = {
  title: 'Mini Contracts',
  description: 'Mini Contracts Management App ',
  authors: [{ name: 'Apisit Saithong' }],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  return (
    <html lang="en">
      <body
        className={`${sarabun.className} antialiased`}
      >
        <SessionProvider session={session}>
          <OverlayProvider>{children}</OverlayProvider>
        </SessionProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
