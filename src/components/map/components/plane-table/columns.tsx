import type { Column, ColumnDef } from '@tanstack/react-table'
import {
  formatAltitude,
  formatCountry,
  formatICAO24,
  formatVelocity,
  formatVerticalRate,
} from '~/lib/formatters'
import type { TablePlane } from '~/lib/types'
import { tableScrambleAttr } from './constants'
import { SortableHeader } from './sortable-header'

export const columns: ColumnDef<TablePlane>[] = [
  {
    accessorKey: 'originCountry',
    header: createSortableHeader('country'),
    cell: (props) => {
      const value = props.getValue<TablePlane['originCountry']>()
      const text = formatCountry(value)

      return (
        <div {...{ [tableScrambleAttr]: text }} className="truncate">
          {text}
        </div>
      )
    },
    size: 250,
  },
  {
    accessorKey: 'velocity',
    header: createSortableHeader('ground speed'),
    cell: (props) => {
      const value = props.getValue<TablePlane['velocity']>()
      const text = formatVelocity(value)

      return <div {...{ [tableScrambleAttr]: text }}>{text}</div>
    },
    size: 130,
  },
  {
    id: 'verticalRate',
    accessorFn: getAccessorFn('verticalRate'),
    sortUndefined: 'last',
    header: createSortableHeader('vertical rate'),
    cell: (props) => {
      const value = props.getValue<AccessorFnReturnType<'verticalRate'>>()
      const text = formatVerticalRate(value, props.row.original.onGround)

      return <div {...{ [tableScrambleAttr]: text }}>{text}</div>
    },
    size: 140,
  },
  {
    id: 'geoAltitude',
    accessorFn: getAccessorFn('geoAltitude'),
    sortUndefined: 'last',
    header: createSortableHeader('altitude'),
    cell: (props) => {
      const value = props.getValue<AccessorFnReturnType<'geoAltitude'>>()
      const text = formatAltitude(value, props.row.original.onGround)

      return <div {...{ [tableScrambleAttr]: text }}>{text}</div>
    },
    size: 110,
  },
  {
    accessorKey: 'icao24',
    header: createSortableHeader('ICAO24'),
    cell: (props) => {
      const value = props.getValue<TablePlane['icao24']>()
      const text = formatICAO24(value)

      return <div {...{ [tableScrambleAttr]: text }}>{text}</div>
    },
    size: 90,
  },
]

function createSortableHeader<TData, TValue>(title: string) {
  function Header({ column }: { column: Column<TData, TValue> }) {
    return <SortableHeader column={column}>{title}</SortableHeader>
  }
  Header.displayName = `${SortableHeader.name} ${title}`
  return Header
}

// coupled with `sortUndefined: 'last'` always sorts `null` values last
// https://github.com/TanStack/table/discussions/2371#discussioncomment-9534058
function getAccessorFn<TKey extends keyof TablePlane>(key: TKey) {
  return (plane: TablePlane) => plane[key] ?? undefined
}
type AccessorFnReturnType<TKey extends keyof TablePlane> = ReturnType<
  ReturnType<typeof getAccessorFn<TKey>>
>
