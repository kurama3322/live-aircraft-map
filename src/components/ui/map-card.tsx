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
  responsiveWidth?: boolean
  responsiveHeight?: boolean
  variant?: 'default' | 'error'
}

export function MapCard({
  position,
  responsiveWidth = false,
  responsiveHeight = false,
  variant = 'default',
  className,
  ...props
}: MapCardProps) {
  const positionCN = position ? positionToCN[position] : null
  const responsiveWidthCN = responsiveWidth
    ? 'xs:m-3 xs:w-94 m-0 w-full max-w-none'
    : null
  const responsiveHeightCN = responsiveHeight
    ? 'bottom-auto right-0 left-auto top-0 h-sm:bottom-0 h-sm:right-0 h-sm:left-0 h-sm:top-auto'
    : null
  const variantCN = variant === 'error' ? 'bg-red-800/90' : 'bg-[var(--transparent-bg)]'

  return (
    <Card
      className={cn(
        'h-md:max-h-150 absolute block max-h-75 max-w-sm overflow-y-auto rounded border-none px-5 py-3 wrap-break-word',
        positionCN,
        responsiveWidthCN,
        responsiveHeightCN,
        variantCN,
        className,
      )}
      {...props}
    />
  )
}
