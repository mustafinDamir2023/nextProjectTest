import Link from 'next/link'
import { auth } from '@/auth'
import { UserMenu } from './user-menu'

export async function Header() {
  const session = await auth() // сессия из JWT-cookie на сервере

  return (
    <header className='bg-gradient-to-b from-[oklch(74.204%_0.21826_147.403)] to-[white] text-primary-foreground'>
      <div className='container mx-auto flex h-14 items-center justify-between px-4'>
        <nav className='flex gap-4'>
          <Link href='/clients' className='text-sm font-medium hover:scale-110'>
            Клиенты
          </Link>
          <Link href='/deals' className='text-sm font-medium hover:scale-110'>
            Сделки
          </Link>
        </nav>
        <UserMenu email={session?.user?.email ?? null} />
      </div>
    </header>
  )
}
