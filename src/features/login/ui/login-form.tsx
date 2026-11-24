'use client'

import { useActionState } from 'react'
import { loginAction } from '@/entities/login'
import { Button, Input, Label } from '@/shared'

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null)

  return (
    <form action={formAction} className='flex flex-col gap-4'>
      <Input name='email' type='email' placeholder='Email' required />
      <Input name='password' type='password' placeholder='Пароль' required />
      {state?.message && (
        <Label className='text-sm text-red-500 text-center'>
          {state.message}
        </Label>
      )}
      <Button type='submit' disabled={pending}>
        {pending ? 'Вход…' : 'Войти'}
      </Button>
    </form>
  )
}
