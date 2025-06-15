import type React from 'react'

export function DetailsItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <span className="flex w-full justify-between gap-6">
      <span>{label}</span>
      <span className="min-w-[11ch] text-right">{value}</span>
    </span>
  )
}
