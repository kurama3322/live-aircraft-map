import type {
  Plane,
  PlaneApiState,
  PlanesApiResponse,
  ValidPlaneApiState,
} from '~/lib/types'

export class PlanesData {
  private static readonly MAX_DATA_AGE_SECONDS = 50
  static readonly MAX_CACHE_AGE_SECONDS = 300

  // OSN API often returns data where plane's `time_position` is less than its `time_position` from the previous request
  // meaning you can get older data with a newer request
  // we use this map to cache the latest data
  private planesMap = new Map<string, Plane>()

  private static isValid(
    planeState: PlaneApiState,
    cachedPlane: Plane | undefined,
    currentTimeS: number,
  ): planeState is ValidPlaneApiState {
    const timePosition = planeState[3]

    // not valid if:
    return !(
      !timePosition ||
      // not newer than cached data
      (cachedPlane && cachedPlane.timePosition >= timePosition) ||
      // old
      currentTimeS - timePosition > PlanesData.MAX_DATA_AGE_SECONDS ||
      // non-plane category
      planeState[17] > 7 ||
      // incomplete essential position data
      planeState[5] === null ||
      planeState[6] === null ||
      planeState[10] === null ||
      // originCountry (~1/10,000)
      !planeState[2]
    )
  }

  merge(states: PlanesApiResponse['states']) {
    if (!states) return this

    const newPlanesData = new PlanesData()
    newPlanesData.planesMap = new Map(this.planesMap)
    const currentTimeS = Math.floor(Date.now() / 1000)

    for (const planeState of states) {
      const icao24 = planeState[0]
      const cachedPlane = this.planesMap.get(icao24)

      if (!PlanesData.isValid(planeState, cachedPlane, currentTimeS)) continue

      newPlanesData.planesMap.set(icao24, {
        icao24,
        callsign: planeState[1],
        originCountry: planeState[2],
        timePosition: planeState[3],
        longitude: planeState[5],
        latitude: planeState[6],
        baroAltitude: planeState[7],
        onGround: planeState[8],
        velocity: planeState[9],
        trueTrack: planeState[10],
        verticalRate: planeState[11],
        geoAltitude: planeState[13],
        squawk: planeState[14],
      })
    }

    return newPlanesData
  }

  getPlanesInBounds(west: number, south: number, east: number, north: number) {
    return Array.from(this.planesMap.values()).filter(
      (plane) =>
        plane.longitude >= west &&
        plane.longitude <= east &&
        plane.latitude >= south &&
        plane.latitude <= north,
    )
  }

  getPlanes() {
    return Array.from(this.planesMap.values())
  }

  getPlane(icao24: string) {
    return this.planesMap.get(icao24)
  }

  cleanupStalePlanes() {
    const currentTimeS = Math.floor(Date.now() / 1000)
    const newPlanesData = new PlanesData()

    for (const [icao24, plane] of this.planesMap) {
      if (currentTimeS - plane.timePosition <= PlanesData.MAX_CACHE_AGE_SECONDS) {
        newPlanesData.planesMap.set(icao24, plane)
      }
    }

    return newPlanesData
  }
}
