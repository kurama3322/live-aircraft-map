import { useState } from 'react'
import type { MapEvent } from 'mapbox-gl'
import { PLANE_ICON_FILE, PLANE_ICON_NAME } from '~/lib/constants'

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
}
