import { Suspense } from 'react'
import { getDeals, getClientsForSelect } from '@/app/actions/deals'
import { DealFormDialog } from '@/components/deals/deal-form-dialog'
import { DealsFilters } from '@/components/deals/deals-filters'
import { DealsTable } from '@/components/deals/deals-table'

export default function DealsPage({
  searchParams
}: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>
}) {
  return (
    <div className='space-y-4'>
      <Suspense
        fallback={
          <div className='p-4 text-muted-foreground'>Загрузка сделок...</div>
        }
      >
        <DealsContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

async function DealsContent({
  searchParams
}: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams

  const filters = {
    dateFrom: typeof sp.dateFrom === 'string' ? sp.dateFrom : undefined,
    dateTo: typeof sp.dateTo === 'string' ? sp.dateTo : undefined,
    number: typeof sp.number === 'string' ? sp.number : undefined,
    clientId: sp.clientId ? Number(sp.clientId) : undefined
  }

  const [deals, clients] = await Promise.all([
    getDeals(filters),
    getClientsForSelect()
  ])

  return (
    <>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Реестр сделок</h1>
        <DealFormDialog clients={clients} mode='create' />
      </div>

      <DealsFilters clients={clients} />
      <DealsTable deals={deals} clients={clients} />
    </>
  )
}
