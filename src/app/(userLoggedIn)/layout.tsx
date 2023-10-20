
import React from 'react';
import styles from './layout.module.css'
// Next.js
import { Metadata } from 'next';
// Internal Components
import HeaderLoggedIn from '@/components/HeaderLoggedIn/HeaderLoggedIn';
// Layouts
import LayoutLoggedIn from '@/layouts/LayoutLoggedIn/LayoutLoggedIn';

export const metadata: Metadata = {
  title: 'FitFriends',
  description: "Login to access your FitFriends account and challenges!",
}

/* all logged in pages receive this layout */
export default function LoggedInLayout({
  children,
} : {
  children: React.ReactNode
}) {
  return (
    <>
    <HeaderLoggedIn />
    <LayoutLoggedIn>
     {children}
     </LayoutLoggedIn>
    {/* footer logged in */}
    </>
  )
}