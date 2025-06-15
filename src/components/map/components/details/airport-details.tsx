import { memo } from 'react'
import { DetailsItem } from '~/components/map/components/details/details-item'
import { Loading } from '~/components/ui/loading'
import { MapCard } from '~/components/ui/map-card'
import { useAirportQuery } from '~/data/airports'
import { formatCoordinate } from '~/lib/formatters'
import { useStore } from '~/lib/stores'

export const AirportDetails = memo(function AirportDetails() {
  const selectedAirportId = useStore((s) => s.selectedAirportId)
  const { data: airport, isLoading } = useAirportQuery(selectedAirportId)

  if (isLoading)
    return (
      <MapCard position="bottom-left" responsiveWidth responsiveHeight>
        loading airport
        <Loading />
      </MapCard>
    )
  if (!airport) return null

  return (
    <MapCard position="bottom-left" responsiveWidth responsiveHeight>
      <h1 className="mb-3 underline">airport</h1>
      <DetailsItem label="name" value={airport.name} />
      <DetailsItem label="IATA" value={airport.iataCode} />
      <DetailsItem label="ICAO" value={airport.icaoCode} />
      <DetailsItem label="latitude" value={formatCoordinate(airport.latitude)} />
      <DetailsItem label="longitude" value={formatCoordinate(airport.longitude)} />
      <DetailsItem label="elevation" value={`${airport.elevation} m`} />
      {airport.runwaysCount ? (
        <DetailsItem label="number of runways" value={airport.runwaysCount} />
      ) : null}
      {airport.frequencies?.length ? (
        <>
          <h2>frequencies:</h2>
          {airport.frequencies.map((freq, index) => (
            <div key={index} className="flex">
              <span className="whitespace-pre">{index + 1}. </span>
              <DetailsItem label={freq.name ?? 'no name'} value={`${freq.value} mhz`} />
            </div>
          ))}
        </>
      ) : null}
    </MapCard>
  )
})
