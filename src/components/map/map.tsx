'use client'

import { useState } from 'react'
import { debounce } from 'es-toolkit'
import { Map as MapboxMap, type ViewStateChangeEvent } from 'react-map-gl/mapbox'
import { PlanesLayer } from '~/components/map/components/planes-layer'
import { getFetchBounds, getPlanesGeoJSON } from '~/components/map/helpers'
import { useMapIcons } from '~/components/map/hooks/useMapIcons'
import { usePlanesData } from '~/data/planes'
import { env } from '~/env'
import { INITIAL_FETCH_BOUNDS, INITIAL_VIEW_STATE } from '~/lib/constants'
import type { FetchBounds } from '~/lib/types'
import 'mapbox-gl/dist/mapbox-gl.css'
import '~/components/map/map.css'

export function Map() {
  const [fetchBounds, setFetchBounds] = useState<FetchBounds>(INITIAL_FETCH_BOUNDS)
  const { planesData } = usePlanesData(fetchBounds)
  const planesGeoJSON = getPlanesGeoJSON(planesData)

  const { areIconsLoaded, loadIcons } = useMapIcons()

  const handleMoveEnd = debounce((e: ViewStateChangeEvent) => {
    const mapBounds = e.target.getBounds()
    if (mapBounds) setFetchBounds(getFetchBounds(mapBounds))
  }, 1000 * 0.1)

  return (
    <MapboxMap
      onLoad={loadIcons}
      onMoveEnd={handleMoveEnd}
      initialViewState={INITIAL_VIEW_STATE}
      minZoom={1.8}
      maxZoom={17}
      maxPitch={0}
      attributionControl={false}
      performanceMetricsCollection={false}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_TOKEN}
    >
      {areIconsLoaded && <PlanesLayer planesGeoJSON={planesGeoJSON} />}
    </MapboxMap>
  )
}
