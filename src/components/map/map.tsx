'use client'

import { useEffect, useRef, useState } from 'react'
import { debounce } from 'es-toolkit'
import {
  Map as MapboxMap,
  type MapEvent,
  type MapMouseEvent,
  type MapRef,
  type ViewStateChangeEvent,
} from 'react-map-gl/mapbox'
import { usePlanesData } from '~/data/planes'
import { env } from '~/env'
import {
  AIRPORT_LAYER_ID,
  INITIAL_FETCH_BOUNDS,
  INITIAL_VIEW_STATE,
  PLANE_LAYER_ID,
} from '~/lib/constants'
import { useStore } from '~/lib/stores'
import type { FetchBounds } from '~/lib/types'
import { AirportTooltip, useAirportTooltip } from './components/airport-tooltip'
import { AirportDetails } from './components/details/airport-details'
import { PlaneDetails } from './components/details/plane-details'
import {
  AirportsLayer,
  MapDashboard,
  PlaneTable,
  Status,
} from './components/dynamic-components'
import { PlanesLayer } from './components/layers/planes-layer'
import { getFetchBounds, getPlanesGeoJSON } from './helpers'
import { useCursorLocation } from './hooks/useCursorLocation'
import { useCursorStyle } from './hooks/useCursorStyle'
import { useMapIcons } from './hooks/useMapIcons'
import { usePlanesInView } from './hooks/usePlanesInView'
import { useSelectedAirport } from './hooks/useSelectedAirport'
import { useSelectedPlane } from './hooks/useSelectedPlane'
import 'mapbox-gl/dist/mapbox-gl.css'
import '~/components/map/map.css'

export function Map() {
  const setIsPlaneTableFrozen = useStore((s) => s.setIsPlaneTableFrozen)

  const mapRef = useRef<MapRef>(null)

  const { areIconsLoaded, loadIcons } = useMapIcons()

  const [fetchBounds, setFetchBounds] = useState<FetchBounds>(INITIAL_FETCH_BOUNDS)

  const { planesData } = usePlanesData(fetchBounds)

  const planesGeoJSON = getPlanesGeoJSON(planesData)

  const { planesInView, updatePlanesInView, planesInViewCount, updatePlanesInViewCount } =
    usePlanesInView(planesData)

  useEffect(() => {
    updatePlanesInView(mapRef)
  }, [planesData, updatePlanesInView])

  const { selectedPlane, updateSelectedPlane } = useSelectedPlane(planesData)
  const { updateSelectedAirport } = useSelectedAirport()

  const { cursorLocation, updateCursorLocation } = useCursorLocation()
  const { cursorStyle, updateCursorStyle } = useCursorStyle()
  const {
    hoveredAirport,
    updateHoveredAirport,
    resetHoveredAirport,
    screenCoords,
    updateScreenCoords,
  } = useAirportTooltip(mapRef)

  const handleLoad = (e: MapEvent) => {
    loadIcons(e)

    updatePlanesInViewCount(mapRef)
    updatePlanesInView(mapRef)

    e.target.touchZoomRotate.disableRotation()
  }

  const handleMove = () => {
    updateScreenCoords()
    updatePlanesInViewCount(mapRef)
  }

  const handleMoveEnd = debounce((e: ViewStateChangeEvent) => {
    const mapBounds = e.target.getBounds()
    if (mapBounds) setFetchBounds(getFetchBounds(mapBounds))

    if (planesInViewCount === 0) updatePlanesInView(mapRef)
  }, 1000 * 0.1)

  const handleMouseMove = (e: MapMouseEvent) => {
    updateHoveredAirport(e)
    updateCursorLocation(e)
    updateCursorStyle(e)
  }

  const handleMouseDown = (e: MapMouseEvent) => {
    updateSelectedAirport(e)
    updateSelectedPlane(e)
  }

  return (
    <>
      <MapboxMap
        ref={mapRef}
        onLoad={handleLoad}
        onSourceData={() => updatePlanesInViewCount(mapRef)}
        onMoveStart={() => setIsPlaneTableFrozen(true)}
        onMoveEnd={handleMoveEnd}
        onMove={handleMove}
        onMouseMove={handleMouseMove}
        onMouseOut={() => resetHoveredAirport()}
        onMouseDown={handleMouseDown}
        onMouseUp={updateCursorStyle}
        cursor={cursorStyle}
        initialViewState={INITIAL_VIEW_STATE}
        interactiveLayerIds={[AIRPORT_LAYER_ID, PLANE_LAYER_ID]}
        minZoom={1.8}
        maxZoom={17}
        maxPitch={0}
        dragRotate={false}
        attributionControl={false}
        performanceMetricsCollection={false}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_TOKEN}
      >
        {areIconsLoaded && (
          <>
            <PlanesLayer planesGeoJSON={planesGeoJSON} />
            <AirportsLayer />
          </>
        )}
      </MapboxMap>
      <MapDashboard
        planesInViewCount={planesInViewCount}
        cursorLocation={cursorLocation}
      />
      <Status fetchBounds={fetchBounds} />
      <PlaneDetails plane={selectedPlane} />
      <PlaneTable data={planesInView} />
      <AirportDetails />
      <AirportTooltip text={hoveredAirport?.iataCode} screenCoords={screenCoords} />
    </>
  )
}
