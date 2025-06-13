import type { ViewState } from 'react-map-gl/mapbox'
import type { FetchBounds } from '~/lib/types'

const initialLng = 0
const initialLat = 51.45
const lngOffset = 1.4
const latOffset = 0.5

export const INITIAL_VIEW_STATE: Partial<ViewState> = {
  longitude: initialLng,
  latitude: initialLat,
  zoom: 9,
}

export const INITIAL_FETCH_BOUNDS: FetchBounds = {
  lngMin: initialLng - lngOffset,
  lngMax: initialLng + lngOffset,
  latMin: initialLat - latOffset,
  latMax: initialLat + latOffset,
}

export const PLANE_ICON_FILE = '/plane.webp'
export const PLANE_ICON_NAME = 'PLANE_ICON_NAME'
export const PLANE_SOURCE_ID = 'PLANE_SOURCE_ID'
export const PLANE_LAYER_ID = 'PLANE_LAYER_ID'

export const AIRPORT_ICON_FILE = '/airport.webp'
export const AIRPORT_ICON_NAME = 'AIRPORT_ICON_NAME'
export const AIRPORT_SOURCE_ID = 'AIRPORT_SOURCE_ID'
export const AIRPORT_LAYER_ID = 'AIRPORT_LAYER_ID'
