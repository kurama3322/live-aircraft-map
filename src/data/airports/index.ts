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

export function useAirportQuery(id: string | null) {
  return useQuery({
    queryKey: ['airport', id],
    queryFn: () => fetcher<{ airport: Airport }>(`/api/airports/${id}`),
    select: (data) => data.airport,
    enabled: !!id,
    staleTime: 1000 * 60 * 60 * 24, // 1 day
  })
}
