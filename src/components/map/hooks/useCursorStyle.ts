import { useState } from 'react'
import type { MapMouseEvent } from 'mapbox-gl'
import { AIRPORT_LAYER_ID, PLANE_LAYER_ID } from '~/lib/constants'
import { useStore } from '~/lib/stores'

export function useCursorStyle() {
  const selectedPlaneICAO24 = useStore((s) => s.selectedPlaneICAO24)
  const selectedAirportId = useStore((s) => s.selectedAirportId)

  const [cursorStyle, setCursorStyle] = useState<'auto' | 'pointer'>('auto')

  const updateCursorStyle = (e: MapMouseEvent) => {
    if (
      selectedPlaneICAO24 ||
      selectedAirportId ||
      e.features?.[0]?.layer?.id === PLANE_LAYER_ID ||
      e.features?.[0]?.layer?.id === AIRPORT_LAYER_ID
    ) {
      setCursorStyle('pointer')
    } else {
      setCursorStyle('auto')
    }
  }

  return {
    cursorStyle,
    updateCursorStyle,
  }
}
