'use client'

import { useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table'
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  PencilLine,
  Trash
} from 'lucide-react'
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
import { DataTableViewOptions } from '@/components/data-table-view-options'

export function DealsTable({
  deals,
  clients
}: {
  deals: Deal[]
  clients: { id: number; name: string }[]
}) {
  // Состояния для удаления (ваши)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Состояния для TanStack Table (новые)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  })

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

  // Описываем колонки
  const columns: ColumnDef<Deal>[] = [
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='-ml-4 h-8 data-[state=open]:bg-accent'
        >
          Дата
          {column.getIsSorted() === 'desc' ? (
            <ChevronDown className='ml-2 h-4 w-4' />
          ) : column.getIsSorted() === 'asc' ? (
            <ChevronUp className='ml-2 h-4 w-4' />
          ) : (
            <ChevronsUpDown className='ml-2 h-4 w-4' />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <div className='whitespace-nowrap'>
          {new Date(row.original.date).toISOString().slice(0, 10)}
        </div>
      )
    },
    { accessorKey: 'number', header: 'Номер' },
    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='-ml-4 h-8'
        >
          Сумма
          {column.getIsSorted() === 'desc' ? (
            <ChevronDown className='ml-2 h-4 w-4' />
          ) : column.getIsSorted() === 'asc' ? (
            <ChevronUp className='ml-2 h-4 w-4' />
          ) : (
            <ChevronsUpDown className='ml-2 h-4 w-4' />
          )}
        </Button>
      ),
      sortingFn: (rowA, rowB, columnId) => {
        const a = Number(rowA.original.amount) || 0
        const b = Number(rowB.original.amount) || 0
        return a - b
      },
      cell: ({ row }) => (
        <div className='text-left'>
          {Number(row.original.amount).toLocaleString('ru-RU')}
        </div>
      )
    },
    {
      accessorKey: 'client_name',
      header: 'Клиент',
      cell: ({ row }) => row.original.client_name ?? '—'
    },
    {
      accessorKey: 'description',
      header: 'Описание',
      cell: ({ row }) => (
        <div className='text-muted-foreground'>
          {row.original.description ?? '—'}
        </div>
      )
    },
    {
      id: 'actions',
      header: () => <div className='text-right pr-6'>Действия</div>,
      cell: ({ row }) => {
        const d = row.original
        return (
          <div className='p-2 text-right space-x-2 whitespace-nowrap pr-6'>
            <DealFormDialog
              mode='edit'
              clients={clients}
              deal={d}
              trigger={
                <Button variant='ghost'>
                  <PencilLine />
                </Button>
              }
            />

            <Dialog
              open={deleteId === d.id}
              onOpenChange={(open) => !open && setDeleteId(null)}
            >
              <DialogTrigger
                render={
                  <Button
                    disabled={isDeleting}
                    variant='ghost'
                    className='text-red-600'
                    onClick={() => setDeleteId(d.id)}
                  >
                    <Trash />
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
                  <Button variant='outline' onClick={() => setDeleteId(null)}>
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
          </div>
        )
      }
    }
  ]

  // Инициализация таблицы
  const table = useReactTable({
    data: deals,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    state: { sorting, columnVisibility, pagination }
  })

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-end'>
        <DataTableViewOptions table={table} />
      </div>

      <div className='rounded-lg border overflow-x-auto'>
        <Table>
          <TableHeader className='bg-muted/100'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className='p-2 text-left'>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className='border-t'>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className='p-2'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='p-6 text-center text-muted-foreground'
                >
                  Нет сделок по заданным фильтрам
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          Всего записей: {table.getFilteredRowModel().rows.length}
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Назад
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Вперед
        </Button>
      </div>
    </div>
  )
}
