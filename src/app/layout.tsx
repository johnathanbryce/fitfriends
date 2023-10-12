import '../styles/globals.css';
import '../styles/reset.css';
import '../styles/vars.css';
// Next
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Head from 'next/head';
// Auth Context
import { AuthProvider } from '@/context/AuthProvider';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FitFriends',
  description: 'A monthly fitness challenge app made by Johnathan Bryce',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
