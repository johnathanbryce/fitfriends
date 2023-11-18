import React from 'react';
// Next.js
import { Metadata } from 'next';
// Layout
import LayoutAuthPages from '@/layouts/LayoutAuthPages/LayoutAuthPages';

export const metadata: Metadata = {
  title: 'FitFriends',
  description: "Login to access your FitFriends account and challenges!",
  keywords: 'fitness, challenge, friends, fitfriends, fit friends'
}

/* all logged out pages receive this layout */
export default function AuthPagesLayout({
  children,
} : {
  children: React.ReactNode
}) {
  return (
      <LayoutAuthPages>
        {children}
      </LayoutAuthPages>
  )
}