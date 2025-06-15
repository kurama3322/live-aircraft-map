import { useState } from 'react'
import type { OnChangeFn, SortingState } from '@tanstack/react-table'
import { useLocalStorage } from '@uidotdev/usehooks'

const PREFIX = 'planes:'

export function useShowAirports() {
  return useLocalStorage<boolean>(PREFIX + 'showAirports', true)
}

export function useShowPlanes() {
  return useLocalStorage<boolean>(PREFIX + 'showPlanes', true)
}

export function useShowPlaneTable() {
  return useLocalStorage<boolean>(PREFIX + 'showPlaneTable', false)
}

export function usePlaneTableSorting() {
  const key = PREFIX + 'planeTableSorting'

  const [sorting, setSorting] = useState<SortingState>(() => {
    const stored = localStorage.getItem(key)
    return stored
      ? (JSON.parse(stored) as SortingState)
      : [{ id: 'velocity', desc: true }]
  })

  const setSortingWithLocalStorage: OnChangeFn<SortingState> = (updater) => {
    setSorting((prevValue) => {
      const newValue = typeof updater === 'function' ? updater(prevValue) : updater
      localStorage.setItem(key, JSON.stringify(newValue))
      return newValue
    })
  }

  return [sorting, setSortingWithLocalStorage] as const
}
