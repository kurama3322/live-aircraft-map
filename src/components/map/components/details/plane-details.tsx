import { memo } from 'react'
import { DetailsItem } from '~/components/map/components/details/details-item'
import { MapCard } from '~/components/ui/map-card'
import {
  formatAltitude,
  formatCallsign,
  formatCoordinate,
  formatCountry,
  formatICAO24,
  formatSquawk,
  formatTimestamp,
  formatTrueTrack,
  formatVelocity,
  formatVerticalRate,
} from '~/lib/formatters'
import type { Plane } from '~/lib/types'

export const PlaneDetails = memo(function PlaneDetails({
  plane,
}: {
  plane: Plane | null
}) {
  if (!plane) return null

  return (
    <MapCard position="bottom-left" responsiveWidth responsiveHeight>
      <h1 className="mb-3 underline">plane</h1>
      <DetailsItem label="country" value={formatCountry(plane.originCountry)} />
      <DetailsItem
        label="last position update"
        value={formatTimestamp(plane.timePosition)}
      />
      <DetailsItem label="latitude" value={formatCoordinate(plane.latitude)} />
      <DetailsItem label="longitude" value={formatCoordinate(plane.longitude)} />
      <DetailsItem
        label="barometric altitude"
        value={formatAltitude(plane.baroAltitude, plane.onGround)}
      />
      <DetailsItem
        label="geometric altitude"
        value={formatAltitude(plane.geoAltitude, plane.onGround)}
      />
      <DetailsItem label="ground speed" value={formatVelocity(plane.velocity)} />
      <DetailsItem
        label="vertical rate"
        value={formatVerticalRate(plane.verticalRate, plane.onGround)}
      />
      <DetailsItem label="track" value={formatTrueTrack(plane.trueTrack)} />
      <DetailsItem label="ICAO24" value={formatICAO24(plane.icao24)} />
      <DetailsItem label="callsign" value={formatCallsign(plane.callsign)} />
      <DetailsItem label="transponder code" value={formatSquawk(plane.squawk)} />
    </MapCard>
  )
})
