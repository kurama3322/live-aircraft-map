import type { FeatureCollection, Geometry } from 'geojson'

export * from '~/app/api/airports/_lib/types'

// OSN API docs: https://openskynetwork.github.io/opensky-api/rest.html
export type PlaneApiState = [
  string, // 0: icao24 - Unique ICAO24 24-bit address of the transponder in hex string representation
  string | null, // 1: callsign - Callsign of the vehicle. Can be null
  string, // 2: origin_country - Country name inferred from the ICAO 24-bit address
  number | null, // 3: time_position - Unix timestamp for the last position update. Can be null
  number, // 4: last_contact - Unix timestamp for the last update in general
  number | null, // 5: longitude - WGS-84 longitude in decimal degrees. Can be null
  number | null, // 6: latitude - WGS-84 latitude in decimal degrees. Can be null
  number | null, // 7: baro_altitude - Barometric altitude in meters. Can be null
  boolean, // 8: on_ground - Boolean indicating if the position was retrieved from a surface position report
  number | null, // 9: velocity - Velocity over ground in m/s. Can be null
  number | null, // 10: true_track - True track in decimal degrees clockwise from north. Can be null
  number | null, // 11: vertical_rate - Vertical rate in m/s. Can be null
  number | null, // 12: sensors - IDs of the receivers which contributed to this state vector. Can be null
  number | null, // 13: geo_altitude - Geometric altitude in meters. Can be null
  string | null, // 14: squawk - The transponder code (squawk). Can be null
  boolean, // 15: spi - Whether flight status indicates special purpose indicator
  number, // 16: position_source - Origin of this state's position: 0 = ADS-B, 1 = ASTERIX, 2 = MLAT, 3 = FLARM
  number, // 17: category - Aircraft category
]

export type ValidPlaneApiState = PlaneApiState & {
  3: number // time_position
  5: number // longitude
  6: number // latitude
  10: number // true_track
}

export type PlanesApiResponse = {
  time: number // The time which the state vectors in this response are associated with. All vectors represent the state of a vehicle with the [time - 1, time] interval
  states: Array<PlaneApiState> | null
}

export type Plane = {
  icao24: string
  // ~1/100 are === ''
  callsign: string | null
  originCountry: string
  timePosition: number
  longitude: number
  latitude: number
  baroAltitude: number | null
  onGround: boolean
  velocity: number | null
  trueTrack: number
  verticalRate: number | null
  geoAltitude: number | null
  squawk: string | null
}

export type TablePlane = Pick<
  Plane,
  'originCountry' | 'velocity' | 'verticalRate' | 'geoAltitude' | 'icao24' | 'onGround'
>

export type PlanesGeoJSON = FeatureCollection<Geometry, Plane>

export type FetchBounds = {
  lngMin: number
  lngMax: number
  latMin: number
  latMax: number
}

export type CursorLocation = {
  lng: number
  lat: number
}
