import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { ClientsDialog } from '@/features/clients'
import { ClientsContent } from '@/widgets/clients-content'

export default async function ClientsPage({
  searchParams
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className='container mx-auto p-4 space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Клиенты</h1>
        <ClientsDialog />
      </div>

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
