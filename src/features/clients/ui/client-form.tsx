'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Client, Input, Label } from '@/shared'
import {
  ClientFormValues,
  clientSchema,
  createClient,
  updateClient
} from '@/entities/client'

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
