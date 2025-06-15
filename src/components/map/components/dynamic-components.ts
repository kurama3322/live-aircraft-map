import dynamic from 'next/dynamic'

export const AirportsLayer = dynamic(() => import('./layers/airports-layer'), {
  ssr: false,
})
export const MapDashboard = dynamic(() => import('./map-dashboard'), {
  ssr: false,
})
export const PlaneTable = dynamic(
  () => import('~/components/map/components/plane-table/plane-table'),
  { ssr: false },
)
export const Status = dynamic(() => import('./status'), { ssr: false })
