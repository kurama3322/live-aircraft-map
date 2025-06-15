'use client'

import type React from 'react'
import { useEffect } from 'react'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { LazyMotion } from 'motion/react'
import { ThemeProvider } from 'next-themes'

const queryClient = new QueryClient()

// https://motion.dev/docs/react-reduce-bundle-size#lazy-loading
const loadFeatures = () => import('./motionFeatures').then((mod) => mod.default)

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const persister = createSyncStoragePersister({
        storage: window.localStorage,
      })
      void persistQueryClient({
        queryClient,
        persister,
      })
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        <LazyMotion features={loadFeatures} strict>
          {children}
        </LazyMotion>
      </ThemeProvider>
      <ReactQueryDevtools buttonPosition="bottom-right" />
    </QueryClientProvider>
  )
}
