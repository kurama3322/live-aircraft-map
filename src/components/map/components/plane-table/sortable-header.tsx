import type { ReactNode } from 'react'
import type { Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp } from 'lucide-react'

export function SortableHeader<TData, TValue>({
  column,
  children,
}: {
  column: Column<TData, TValue>
  children: ReactNode
}) {
  const direction = column.getIsSorted()

  return (
    <div
      className="flex cursor-pointer items-center select-none"
      onClick={() => column.toggleSorting()}
      aria-label={`sort by ${column.id}`}
      aria-sort={
        direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'none'
      }
    >
      {children}
      {direction === 'asc' && <ArrowUp className="ml-1 h-4 w-4" />}
      {direction === 'desc' && <ArrowDown className="ml-1 h-4 w-4" />}
    </div>
  )
}
