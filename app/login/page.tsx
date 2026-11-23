import { signIn } from '@/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  return (
    <div className='flex flex-1 items-center justify-center'>
      <div className='flex flex-col gap-4 w-80'>
        <h1 className='text-2xl font-bold text-center'>Вход</h1>
        <form
          action={async (formData) => {
            'use server'
            await signIn('credentials', {
              email: formData.get('email'),
              password: formData.get('password'),
              redirectTo: '/clients'
            })
          }}
          className='flex flex-col gap-4'
        >
          <Input name='email' type='email' placeholder='Email' required />
          <Input
            name='password'
            type='password'
            placeholder='Пароль'
            required
          />
          <Button type='submit'>Войти</Button>
        </form>
      </div>
    </div>
  )
}
