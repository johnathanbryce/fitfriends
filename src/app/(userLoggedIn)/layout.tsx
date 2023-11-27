
'use client'
import React, {useEffect} from 'react';
// Next.js
import { usePathname, redirect, useRouter } from 'next/navigation';
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

  // NOTE: NEVER use useAuthenticationRedirect here... it breaks challenges[ID] page on page refresh only
  const user = useAuth()
  let localStorageUser;
  if (typeof window !== 'undefined') {
    localStorageUser = localStorage.getItem('user');
  }
  // routing
  const router = useRouter();

  if(!user.user && !localStorageUser ){
    router.replace('/login');
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