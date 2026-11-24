import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login'
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isProtected =
        nextUrl.pathname.startsWith('/clients') ||
        nextUrl.pathname.startsWith('/deals')
      const isLogin = nextUrl.pathname.startsWith('/login')

      if (isLogin && isLoggedIn) {
        return Response.redirect(new URL('/clients', nextUrl))
      }

      if (isProtected && !isLoggedIn) {
        return false
      }

      return true
    }
  },
  providers: []
} satisfies NextAuthConfig
