'use server'

import { signIn } from '@/auth'

export async function loginAction(prevState: any, formData: FormData) {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/clients',
      redirect: false
    })
    return { message: '' }
  } catch (e: any) {
    return { message: 'Неверный email или пароль' }
  }
}
