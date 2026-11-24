import z from 'zod'

export const clientSchema = z.object({
  name: z
    .string()
    .min(2, 'Минимум 2 символа')
    .max(100, 'Максимум 100 символов'),
  code: z
    .string()
    .min(2, 'Минимум 2 символа')
    .max(20, 'Максимум 20 символов')
    .regex(/^[A-Za-z0-9_-]+$/, 'Только латиница, цифры, - и _')
})
