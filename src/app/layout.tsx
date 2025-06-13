import type React from 'react'
import '@total-typescript/ts-reset'
import type { Metadata } from 'next'
import { Reddit_Mono } from 'next/font/google'
import Script from 'next/script'
import { Providers } from '~/components/providers'
import '~/app/globals.css'

const redditMono = Reddit_Mono({
  variable: '--font-reddit-mono',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning is needed for next-themes https://www.npmjs.com/package/next-themes
    // this property only applies 1 level deep https://nextjs.org/docs/messages/react-hydration-error
    <html lang="en" suppressHydrationWarning>
      {/*https://www.npmjs.com/package/react-scan*/}
      <Script src="https://cdn.jsdelivr.net/npm/react-scan/dist/auto.global.js" />
      <body className={`${redditMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: 'planes',
  description: 'live aircraft map',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}
