import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: { signIn: '/login' },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isProtected =
        nextUrl.pathname.startsWith('/clients') ||
        nextUrl.pathname.startsWith('/deals')
      if (isProtected && !isLoggedIn) return false // редирект на /login
      return true
    }
  },
  providers: [] // провайдеры добавим в auth.ts
} satisfies NextAuthConfig
