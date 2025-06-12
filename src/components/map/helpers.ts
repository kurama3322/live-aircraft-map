import type { LngLatBounds } from 'mapbox-gl'
import type { PlanesData } from '~/data/planes'
import type { FetchBounds, PlanesGeoJSON } from '~/lib/types'

export function getPlanesGeoJSON(planesData: PlanesData): PlanesGeoJSON {
  return {
    type: 'FeatureCollection',
    features: planesData.getPlanes().map((plane) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [plane.longitude, plane.latitude],
      },
      properties: plane,
    })),
  }
}

export function getFetchBounds(mapBounds: LngLatBounds): FetchBounds {
  const boundsBuffer = 0.1

  const laMin = mapBounds.getSouth()
  const laMax = mapBounds.getNorth()
  const loMin = mapBounds.getWest()
  const loMax = mapBounds.getEast()

  const laDiff = laMax - laMin
  const loDiff = loMax - loMin

  return {
    latMin: laMin - laDiff * boundsBuffer,
    latMax: laMax + laDiff * boundsBuffer,
    lngMin: loMin - loDiff * boundsBuffer,
    lngMax: loMax + loDiff * boundsBuffer,
  }
}
