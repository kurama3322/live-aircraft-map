import { z } from 'zod'

// shared

const LngZ = z.number().min(-180).max(180)
const LatZ = z.number().min(-90).max(90)

const RawAirportMinimalZ = z.object({
  _id: z.string().nonempty(),
  iataCode: z.string().length(3),
  geometry: z.object({
    coordinates: z.tuple([LngZ, LatZ]),
  }),
})

const toMinimalAirport = (raw: z.infer<typeof RawAirportMinimalZ>) => ({
  id: raw._id,
  iataCode: raw.iataCode,
  longitude: raw.geometry.coordinates[0],
  latitude: raw.geometry.coordinates[1],
})

// /api/airports

export const AirportMinimalZ = RawAirportMinimalZ.transform(toMinimalAirport)

const AirportMinimalCacheZ = z.object({
  id: z.string().nonempty(),
  iataCode: z.string().length(3),
  longitude: LngZ,
  latitude: LatZ,
})

function makeAirportsSchema<Output, Def extends z.ZodTypeDef, Input>(
  schema: z.ZodType<Output, Def, Input>,
) {
  return z
    .array(z.unknown())
    .transform((raw) =>
      raw.flatMap((item) => {
        const { success, data } = schema.safeParse(item)
        return success ? [data] : []
      }),
    )
    .superRefine((arr, ctx) => {
      const MIN_AIRPORTS = 4000
      if (arr.length < MIN_AIRPORTS) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: MIN_AIRPORTS,
          inclusive: true,
          type: 'array',
          message: `insufficient valid airports, need ${MIN_AIRPORTS}+, got ${arr.length}`,
        })
      }
    })
}

export const AirportsMinimalZ = makeAirportsSchema(AirportMinimalZ)
export const AirportsMinimalCacheZ = makeAirportsSchema(AirportMinimalCacheZ)

// /api/airports/[id]

export const AirportZ = RawAirportMinimalZ.extend({
  name: z.string().nonempty(),
  icaoCode: z.string().length(4),
  elevation: z.object({ value: z.number() }),
  runways: z.array(z.unknown()).optional(),
  frequencies: z
    .array(z.object({ name: z.string().optional(), value: z.string().nonempty() }))
    .optional(),
}).transform((raw) => ({
  ...toMinimalAirport(raw),
  name: raw.name.toLowerCase(),
  icaoCode: raw.icaoCode,
  elevation: raw.elevation.value,
  runwaysCount: raw.runways?.length,
  frequencies:
    raw.frequencies
      ?.map((freq) => ({
        name: freq.name?.toLowerCase(),
        value: freq.value,
      }))
      .sort((a, b) => {
        if (a.name === undefined) return 1
        if (b.name === undefined) return -1
        return a.name.localeCompare(b.name)
      }) ?? undefined,
}))
