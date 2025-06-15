import { useState } from 'react'
import type { MapMouseEvent } from 'mapbox-gl'
import type { CursorLocation } from '~/lib/types'

export function useCursorLocation() {
  const [cursorLocation, setCursorLocation] = useState<CursorLocation | undefined>(
    undefined,
  )

  const updateCursorLocation = (e: MapMouseEvent) => {
    setCursorLocation({
      lng: normaliseLng(e.lngLat.lng),
      lat: e.lngLat.lat,
    })
  }

  return {
    cursorLocation,
    updateCursorLocation,
  }
}

// normalise longitude to [-180, 180]
function normaliseLng(longitude: number) {
  return ((((longitude + 180) % 360) + 360) % 360) - 180
}
