import { useEffect, useState } from 'react'
import { PlanesData, usePlanesQuery } from '~/data/planes'
import type { FetchBounds } from '~/lib/types'

export function usePlanesData(bounds: FetchBounds) {
  const [planesData, setPlanesData] = useState<PlanesData>(() => new PlanesData())

  // this request in made on the client for 2 reasons:
  // 1. error 429 (API rate limiting)
  // 2. speed
  const { data } = usePlanesQuery(bounds)

  useEffect(() => {
    setPlanesData((prev) => prev.merge(data?.states ?? null))
  }, [data])

  useEffect(() => {
    const interval = setInterval(() => {
      setPlanesData((prev) => prev.cleanupStalePlanes())
    }, PlanesData.MAX_CACHE_AGE_SECONDS * 1000)

    return () => clearInterval(interval)
  }, [])

  return {
    planesData,
  }
}
