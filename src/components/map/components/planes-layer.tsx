import { Layer, Source } from 'react-map-gl/mapbox'
import { PLANE_ICON_NAME, PLANE_LAYER_ID, PLANE_SOURCE_ID } from '~/lib/constants'
import type { PlanesGeoJSON } from '~/lib/types'

export function PlanesLayer({ planesGeoJSON }: { planesGeoJSON: PlanesGeoJSON }) {
  return (
    <Source id={PLANE_SOURCE_ID} data={planesGeoJSON} type="geojson">
      <Layer
        id={PLANE_LAYER_ID}
        source={PLANE_SOURCE_ID}
        type="symbol"
        layout={{
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
          'icon-color': ['case', ['==', ['get', 'onGround'], true], '#b6b6b6', '#fff'],
        }}
      />
    </Source>
  )
}
