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

  const loMin = mapBounds.getWest()
  const loMax = mapBounds.getEast()
  const laMin = mapBounds.getSouth()
  const laMax = mapBounds.getNorth()

  const loDiff = loMax - loMin
  const laDiff = laMax - laMin

  return {
    lngMin: loMin - loDiff * boundsBuffer,
    lngMax: loMax + loDiff * boundsBuffer,
    latMin: laMin - laDiff * boundsBuffer,
    latMax: laMax + laDiff * boundsBuffer,
  }
}
