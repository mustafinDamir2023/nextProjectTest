import { z } from 'zod'

export const dealSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Дата в формате YYYY-MM-DD'),
  number: z.string().min(1, 'Номер обязателен').max(50),
  amount: z.coerce
    .number({
      // Zod v4: Use the unified 'error' parameter
      error: (issue) =>
        issue.input === undefined
          ? 'Сумма обязательна' // Handles missing input
          : 'Сумма должна быть числом' // Handles invalid type (e.g., "abc")
    })
    .positive('Сумма должна быть больше 0'),
  client_id: z.coerce
    .number({
      error: (issue) =>
        issue.input === undefined ? 'Выберите клиента' : 'Выберите клиента' // You can use the same message or differentiate
    })
    .int()
    .positive('Выберите клиента'),
  description: z.string().max(500).optional().or(z.literal(''))
})

export type DealInput = z.input<typeof dealSchema> // для useForm
export type DealOutput = z.output<typeof dealSchema>
