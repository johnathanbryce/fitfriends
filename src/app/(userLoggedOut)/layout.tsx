import React from 'react';
import styles from './layout.module.css'
// Next.js
import { Metadata } from 'next';
// Internal Components
import HeaderLoggedOut from '@/components/HeaderLoggedOut/HeaderLoggedOut';
import FooterLoggedOut from '@/components/Footers/FooterLoggedOut/FooterLoggedOut';

// Layout
import LayoutLoggedOut from '@/layouts/LayoutLoggedOut/LayoutLoggedOut';

export const metadata: Metadata = {
  title: 'FitFriends',
  description: "Login to access your FitFriends account and challenges!",
}

/* all logged out pages receive this layout */
export default function LoggedOutLayout({
  children,
} : {
  children: React.ReactNode
}) {
  return (
    <>
      <HeaderLoggedOut />
      <LayoutLoggedOut>
        {children}
      </LayoutLoggedOut>
      <FooterLoggedOut />
    </>
  )
}