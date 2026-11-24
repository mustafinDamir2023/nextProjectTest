import { LoginForm } from '@/features/login'

export default function LoginPage() {
  return (
    <div className='flex flex-1 items-center justify-center'>
      <div className='flex flex-col gap-4 w-80'>
        <h1 className='text-2xl font-bold text-center'>Вход</h1>
        <LoginForm />
      </div>
    </div>
  )
}
