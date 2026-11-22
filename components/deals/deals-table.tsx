'use client'

import { useState } from 'react'
import { deleteDeal } from '@/app/actions/deals'
import { Button } from '@/components/ui/button'
import { DealFormDialog } from './deal-form-dialog'
import type { Deal } from '@/types/db'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

export function DealsTable({
  deals,
  clients
}: {
  deals: Deal[]
  clients: { id: number; name: string }[]
}) {
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await deleteDeal(deleteId)
      setDeleteId(null)
    } catch (error) {
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className='rounded-lg border overflow-x-auto'>
      <Table>
        <TableHeader className='bg-muted/100'>
          <TableRow>
            {/* Сохраняем ваши отступы p-2 и выравнивание */}
            <TableHead className='p-2 text-left'>Дата</TableHead>
            <TableHead className='p-2 text-left'>Номер</TableHead>
            <TableHead className='p-2 text-left'>Сумма</TableHead>
            <TableHead className='p-2 text-left'>Клиент</TableHead>
            <TableHead className='p-2 text-left'>Описание</TableHead>
            <TableHead className='p-2 text-right'>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deals.map((d) => (
            <TableRow key={d.id} className='border-t'>
              {/* В ячейках тоже добавляем p-2 везде, чтобы не слипалось */}
              <TableCell className='p-2 whitespace-nowrap'>
                {new Date(d.date).toISOString().slice(0, 10)}
              </TableCell>
              <TableCell className='p-2'>{d.number}</TableCell>
              <TableCell className='p-2 text-left'>
                {Number(d.amount).toLocaleString('ru-RU')}
              </TableCell>
              <TableCell className='p-2'>{d.client_name ?? '—'}</TableCell>
              <TableCell className='p-2 text-muted-foreground'>
                {d.description ?? '—'}
              </TableCell>

              <TableCell className='p-2 text-right space-x-2 whitespace-nowrap'>
                {/* Редактирование: ваш исходный код кнопки */}
                <DealFormDialog
                  mode='edit'
                  clients={clients}
                  deal={d}
                  trigger={
                    <Button aria-label='Редактировать'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 16 16'
                        fill='currentColor'
                        aria-hidden='true'
                      >
                        <path d='M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z' />
                      </svg>
                    </Button>
                  }
                />

                {/* Удаление: используем Dialog вместо confirm() */}
                <Dialog
                  open={deleteId === d.id}
                  onOpenChange={(open) => !open && setDeleteId(null)}
                >
                  <DialogTrigger
                    render={
                      <Button
                        disabled={isDeleting}
                        aria-label='Удалить'
                        onClick={() => setDeleteId(d.id)}
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 16 16'
                          fill='currentColor'
                          aria-hidden='true'
                        >
                          <path d='M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5' />
                        </svg>
                      </Button>
                    }
                  />
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Удалить сделку?</DialogTitle>
                      <DialogDescription>
                        Сделка №{d.number} на сумму{' '}
                        {Number(d.amount).toLocaleString('ru-RU')} будет удалена
                        безвозвратно.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant='outline'
                        onClick={() => setDeleteId(null)}
                      >
                        Отмена
                      </Button>
                      <Button
                        variant='destructive'
                        onClick={handleDelete}
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Удаление…' : 'Удалить'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
          {deals.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className='p-6 text-center text-muted-foreground'
              >
                Нет сделок по заданным фильтрам
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
