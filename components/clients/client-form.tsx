'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { createClient, updateClient } from '@/app/actions/clients'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Client } from '@/types/db'

const clientSchema = z.object({
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

type ClientFormValues = z.infer<typeof clientSchema>

interface ClientFormProps {
  client?: Client
  onSuccess: () => void
}

export function ClientForm({ client, onSuccess }: ClientFormProps) {
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: client
      ? { name: client.name, code: client.code }
      : { name: '', code: '' }
  })

  const onSubmit = async (values: ClientFormValues) => {
    setError(null)
    try {
      if (client) {
        await updateClient(client.id, values.name, values.code)
      } else {
        await createClient(values.name, values.code)
      }
      onSuccess()
    } catch (e) {
      setError('Ошибка сохранения. Возможно, такой code уже существует.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='name'>Наименование *</Label>
        <Input id='name' placeholder='ООО Альфа' {...register('name')} />
        {errors.name && (
          <p className='text-sm text-red-600'>{errors.name.message}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='code'>Код *</Label>
        <Input id='code' placeholder='ALF' {...register('code')} />
        {errors.code && (
          <p className='text-sm text-red-600'>{errors.code.message}</p>
        )}
      </div>

      {error && <p className='text-sm text-red-600'>{error}</p>}

      <div className='flex justify-end gap-2'>
        <Button type='button' variant='outline' onClick={onSuccess}>
          Отмена
        </Button>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Сохранение…' : 'Сохранить'}
        </Button>
      </div>
    </form>
  )
}
