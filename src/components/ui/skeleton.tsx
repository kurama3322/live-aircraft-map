import type React from 'react'
import { cn } from '~/lib/utils'

export function Skeleton({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      className={cn(
        'mb-1 inline-block h-4 animate-pulse rounded bg-white/20 align-middle',
        className,
      )}
      {...props}
    />
  )
}
