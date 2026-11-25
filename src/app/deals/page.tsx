import { Suspense } from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { DealsContent } from '@/widgets/deals-content'

export default async function DealsPage({
  searchParams
}: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>
}) {
  const session = await auth()
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
