import type { ViewState } from 'react-map-gl/mapbox'
import type { FetchBounds } from '~/lib/types'

const initialLat = 51.45
const initialLng = 0
const latOffset = 0.5
const lngOffset = 1.4

export const INITIAL_VIEW_STATE: Partial<ViewState> = {
  latitude: initialLat,
  longitude: initialLng,
  zoom: 9,
}

export const INITIAL_FETCH_BOUNDS: FetchBounds = {
  latMin: initialLat - latOffset,
  latMax: initialLat + latOffset,
  lngMin: initialLng - lngOffset,
  lngMax: initialLng + lngOffset,
}

export const PLANE_ICON_FILE = '/plane.webp'
export const PLANE_ICON_NAME = 'PLANE_ICON_NAME'
export const PLANE_SOURCE_ID = 'PLANE_SOURCE_ID'
export const PLANE_LAYER_ID = 'PLANE_LAYER_ID'
