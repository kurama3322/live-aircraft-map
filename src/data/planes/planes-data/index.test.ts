import { beforeEach, describe, expect, it } from 'vitest'
import { PlanesData } from '~/data/planes'
import type { Plane, PlaneApiState } from '~/lib/types'

const TEST_ICAO24 = ['ABC123', 'DEF456', 'GHI789', 'JKL012'] as const
const TEST_COORDINATES = {
  INSIDE_BOUNDS: [10, 20],
  INSIDE_BOUNDS_2: [0, 10],
  OUTSIDE_BOUNDS: [50, 60],
  BOUNDARY_BOUNDS: [0, 0],
  EXTREME_MIN_BOUNDS: [-180, -90],
  EXTREME_MAX_BOUNDS: [180, 90],
  TEST_REGION: [-10, 0, 20, 30],
  EMPTY_REGION: [100, 100, 110, 110],
  MAX_REGION: [-180, -90, 180, 90],
} as const

describe('PlanesData', () => {
  let planesData: PlanesData

  beforeEach(() => {
    planesData = new PlanesData()
  })

  describe('isValid()', () => {
    const currentTimeS = Math.floor(Date.now() / 1000)

    it('should reject planes with missing required fields', () => {
      const cases = [
        { description: 'missing longitude', index: 5, value: null },
        { description: 'missing latitude', index: 6, value: null },
        { description: 'missing trueTrack', index: 10, value: null },
        { description: 'missing originCountry', index: 2, value: '' },
      ]

      cases.forEach(({ index, value }) => {
        const apiState = createMockApiStates([
          [TEST_ICAO24[0], ...TEST_COORDINATES.INSIDE_BOUNDS],
        ])[0]
        apiState[index] = value

        // @ts-expect-error - accessing private method for testing
        const isValid = PlanesData.isValid(apiState, undefined, currentTimeS)
        expect(isValid).toBe(false)
      })
    })

    it('should reject planes with invalid time data', () => {
      const cases = [
        { description: 'falsy timePosition (0)', index: 3, value: 0 },
        { description: 'missing timePosition', index: 3, value: null },
        {
          description: 'timePosition older than MAX_DATA_AGE_SECONDS',
          index: 3,
          // @ts-expect-error - accessing private constant for testing
          value: currentTimeS - (PlanesData.MAX_DATA_AGE_SECONDS + 1),
        },
      ]

      cases.forEach(({ index, value }) => {
        const apiState = createMockApiStates([
          [TEST_ICAO24[0], ...TEST_COORDINATES.INSIDE_BOUNDS],
        ])[0]
        apiState[index] = value

        // @ts-expect-error - accessing private method for testing
        const isValid = PlanesData.isValid(apiState, undefined, currentTimeS)
        expect(isValid).toBe(false)
      })
    })

    it('should reject planes with invalid category', () => {
      const apiState = createMockApiStates([
        [TEST_ICAO24[0], ...TEST_COORDINATES.INSIDE_BOUNDS],
      ])[0]
      apiState[17] = 15

      // @ts-expect-error - accessing private method for testing
      const isValid = PlanesData.isValid(apiState, undefined, currentTimeS)
      expect(isValid).toBe(false)
    })

    it('should accept valid planes', () => {
      const cases = [
        {
          description: 'timePosition within MAX_DATA_AGE_SECONDS',
          index: 3,
          // @ts-expect-error - accessing private constant for testing
          value: currentTimeS - (PlanesData.MAX_DATA_AGE_SECONDS - 1),
        },
        {
          description: 'plane category',
          index: 17,
          value: 5,
        },
      ]

      cases.forEach(({ index, value }) => {
        const apiState = createMockApiStates([
          [TEST_ICAO24[0], ...TEST_COORDINATES.INSIDE_BOUNDS],
        ])[0]
        apiState[index] = value

        // @ts-expect-error - accessing private method for testing
        const isValid = PlanesData.isValid(apiState, undefined, currentTimeS)
        expect(isValid).toBe(true)
      })
    })
  })

  describe('merge()', () => {
    it('should return new instance with merged data from API response', () => {
      const initialStates = createMockApiStates([
        [TEST_ICAO24[0], ...TEST_COORDINATES.INSIDE_BOUNDS],
      ])
      const updatedData = planesData.merge(initialStates)

      expect(updatedData.getPlanes()).toHaveLength(1)
      expect(updatedData.getPlane(TEST_ICAO24[0])).toBeDefined()
      expect(planesData.getPlanes()).toHaveLength(0)

      const newStates = createMockApiStates([
        [TEST_ICAO24[1], ...TEST_COORDINATES.INSIDE_BOUNDS_2],
      ])
      const finalData = updatedData.merge(newStates)

      expect(finalData.getPlanes()).toHaveLength(2)
      expect(finalData.getPlane(TEST_ICAO24[0])).toBeDefined()
      expect(finalData.getPlane(TEST_ICAO24[1])).toBeDefined()
      expect(updatedData.getPlanes()).toHaveLength(1)
    })
  })

  describe('getPlanesInBounds()', () => {
    beforeEach(() => {
      planesData = planesData.merge(
        createMockApiStates([
          [TEST_ICAO24[0], ...TEST_COORDINATES.INSIDE_BOUNDS],
          [TEST_ICAO24[1], ...TEST_COORDINATES.INSIDE_BOUNDS_2],
          [TEST_ICAO24[2], ...TEST_COORDINATES.OUTSIDE_BOUNDS],
          [TEST_ICAO24[3], ...TEST_COORDINATES.BOUNDARY_BOUNDS],
        ]),
      )
    })

    it('should return only planes within specified bounds', () => {
      const results = planesData.getPlanesInBounds(...TEST_COORDINATES.TEST_REGION)

      expect(results.length).toBeGreaterThan(0)
      expectPlanes(
        results,
        [TEST_ICAO24[0], TEST_ICAO24[1], TEST_ICAO24[3]],
        [TEST_ICAO24[2]],
      )
    })

    it('should return empty array when no planes in bounds', () => {
      const results = planesData.getPlanesInBounds(...TEST_COORDINATES.EMPTY_REGION)
      expect(results).toHaveLength(0)
    })

    it('should handle extreme coordinate boundaries', () => {
      // create fresh instance to avoid interference from beforeEach
      let freshPlanesData = new PlanesData()
      freshPlanesData = freshPlanesData.merge(
        createMockApiStates([
          [TEST_ICAO24[0], ...TEST_COORDINATES.EXTREME_MIN_BOUNDS],
          [TEST_ICAO24[1], ...TEST_COORDINATES.EXTREME_MAX_BOUNDS],
        ]),
      )

      const results = freshPlanesData.getPlanesInBounds(...TEST_COORDINATES.MAX_REGION)
      expect(results).toHaveLength(2)
      expectPlanes(results, [TEST_ICAO24[0], TEST_ICAO24[1]])
    })
  })

  describe('getPlanes()', () => {
    it('should return all planes', () => {
      planesData = planesData.merge(
        createMockApiStates([
          [TEST_ICAO24[0], ...TEST_COORDINATES.INSIDE_BOUNDS],
          [TEST_ICAO24[1], ...TEST_COORDINATES.INSIDE_BOUNDS_2],
          [TEST_ICAO24[2], ...TEST_COORDINATES.BOUNDARY_BOUNDS],
        ]),
      )

      const planes = planesData.getPlanes()
      expect(planes).toHaveLength(3)
      expectPlanes(planes, [TEST_ICAO24[0], TEST_ICAO24[1], TEST_ICAO24[2]])
    })
  })

  describe('getPlane()', () => {
    it('should return specific plane by ICAO24', () => {
      planesData = planesData.merge(
        createMockApiStates([[TEST_ICAO24[0], ...TEST_COORDINATES.INSIDE_BOUNDS]]),
      )

      const plane = planesData.getPlane(TEST_ICAO24[0])
      expect(plane).toBeDefined()
      expect(plane?.icao24).toBe(TEST_ICAO24[0])
      expect(plane?.longitude).toBe(TEST_COORDINATES.INSIDE_BOUNDS[0])
      expect(plane?.latitude).toBe(TEST_COORDINATES.INSIDE_BOUNDS[1])
    })
  })

  describe('cleanupStalePlanes()', () => {
    it('should remove stale planes', () => {
      const currentTime = Math.floor(Date.now() / 1000)

      planesData = planesData.merge(
        createMockApiStates([
          [
            TEST_ICAO24[0],
            ...TEST_COORDINATES.INSIDE_BOUNDS,
            { timePosition: currentTime - 40 },
          ],
          [
            TEST_ICAO24[1],
            ...TEST_COORDINATES.INSIDE_BOUNDS_2,
            { timePosition: currentTime - 301 },
          ],
        ]),
      )

      const cleanedData = planesData.cleanupStalePlanes()

      expect(cleanedData.getPlane(TEST_ICAO24[0])).toBeDefined()
      expect(cleanedData.getPlane(TEST_ICAO24[1])).toBeUndefined()
    })
  })
})

type NonEmptyArray<T> = [T, ...T[]]
function createMockApiStates(
  planes: NonEmptyArray<[string, number, number, Partial<Plane>?]>,
) {
  const currentTime = Math.floor(Date.now() / 1000)
  return planes.map(([icao24, lng, lat, overrides = {}]) => [
    icao24,
    overrides.callsign ?? `callsign_${icao24}`,
    overrides.originCountry ?? 'test country',
    overrides.timePosition ?? currentTime,
    currentTime,
    lng,
    lat,
    overrides.baroAltitude ?? 10000,
    overrides.onGround ?? false,
    overrides.velocity ?? 300,
    overrides.trueTrack ?? 90,
    overrides.verticalRate ?? 1,
    null,
    overrides.geoAltitude ?? 10000,
    overrides.squawk ?? `squawk_${icao24}`,
    false,
    0,
    5,
  ]) as NonEmptyArray<PlaneApiState>
}

function expectPlanes(
  results: Plane[],
  expectedICAO24: string[],
  unexpectedICAO24: string[] = [],
) {
  const resultIds = results.map((a) => a.icao24)

  for (const id of expectedICAO24) {
    expect(resultIds).toContain(id)
  }
  for (const id of unexpectedICAO24) {
    expect(resultIds).not.toContain(id)
  }
}
