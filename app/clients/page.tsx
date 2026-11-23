// app/clients/page.tsx
import { Suspense } from 'react'
import Link from 'next/link'
import { ClientsDialog } from '@/components/clients/clients-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Client } from '@/types/db'
import { getClients } from '@/app/actions/clients'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { DeleteClientButton } from '@/components/clients/delete-client-button'

// Убрали instant = false, так как Suspense делает это правильно

export default function ClientsPage({
  searchParams
}: {
  searchParams: Promise<{ search?: string }>
}) {
  return (
    <div className='container mx-auto p-4 space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold'>Клиенты</h1>
        <ClientsDialog />
      </div>

      {/* Форму поиска можно оставить здесь, но она использует search для defaultValue */}
      {/* Чтобы форма тоже не блокировала, вынесем и её, или оставим, если она быстрая */}

      <Suspense
        fallback={
          <div className='p-4 text-muted-foreground'>Загрузка клиентов...</div>
        }
      >
        <ClientsContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

// Выносим всё, что зависит от searchParams и getClients, в отдельный компонент
async function ClientsContent({
  searchParams
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const { search } = await searchParams
  const clients: Client[] = await getClients(search)

  return (
    <>
      <form className='flex max-w-sm gap-2'>
        <Input
          name='search'
          placeholder='Поиск по name или code'
          defaultValue={search ?? ''}
        />
        <Button type='submit' variant='outline'>
          Найти
        </Button>
        {search && (
          <Link href='/clients'>
            <Button type='button' variant='ghost'>
              Сброс
            </Button>
          </Link>
        )}
      </form>

      <div className='rounded-lg border overflow-x-auto'>
        <Table>
          <TableHeader className='bg-muted/100'>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Наименование</TableHead>
              <TableHead>Код</TableHead>
              <TableHead className='text-right'>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className='text-center text-muted-foreground'
                >
                  Ничего не найдено
                </TableCell>
              </TableRow>
            )}
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.id}</TableCell>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.code}</TableCell>
                <TableCell className='text-right space-x-2'>
                  <ClientsDialog client={client} />
                  <DeleteClientButton client={client} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
