import { useState } from 'react'
import type { MapEvent } from 'mapbox-gl'
import {
  AIRPORT_ICON_FILE,
  AIRPORT_ICON_NAME,
  PLANE_ICON_FILE,
  PLANE_ICON_NAME,
} from '~/lib/constants'

// icons must be loaded & added after map style is loaded
export function useMapIcons() {
  const [areIconsLoaded, setAreIconsLoaded] = useState<boolean>(false)

  const loadIcons = (e: MapEvent) => {
    addIcons(e)
    setAreIconsLoaded(true)
  }

  return { areIconsLoaded, loadIcons }
}

function addIcons(e: MapEvent) {
  const map = e.target
  if (!map) return

  if (!map.hasImage(PLANE_ICON_NAME)) {
    map.loadImage(PLANE_ICON_FILE, (error, image) => {
      if (!error && image) map.addImage(PLANE_ICON_NAME, image, { sdf: true })
    })
  }

  if (!map.hasImage(AIRPORT_ICON_NAME)) {
    map.loadImage(AIRPORT_ICON_FILE, (error, image) => {
      if (!error && image) map.addImage(AIRPORT_ICON_NAME, image, { sdf: true })
    })
  }
}
