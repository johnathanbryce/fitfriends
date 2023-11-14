import '../styles/globals.css';
import '../styles/reset.css';
import '../styles/vars.css';
// Next
import type { Metadata } from 'next'
import { Lato } from 'next/font/google'
import Head from 'next/head';
// Auth Context
import { AuthProvider } from '@/context/AuthProvider';

const lato = Lato({
  weight: '400',
  subsets: ['latin'],
})

// global meta tags

export const metadata: Metadata = {
  title: 'FitFriends - Engage in Exciting Custom Fitness Challenges',
  description: 'Join FitFriends for a unique experience in fitness and friendship. Participate in custom challenges, track your progress, and connect with a supportive community.',
  keywords: 'fitness, challenge, health, community, wellness, workout, friends, fitfriends, motivation, fitness goals',
  robots: 'index, follow',
};

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
      <body className={lato.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
