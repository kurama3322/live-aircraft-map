import type { FeatureCollection, Geometry } from 'geojson'
import { Layer, Source } from 'react-map-gl/mapbox'
import { useAirportsQuery } from '~/data/airports'
import { AIRPORT_ICON_NAME, AIRPORT_LAYER_ID, AIRPORT_SOURCE_ID } from '~/lib/constants'
import type { AirportMinimal } from '~/lib/types'

export default function AirportsLayer() {
  const { data, error, isPending } = useAirportsQuery()
  if (isPending || error) return null

  const airportGeoJSON = getAirportGeoJSON(data?.airports)

  return (
    <Source id={AIRPORT_SOURCE_ID} data={airportGeoJSON} type="geojson">
      <Layer
        id={AIRPORT_LAYER_ID}
        source={AIRPORT_SOURCE_ID}
        type="symbol"
        layout={{
          'icon-image': AIRPORT_ICON_NAME,
          'icon-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            // at zoom 1 icon size is 0.032
            1,
            0.032,
            // at zoom 20 icon size is 0.75
            20,
            0.75,
          ],
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
        }}
        paint={{
          'icon-opacity': 0.7,
          'icon-color': '#da98ea',
        }}
      />
    </Source>
  )
}

function getAirportGeoJSON(
  airports?: AirportMinimal[],
): FeatureCollection<Geometry, AirportMinimal> {
  return {
    type: 'FeatureCollection',
    features:
      airports?.map((airport) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [airport.longitude, airport.latitude],
        },
        properties: airport,
      })) ?? [],
  }
}
