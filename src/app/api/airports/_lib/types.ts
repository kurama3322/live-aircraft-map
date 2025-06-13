import type { z } from 'zod'
import type { AirportMinimalZ, AirportZ } from './schema'

export type AirportMinimal = z.infer<typeof AirportMinimalZ>
export type Airport = z.infer<typeof AirportZ>
