import { Layer, Source } from 'react-map-gl/mapbox'
import { useShowPlanes } from '~/hooks/local-storage'
import { PLANE_ICON_NAME, PLANE_LAYER_ID, PLANE_SOURCE_ID } from '~/lib/constants'
import { useStore } from '~/lib/stores'
import type { PlanesGeoJSON } from '~/lib/types'

export function PlanesLayer({ planesGeoJSON }: { planesGeoJSON: PlanesGeoJSON }) {
  const selectedPlaneICAO24 = useStore((s) => s.selectedPlaneICAO24)

  const [showPlanes] = useShowPlanes()

  return (
    <Source id={PLANE_SOURCE_ID} data={planesGeoJSON} type="geojson">
      <Layer
        id={PLANE_LAYER_ID}
        source={PLANE_SOURCE_ID}
        type="symbol"
        layout={{
          visibility: showPlanes ? 'visible' : 'none',
          'icon-image': PLANE_ICON_NAME,
          'icon-size': 0.3,
          'icon-rotate': ['get', 'trueTrack'],
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
          'symbol-z-order': 'source',
          'symbol-sort-key': ['case', ['==', ['get', 'onGround'], true], 0, 1],
        }}
        paint={{
          'icon-opacity': 0.7,
          'icon-color': [
            'case',
            ['==', ['get', 'icao24'], selectedPlaneICAO24 ?? null],
            '#00c910',
            ['==', ['get', 'onGround'], true],
            '#b6b6b6',
            '#fff',
          ],
        }}
      />
    </Source>
  )
}
