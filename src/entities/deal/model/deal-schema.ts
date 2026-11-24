import { z } from 'zod'

export const dealSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Дата в формате YYYY-MM-DD'),
  number: z.string().min(1, 'Номер обязателен').max(50),
  amount: z.coerce
    .number({
      error: (issue) =>
        issue.input === undefined
          ? 'Сумма обязательна'
          : 'Сумма должна быть числом'
    })
    .positive('Сумма должна быть больше 0'),
  client_id: z.coerce
    .number({
      error: (issue) =>
        issue.input === undefined ? 'Выберите клиента' : 'Выберите клиента'
    })
    .int()
    .positive('Выберите клиента'),
  description: z.string().max(500).optional().or(z.literal(''))
})
