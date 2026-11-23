'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export function DealsFilters({
  clients
}: {
  clients: { id: number; name: string }[]
}) {
  const router = useRouter()
  const sp = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [dateFrom, setDateFrom] = useState(sp.get('dateFrom') ?? '')
  const [dateTo, setDateTo] = useState(sp.get('dateTo') ?? '')
  const [number, setNumber] = useState(sp.get('number') ?? '')
  const [clientId, setClientId] = useState(sp.get('clientId') ?? '')

  function apply() {
    const params = new URLSearchParams()
    if (dateFrom) params.set('dateFrom', dateFrom)
    if (dateTo) params.set('dateTo', dateTo)
    if (number) params.set('number', number)
    if (clientId) params.set('clientId', clientId)
    startTransition(() => {
      router.replace(`/deals?${params.toString()}`)
    })
  }

  function reset() {
    setDateFrom('')
    setDateTo('')
    setNumber('')
    setClientId('')
    startTransition(() => router.replace('/deals'))
  }

  return (
    <div className='flex flex-wrap items-end gap-2 rounded-lg border p-3'>
      <div className='flex flex-col gap-1'>
        <label className='text-xs text-muted-foreground'>Дата с</label>
        <Input
          type='date'
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
      </div>
      <div className='flex flex-col gap-1'>
        <label className='text-xs text-muted-foreground'>Дата по</label>
        <Input
          type='date'
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
      </div>
      <div className='flex flex-col gap-1'>
        <label className='text-xs text-muted-foreground'>Номер</label>
        <Input
          placeholder='D-001'
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
      </div>
      <div className='flex flex-col gap-1'>
        <label className='text-xs text-muted-foreground'>Клиент</label>
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
      <Button onClick={apply} disabled={isPending} variant='secondary'>
        {isPending ? 'Загрузка…' : 'Применить'}
      </Button>
      <Button variant='outline' onClick={reset} disabled={isPending}>
        Сбросить
      </Button>
    </div>
  )
}
