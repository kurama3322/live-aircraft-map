import { useQuery } from '@tanstack/react-query'
import type { FetchBounds, PlanesApiResponse } from '~/lib/types'
import { fetcher } from '~/lib/utils'

export function usePlanesQuery(bounds: FetchBounds) {
  return useQuery<PlanesApiResponse>({
    queryKey: ['planes', bounds],
    queryFn: () => fetcher<PlanesApiResponse>(getFetchUrl(bounds)),
    retry: (failureCount, error) => {
      if (error.cause === 429) return false
      return failureCount < 3
    },
    refetchInterval: (query) => {
      if (query.state.error?.cause === 429) return false
      return 1000 * 10 // 10 seconds
    },
    gcTime: 0,
  })
}

function getFetchUrl(bounds: FetchBounds) {
  const baseUrl = 'https://opensky-network.org/api'
  const params = new URLSearchParams({
    lamin: bounds.latMin.toString(),
    lamax: bounds.latMax.toString(),
    lomin: bounds.lngMin.toString(),
    lomax: bounds.lngMax.toString(),
    extended: '1',
  })
  return `${baseUrl}/states/all?${params}`
}
