import { create } from 'zustand'

export const useStore = create<{
  selectedAirportId: string | null
  setSelectedAirportId: (id: string | null) => void

  selectedPlaneICAO24: string | null
  setSelectedPlaneICAO24: (id: string | null) => void

  isPlaneTableFrozen: boolean
  setIsPlaneTableFrozen: (frozen: boolean) => void
}>()((set) => ({
  selectedAirportId: null,
  setSelectedAirportId: (selectedAirportId) =>
    set(
      selectedAirportId
        ? { selectedAirportId, selectedPlaneICAO24: null }
        : { selectedAirportId },
    ),

  selectedPlaneICAO24: null,
  setSelectedPlaneICAO24: (selectedPlaneICAO24) =>
    set(
      selectedPlaneICAO24
        ? { selectedPlaneICAO24, selectedAirportId: null }
        : { selectedPlaneICAO24 },
    ),

  isPlaneTableFrozen: true,
  setIsPlaneTableFrozen: (isPlaneTableFrozen) =>
    set({ isPlaneTableFrozen: isPlaneTableFrozen }),
}))
