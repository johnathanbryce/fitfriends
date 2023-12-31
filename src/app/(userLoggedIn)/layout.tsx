
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

  // routing
  const router = useRouter();

  useEffect(() => {
    if(!user.user) {
      redirect('/login'); // using router.replace does not work
    }
  }, [user, router]);

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