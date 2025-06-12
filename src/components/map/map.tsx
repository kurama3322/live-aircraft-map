'use client'

import { Map as MapboxMap } from 'react-map-gl/mapbox'
import { env } from '~/env'
import { INITIAL_VIEW_STATE } from '~/lib/constants'
import 'mapbox-gl/dist/mapbox-gl.css'
import '~/components/map/map.css'

export function Map() {
  return (
    <MapboxMap
      initialViewState={INITIAL_VIEW_STATE}
      minZoom={1.8}
      maxZoom={17}
      maxPitch={0}
      attributionControl={false}
      performanceMetricsCollection={false}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_TOKEN}
    />
  )
}
