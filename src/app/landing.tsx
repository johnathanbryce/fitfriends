
'use client'
import { useEffect } from 'react';
// Next.js
import { useRouter } from 'next/navigation';
// Pages
import Dashboard from './(userLoggedIn)/dashboard/[userID]/page';
// Interal Components
import UnauthorizedLoader from '@/components/UnauthorizedLoader/UnauthorizedLoader';

export default function LandingPageRouter() {
    const router = useRouter();
    // Checks if user === true and routes to either dashboard or login page
    const user = localStorage.getItem('user')
    const userObject = user ? JSON.parse(user) : null;

    useEffect(() => {
      if (!user) {
        router.replace('/login'); 
        console.log(user)
      } else {
        router.replace(`/dashboard/${userObject.uid}`); 
        console.log(user)
      }
    }, [user, router]);

    return (
      <>
          {user ? <UnauthorizedLoader /> : null}
      </>
    );
}
