import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { primaryInput } from 'detect-it'
import type { MapMouseEvent, MapRef } from 'react-map-gl/mapbox'
import { AIRPORT_LAYER_ID } from '~/lib/constants'
import type { AirportMinimal } from '~/lib/types'

type ScreenCoords = {
  x: number
  y: number
}

export function AirportTooltip({
  text,
  screenCoords,
}: {
  text?: string
  screenCoords: ScreenCoords | null
}) {
  if (!text || !screenCoords) return null

  return (
    <div
      className="text-md pointer-events-none absolute z-10 rounded bg-[var(--transparent-bg)] px-2 py-1 shadow-lg"
      style={{
        left: screenCoords.x,
        top: screenCoords.y,
        transform: 'translate(-50%, -150%)',
      }}
      role="tooltip"
      aria-label={`${text} airport`}
    >
      {text}
    </div>
  )
}

export function useAirportTooltip(mapRef: React.RefObject<MapRef | null>) {
  const [hoveredAirport, setHoveredAirport] = useState<AirportMinimal | null>(null)
  const [screenCoords, setScreenCoords] = useState<ScreenCoords | null>(null)

  const updateHoveredAirport = (e: MapMouseEvent) => {
    const map = e.target
    if (!map.getLayer(AIRPORT_LAYER_ID) || primaryInput !== 'mouse') return

    const features = map.queryRenderedFeatures(e.point, {
      layers: [AIRPORT_LAYER_ID],
    })
    const airport = features[0]?.properties as AirportMinimal | undefined
    setHoveredAirport(airport ?? null)
  }

  const resetHoveredAirport = () => {
    setHoveredAirport(null)
  }

  // useCallback is not needed as RC handles this, but it keeps eslint happy
  const updateScreenCoords = useCallback(() => {
    if (!mapRef.current || !hoveredAirport) {
      setScreenCoords(null)
      return
    }
    const { x, y } = mapRef.current.project([
      hoveredAirport.longitude,
      hoveredAirport.latitude,
    ])
    setScreenCoords({ x, y })
  }, [mapRef, hoveredAirport])

  useEffect(() => {
    updateScreenCoords()
  }, [hoveredAirport, updateScreenCoords])

  return {
    hoveredAirport,
    updateHoveredAirport,
    resetHoveredAirport,
    screenCoords,
    updateScreenCoords,
  }
}
