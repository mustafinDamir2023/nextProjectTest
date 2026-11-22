import Link from 'next/link'
import { UserMenu } from './user-menu'

export function Header() {
  return (
    <header className='border-b'>
      <div className='container mx-auto flex h-14 items-center justify-between px-4'>
        <nav className='flex gap-4'>
          <Link href='/clients' className='text-sm font-medium hover:underline'>
            Клиенты
          </Link>
          <Link href='/deals' className='text-sm font-medium hover:underline'>
            Сделки
          </Link>
        </nav>
        <UserMenu />
      </div>
    </header>
  )
}
