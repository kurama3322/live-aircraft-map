import { MapCard } from '~/components/ui/map-card'
import { Switch } from '~/components/ui/shadcn/switch'
import { Skeleton } from '~/components/ui/skeleton'
import { useShowAirports, useShowPlanes, useShowPlaneTable } from '~/hooks/local-storage'
import { formatCoordinate } from '~/lib/formatters'
import type { CursorLocation } from '~/lib/types'

export default function MapDashboard({
  planesInViewCount,
  cursorLocation,
}: {
  planesInViewCount: number | undefined
  cursorLocation: CursorLocation | undefined
}) {
  const [showAirports, setShowAirports] = useShowAirports()
  const [showPlanes, setShowPlanes] = useShowPlanes()
  const [showPlaneTable, setShowPlaneTable] = useShowPlaneTable()

  return (
    <MapCard position="top-left">
      <div aria-live="off">
        planes in view:{' '}
        {planesInViewCount === undefined ? (
          <Skeleton className="w-[2ch]" />
        ) : showPlanes ? (
          planesInViewCount
        ) : (
          0
        )}
      </div>
      <Divider />
      <div aria-label="cursor location" aria-live="off">
        <span className="whitespace-pre">
          latitude:{'  '}
          <span>
            {typeof cursorLocation?.lat === 'number'
              ? formatCoordinate(cursorLocation.lat)
              : '-'}
          </span>
        </span>
        <br />
        <span>
          longitude:{' '}
          <span>
            {typeof cursorLocation?.lng === 'number'
              ? formatCoordinate(cursorLocation.lng)
              : '-'}
          </span>
        </span>
      </div>
      <Divider />
      <div className="flex flex-col">
        <label className="flex items-center gap-3">
          airports
          <Switch
            checked={showAirports}
            onCheckedChange={() => setShowAirports((prev) => !prev)}
            className="mt-0.25"
            aria-label="toggle airport visibility"
          />
        </label>
        <label className="flex items-center gap-3 whitespace-pre">
          planes{'  '}
          <Switch
            checked={showPlanes}
            onCheckedChange={() => setShowPlanes((prev) => !prev)}
            className="mt-0.25"
            aria-label="toggle planes visibility"
          />
        </label>
        <label className="table:flex hidden items-center gap-3 whitespace-pre">
          table{'   '}
          <Switch
            checked={showPlaneTable}
            onCheckedChange={() => setShowPlaneTable((prev) => !prev)}
            className="mt-0.25"
            aria-label="toggle plane table visibility"
          />
        </label>
      </div>
    </MapCard>
  )
}

function Divider() {
  return <hr className="h-sm:block mx-[-1.25rem] my-3 hidden border-white/30" />
}
