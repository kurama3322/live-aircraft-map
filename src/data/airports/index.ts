import { useQuery } from '@tanstack/react-query'
import type { Airport, AirportMinimal } from '~/lib/types'
import { fetcher } from '~/lib/utils'

export function useAirportsQuery() {
  return useQuery<{ airports: AirportMinimal[] }>({
    queryKey: ['airports'],
    queryFn: () => fetcher('/api/airports'),
    staleTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  })
}
