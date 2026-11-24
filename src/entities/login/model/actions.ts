'use server'

import { signIn, signOut } from '@/auth'
import { AuthError } from 'next-auth'

export async function loginAction(prevState: unknown, formData: FormData) {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/clients'
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: 'Неверный email или пароль' }
    }
    throw error
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: '/login' })
}
