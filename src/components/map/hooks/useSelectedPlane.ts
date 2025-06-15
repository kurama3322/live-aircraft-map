import { useEffect } from 'react'
import type { MapMouseEvent } from 'mapbox-gl'
import type { PlanesData } from '~/data/planes'
import { PLANE_LAYER_ID } from '~/lib/constants'
import { useStore } from '~/lib/stores'

export function useSelectedPlane(planesData: PlanesData) {
  const selectedPlaneICAO24 = useStore((s) => s.selectedPlaneICAO24)
  const setSelectedPlaneICAO24 = useStore((s) => s.setSelectedPlaneICAO24)

  const selectedPlane = selectedPlaneICAO24
    ? (planesData.getPlane(selectedPlaneICAO24) ?? null)
    : null

  useEffect(() => {
    if (selectedPlaneICAO24 && !planesData.getPlane(selectedPlaneICAO24)) {
      setSelectedPlaneICAO24(null)
    }
  }, [planesData, selectedPlaneICAO24, setSelectedPlaneICAO24])

  const updateSelectedPlane = (e: MapMouseEvent) => {
    const feature = e.features?.[0]

    if (feature?.layer?.id === PLANE_LAYER_ID) {
      setSelectedPlaneICAO24(feature?.properties?.icao24 as string)
    } else {
      setSelectedPlaneICAO24(null)
    }
  }

  return {
    selectedPlane,
    updateSelectedPlane,
  }
}
