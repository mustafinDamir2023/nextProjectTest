import z from 'zod'
import { clientSchema } from '../model/client-schema'

export type ClientFormValues = z.infer<typeof clientSchema>
