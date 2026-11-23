// app/login/page.tsx
'use client'

import { useActionState } from 'react'
import { loginAction } from '../actions/login' // Импортируем экшен из отдельного файла
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null)

  return (
    <div className='flex flex-1 items-center justify-center'>
      <div className='flex flex-col gap-4 w-80'>
        <h1 className='text-2xl font-bold text-center'>Вход</h1>
        <form action={formAction} className='flex flex-col gap-4'>
          <Input name='email' type='email' placeholder='Email' required />
          <Input
            name='password'
            type='password'
            placeholder='Пароль'
            required
          />
          {state?.message && (
            <p className='text-sm text-red-500 text-center'>{state.message}</p>
          )}
          <Button type='submit' disabled={pending}>
            {pending ? 'Вход…' : 'Войти'}
          </Button>
        </form>
      </div>
    </div>
  )
}
