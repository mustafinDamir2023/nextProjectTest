import { Suspense } from 'react'
import { DealsContent } from '@/widgets/deals-content'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function DealsPage({
  searchParams
}: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>
}) {
  const session = await auth() // делает page динамической автоматически
  if (!session) redirect('/login')

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
