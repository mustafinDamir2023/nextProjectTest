'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
  Button,
  Deal,
  Select,
  Label
} from '@/shared'
import { createDeal, DealInput, dealSchema, updateDeal } from '@/entities/deal'
import { CirclePlus } from 'lucide-react'
import { toDateInput } from '../deals.utils'

export function DealFormDialog({
  clients,
  mode,
  deal,
  trigger
}: {
  clients: { id: number; name: string }[]
  mode: 'create' | 'edit'
  deal?: Deal
  trigger?: React.ReactElement
}) {
  const [open, setOpen] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm<DealInput>({
    resolver: zodResolver(dealSchema),
    defaultValues: deal
      ? {
          date: toDateInput(deal.date),
          number: deal.number,
          amount: deal.amount,
          client_id: deal.client_id ?? undefined,
          description: deal.description ?? ''
        }
      : {
          date: '',
          number: '',
          amount: undefined,
          client_id: undefined,
          description: ''
        }
  })

  const onSubmit = async (data: DealInput) => {
    try {
      setServerError(null)
      if (mode === 'create') await createDeal(data)
      else if (deal) await updateDeal(deal.id, data)
      reset()
      setOpen(false)
    } catch (e: any) {
      setServerError(e?.message ?? 'Ошибка сохранения')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button variant='secondary'>
              {mode === 'create' ? <CirclePlus /> : 'Редактировать'}
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Новая сделка' : 'Редактировать сделку'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
          <div>
            <Label className='text-sm'>Дата *</Label>
            <Input type='date' {...register('date')} />
            {errors.date && (
              <p className='text-xs text-red-500'>{errors.date.message}</p>
            )}
          </div>

          <div>
            <Label className='text-sm'>Номер *</Label>
            <Input {...register('number')} placeholder='D-001' />
            {errors.number && (
              <p className='text-xs text-red-500'>{errors.number.message}</p>
            )}
          </div>

          <div>
            <Label className='text-sm'>Сумма *</Label>
            <Input type='number' step='0.01' {...register('amount')} />
            {errors.amount && (
              <p className='text-xs text-red-500'>{errors.amount.message}</p>
            )}
          </div>

          <div>
            <Label className='text-sm'>Клиент *</Label>
            <Select
              value={watch('client_id') ? String(watch('client_id')) : ''}
              onValueChange={(v) =>
                setValue('client_id', Number(v), { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Выберите клиента' />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.client_id && (
              <p className='text-xs text-red-500'>{errors.client_id.message}</p>
            )}
          </div>

          <div>
            <Label className='text-sm'>Описание</Label>
            <Input {...register('description')} />
            {errors.description && (
              <p className='text-xs text-red-500'>
                {errors.description.message}
              </p>
            )}
          </div>

          {serverError && <p className='text-sm text-red-500'>{serverError}</p>}

          <DialogFooter>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Сохранение…' : 'Сохранить'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
