import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Header } from '../features/header'
import { Providers } from '../shared'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'ClientsDeals'
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang='en'
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta httpEquiv='Cache-Control' content='no-store, max-age=0' />
        <meta httpEquiv='Pragma' content='no-cache' />
        <meta httpEquiv='Expires' content='0' />
      </head>
      <body className='min-h-full flex flex-col'>
        <Providers>
          <Header />
          <main className='container mx-auto p-4'>{children} </main>
        </Providers>
      </body>
    </html>
  )
}
