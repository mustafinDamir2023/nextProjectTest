'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  Input,
  Label,
  SelectClient
} from '@/shared'

export function DealsFilters({ clients }: { clients: SelectClient[] }) {
  const router = useRouter()
  const sp = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [dateFrom, setDateFrom] = useState(sp.get('dateFrom') ?? '')
  const [dateTo, setDateTo] = useState(sp.get('dateTo') ?? '')
  const [number, setNumber] = useState(sp.get('number') ?? '')
  const [clientId, setClientId] = useState(sp.get('clientId') ?? '')

  const onApply = () => {
    const params = new URLSearchParams()
    if (dateFrom) params.set('dateFrom', dateFrom)
    if (dateTo) params.set('dateTo', dateTo)
    if (number) params.set('number', number)
    if (clientId) params.set('clientId', clientId)
    startTransition(() => {
      router.replace(`/deals?${params.toString()}`)
    })
  }

  const onReset = () => {
    setDateFrom('')
    setDateTo('')
    setNumber('')
    setClientId('')
    startTransition(() => router.replace('/deals'))
  }

  return (
    <div className='flex flex-wrap items-end gap-2 rounded-lg border p-3'>
      <div className='flex flex-col gap-1'>
        <Label className='text-xs text-muted-foreground'>Дата с</Label>
        <Input
          type='date'
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
      </div>

      <div className='flex flex-col gap-1'>
        <Label className='text-xs text-muted-foreground'>Дата по</Label>
        <Input
          type='date'
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
      </div>

      <div className='flex flex-col gap-1'>
        <Label className='text-xs text-muted-foreground'>Номер</Label>
        <Input
          placeholder='D-001'
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
      </div>

      <div className='flex flex-col gap-1'>
        <Label className='text-xs text-muted-foreground'>Клиент</Label>
        <Select
          value={clientId}
          onValueChange={(value) => setClientId(value ?? '')}
        >
          <SelectTrigger className='w-48'>
            <SelectValue placeholder='Все клиенты' />
          </SelectTrigger>
          <SelectContent>
            {clients.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={onApply} disabled={isPending} variant='secondary'>
        {isPending ? 'Загрузка…' : 'Применить'}
      </Button>
      <Button variant='outline' onClick={onReset} disabled={isPending}>
        Сбросить
      </Button>
    </div>
  )
}
