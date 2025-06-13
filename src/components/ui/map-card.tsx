import type React from 'react'
import { Card } from '~/components/ui/shadcn/card'
import { cn } from '~/lib/utils'

const positionToCN = {
  'top-left': 'top-0 left-0 m-3',
  'top-right': 'top-0 right-0 m-3',
  'bottom-left': 'bottom-0 left-0 m-3',
  'bottom-right': 'bottom-0 right-0 m-3',
} as const

interface MapCardProps extends React.ComponentPropsWithoutRef<'div'> {
  position?: keyof typeof positionToCN
  variant?: 'default' | 'error'
}

export function MapCard({
  position,
  variant = 'default',
  className,
  ...props
}: MapCardProps) {
  const positionCN = position ? positionToCN[position] : null
  const variantCN = variant === 'error' ? 'bg-red-800/90' : 'bg-black/70'

  return (
    <Card
      className={cn(
        'absolute block max-w-sm rounded border-none px-5 py-3 wrap-break-word',
        positionCN,
        variantCN,
        className,
      )}
      {...props}
    />
  )
}
