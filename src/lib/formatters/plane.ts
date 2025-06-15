import type { Plane } from '~/lib/types'

const MPS_TO_KNOTS_CONVERSION_FACTOR = 1.944
const EMPTY_VALUE = '-'
const ON_GROUND_VALUE = 'on ground'

export function formatCountry(country: Plane['originCountry']) {
  if (!country) return EMPTY_VALUE
  return country.toLowerCase()
}

export function formatTimestamp(timestamp: Plane['timePosition']) {
  return new Date(timestamp * 1000).toLocaleTimeString().toLowerCase()
}

export function formatTrueTrack(trueTrack: Plane['trueTrack']) {
  return `${trueTrack.toFixed(2)}°`
}

export function formatVelocity(velocity: Plane['velocity']) {
  if (velocity === null) return EMPTY_VALUE
  return `${(velocity * MPS_TO_KNOTS_CONVERSION_FACTOR).toFixed(2)} knots`
}

export function formatVerticalRate(
  verticalRate: Plane['verticalRate'] | undefined,
  onGround: Plane['onGround'],
) {
  if (onGround) return ON_GROUND_VALUE
  if (typeof verticalRate !== 'number') return EMPTY_VALUE
  return `${(verticalRate * MPS_TO_KNOTS_CONVERSION_FACTOR).toFixed(2)} knots`
}

export function formatAltitude(
  altitude: number | null | undefined,
  onGround: Plane['onGround'],
) {
  if (onGround) return ON_GROUND_VALUE
  if (typeof altitude !== 'number') return EMPTY_VALUE
  return `${altitude.toFixed(2)} m`
}

export function formatICAO24(icao24: Plane['icao24']) {
  return icao24.toUpperCase()
}

export function formatCallsign(callsign: Plane['callsign']) {
  if (!callsign) return EMPTY_VALUE
  return callsign.toUpperCase()
}

export function formatSquawk(squawk: Plane['squawk']) {
  if (!squawk) return EMPTY_VALUE
  return squawk
}
