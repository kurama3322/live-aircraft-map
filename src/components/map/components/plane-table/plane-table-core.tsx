import { useRef } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/shadcn/table'
import { usePlaneTableSorting } from '~/hooks/local-storage'
import { useStore } from '~/lib/stores'
import type { TablePlane } from '~/lib/types'
import { columns } from './columns'

export function PlaneTableCore({ data }: { data: TablePlane[] }) {
  const setSelectedPlaneICAO24 = useStore((s) => s.setSelectedPlaneICAO24)

  const [sorting, setSortingWithLocalStorage] = usePlaneTableSorting()

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSortingWithLocalStorage,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const sortedRows = table.getSortedRowModel().rows

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: sortedRows.length,
    overscan: 25,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 37,
  })
  const virtualRows = virtualizer.getVirtualItems()

  return (
    <div className="relative flex h-full flex-col">
      {/* sticky header */}
      {/* the easiest way to make the header sticky and preserve shadcn styles is to use 2 tables */}
      <div className="sticky top-0">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              {table.getHeaderGroups()[0]?.headers.map((header) => (
                <TableHead
                  key={`${header.id}_${sorting.find((s) => s.id === header.id)?.desc}`}
                  style={{
                    width: `${header.column.getSize()}px`,
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        </Table>
      </div>
      {/* scrollable data */}
      <div ref={scrollContainerRef} className="flex-1 overflow-auto">
        <div
          className="relative"
          style={{
            height: `${virtualizer.getTotalSize()}px`,
          }}
        >
          <div
            className="absolute top-0 left-0 w-full"
            style={{
              transform: `translateY(${virtualRows[0]?.start ?? 0}px)`,
            }}
          >
            <Table className="table-fixed">
              <TableBody>
                {virtualRows.map((virtualRow) => {
                  const row = sortedRows[virtualRow.index]
                  if (!row) return null
                  return (
                    <TableRow
                      key={row.id}
                      onMouseEnter={() => setSelectedPlaneICAO24(row.original.icao24)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          style={{
                            width: `${cell.column.getSize()}px`,
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
