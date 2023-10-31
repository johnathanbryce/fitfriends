
'use client'
import React, {useState, useEffect} from 'react';
// Next.js
import { useRouter } from 'next/navigation';
// Internal Components
import HeaderLoggedIn from '@/components/HeaderLoggedIn/HeaderLoggedIn';
import UnauthorizedLoader from '@/components/UnauthorizedLoader/UnauthorizedLoader';
import Loading from '../loading';
import PrivateRoutes from '@/components/PrivateRoutes/PrivateRoutes';
import WavyUpSectionBreak from '@/components/WavesAnimationUp/WavesAnimationUp';
// Layouts
import LayoutLoggedIn from '@/layouts/LayoutLoggedIn/LayoutLoggedIn';
// Auth Context
import { useAuth } from '@/context/AuthProvider';


/* all logged in pages receive this layout */
export default function LoggedInLayout({
  children,
} : {
  children: React.ReactNode
}) {
  
  const { user } = useAuth();
  const router = useRouter();

  // redirect to login page if user not authorized
  useEffect(() => {
    if (!user || !user.uid) {
      router.replace('/login');
      
    } else {
      //
    }
  }, [user, router]);

  if (!user || !user.uid) {
    return <Loading />
  }

  return (
    <>
      <HeaderLoggedIn />
      <LayoutLoggedIn>
      {children}
      </LayoutLoggedIn>
      <WavyUpSectionBreak color='#FF5722'/>
    </>
  )
}