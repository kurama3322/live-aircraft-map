import { redis } from '~/app/api/airports/_lib/redis'
import { AirportsMinimalCacheZ, AirportsMinimalZ } from '~/app/api/airports/_lib/schema'
import { env } from '~/env'
import { fetcher, tryCatch } from '~/lib/utils'

const CACHE_KEY = 'airports'
const CACHE_TTL = 60 * 60 * 24 * 60 // 60 days

export async function getAirports() {
  try {
    const airports = await fetchAndParseAirports()

    void redis.set(CACHE_KEY, airports, { ex: CACHE_TTL }).catch((error) => {
      console.warn('failed to set airports cache', error)
    })

    return airports
  } catch (fetchError) {
    console.warn('fetching airports failed, falling back to cache', fetchError)

    try {
      const cache = await redis.get(CACHE_KEY)
      return AirportsMinimalCacheZ.parse(cache)
    } catch (cacheError) {
      console.error('both fetch and cache failed for airports', {
        fetchError,
        cacheError,
      })
      throw new Error('unable to load airports from API or cache')
    }
  }
}

export async function fetchAndParseAirports() {
  let all: unknown[] = []
  const limit = 1000

  for (let page = 0; ; page++) {
    const { data, error } = await tryCatch(
      fetcher<{
        items: unknown[]
      }>(
        `https://api.core.openaip.net/api/airports?page=${page}&limit=${limit}` +
          `&fields=${['_id', 'iataCode', 'geometry.coordinates'].join(',')}`,
        {
          headers: { 'x-openaip-api-key': env.OPENAIP_API_KEY },
        },
      ),
    )
    if (error) throw error
    if (!data.items.length) break
    all = all.concat(data.items)
  }

  return AirportsMinimalZ.parse(all)
}
