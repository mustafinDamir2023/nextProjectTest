import NextAuth from 'next-auth'
import { pool } from '@/shared/lib/db'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { authConfig } from './auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  ...authConfig,
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null
        const { rows } = await pool.query(
          'SELECT * FROM users WHERE email = $1',
          [credentials.email]
        )
        const user = rows[0]
        if (!user) return null
        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password_hash
        )
        if (!valid) return null
        return { id: String(user.id), email: user.email }
      }
    })
  ]
})
