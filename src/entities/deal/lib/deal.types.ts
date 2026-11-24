import { z } from 'zod'
import { dealSchema } from '../model/deal-schema'

export type DealInput = z.input<typeof dealSchema>
export type DealOutput = z.output<typeof dealSchema>
