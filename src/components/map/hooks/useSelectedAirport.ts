import type { MapMouseEvent } from 'mapbox-gl'
import { useStore } from 'src/lib/stores'
import { AIRPORT_LAYER_ID } from '~/lib/constants'

export function useSelectedAirport() {
  const setSelectedAirportId = useStore((s) => s.setSelectedAirportId)

  const updateSelectedAirport = (e: MapMouseEvent) => {
    const feature = e.features?.[0]

    if (feature?.layer?.id === AIRPORT_LAYER_ID) {
      setSelectedAirportId(feature?.properties?.id as string)
    } else {
      setSelectedAirportId(null)
    }
  }

  return {
    updateSelectedAirport,
  }
}
