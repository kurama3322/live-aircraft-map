import { AirportZ } from '~/app/api/airports/_lib/schema'
import { env } from '~/env'
import { fetcher, tryCatch } from '~/lib/utils'

export async function getAirportById(id: string) {
  const { data, error } = await tryCatch(
    fetcher(
      `https://api.core.openaip.net/api/airports/${id}` +
        `?fields=${[
          '_id',
          'name',
          'icaoCode',
          'iataCode',
          'geometry.coordinates',
          'elevation.value',
          'runways',
          'frequencies',
        ].join(',')}`,
      {
        headers: { 'x-openaip-api-key': env.OPENAIP_API_KEY },
      },
    ),
  )
  if (error) throw error

  const parsed = AirportZ.safeParse(data)
  if (!parsed.success) {
    throw new Error('invalid airport data format')
  }
  return parsed.data
}
