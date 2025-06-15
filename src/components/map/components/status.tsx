import { Loading } from '~/components/ui/loading'
import { MapCard } from '~/components/ui/map-card'
import { useAirportsQuery } from '~/data/airports'
import { usePlanesQuery } from '~/data/planes'
import { useShowPlaneTable } from '~/hooks/local-storage'
import type { FetchBounds } from '~/lib/types'

export default function Status({ fetchBounds }: { fetchBounds: FetchBounds }) {
  const [showPlaneTable] = useShowPlaneTable()

  const { error: planesError, isPending: planesPending } = usePlanesQuery(fetchBounds)
  const { error: airportsError, isPending: airportsPending } = useAirportsQuery()

  const planesErrorMessage = planesError
    ? planesError.cause === 429
      ? 'planes API limit hit\nplease switch IP\nor come back tomorrow'
      : 'failed to load planes'
    : null

  if (planesPending && !showPlaneTable)
    return (
      <MapCard position="bottom-right" className="hidden sm:block">
        loading planes
        <Loading />
      </MapCard>
    )
  if (airportsPending && !showPlaneTable)
    return (
      <MapCard position="bottom-right" className="hidden sm:block">
        loading airports
        <Loading />
      </MapCard>
    )

  if (planesError)
    return (
      <MapCard position="bottom-right" variant="error" className="z-20 whitespace-pre">
        {planesErrorMessage}
      </MapCard>
    )
  if (airportsError)
    return (
      <MapCard position="bottom-right" variant="error" className="z-20">
        failed to load airports
      </MapCard>
    )
}
