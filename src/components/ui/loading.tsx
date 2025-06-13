import type React from 'react'
import { useEffect, useState } from 'react'

type DotCount = 0 | 1 | 2 | 3

export function Loading() {
  const [dotCount, setDotCount] = useState<DotCount>(0)
  const dots = '.'.repeat(dotCount)

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => ((prev + 1) % 4) as DotCount)
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return <span className="inline-block w-[3ch]">{dots}</span>
}
