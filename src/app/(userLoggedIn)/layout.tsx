
'use client'
import React from 'react';
// Next.js
import { redirect, usePathname } from 'next/navigation';
// Internal Components
import HeaderLoggedIn from '@/components/Headers/HeaderLoggedIn/HeaderLoggedIn';
import FooterLoggedIn from '@/components/Footers/FooterLoggedIn/FooterLoggedIn';
// Layouts
import LayoutLoggedIn from '@/layouts/LayoutLoggedIn/LayoutLoggedIn';
// Auth Context
import { useAuth } from '@/context/AuthProvider';


/* all logged in pages receive this layout */
export default function LoggedInLayout({
  children,
} : {
  children: React.ReactNode
}) {;
  const pathname = usePathname()
  const isCreateChallengePage = pathname === '/create-challenge';

  const { user } = useAuth();

  if(!user) {
    redirect('/login')
  }

  return (
    <>
      <HeaderLoggedIn />
      <LayoutLoggedIn>
        {children}
      </LayoutLoggedIn>
      {!isCreateChallengePage && <FooterLoggedIn />}
    </>
  )
}