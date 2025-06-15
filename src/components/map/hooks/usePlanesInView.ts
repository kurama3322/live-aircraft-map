import type React from 'react'
import { useCallback, useState } from 'react'
import { throttle } from 'es-toolkit'
import type { MapRef } from 'react-map-gl/mapbox'
import type { PlanesData } from '~/data/planes'
import { useStore } from '~/lib/stores'
import type { TablePlane } from '~/lib/types'

export function usePlanesInView(planesData: PlanesData) {
  const setIsPlaneTableFrozen = useStore((s) => s.setIsPlaneTableFrozen)

  const [planesInView, setPlanesInView] = useState<TablePlane[]>([])
  const [planesInViewCount, setPlanesInViewCount] = useState<number | undefined>(
    undefined,
  )

  const updatePlanesInView = useCallback(
    (mapRef: React.RefObject<MapRef | null>) => {
      const bounds = mapRef.current?.getBounds()
      if (!bounds) return

      setPlanesInView(
        planesData
          .getPlanesInBounds(
            bounds.getWest(),
            bounds.getSouth(),
            bounds.getEast(),
            bounds.getNorth(),
          )
          .map((plane) => ({
            originCountry: plane.originCountry,
            velocity: plane.velocity,
            verticalRate: plane.verticalRate,
            geoAltitude: plane.geoAltitude,
            icao24: plane.icao24,
            onGround: plane.onGround,
          })),
      )

      setIsPlaneTableFrozen(false)
    },
    [planesData, setIsPlaneTableFrozen],
  )

  const updatePlanesInViewCount = throttle((mapRef: React.RefObject<MapRef | null>) => {
    const bounds = mapRef.current?.getBounds()
    if (!bounds) return

    setPlanesInViewCount(
      planesData.getPlanesInBounds(
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ).length,
    )
  }, 45)

  return {
    planesInView,
    updatePlanesInView,
    planesInViewCount,
    updatePlanesInViewCount,
  }
}
