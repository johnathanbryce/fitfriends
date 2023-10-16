
'use client'
import { useEffect } from 'react';
// Next.js
import { useRouter } from 'next/navigation';
// Pages
import Dashboard from './(userLoggedIn)/dashboard/page';

export default function LandingPageRouter() {
    const router = useRouter();
    // Checks if user === true and routes to either dashboard or login page
    const user = localStorage.getItem('user')

    useEffect(() => {
      if (!user) {
        router.replace('/login'); 
      } else {
        router.replace('/dashboard'); 
      }
    }, [user, router]);

    return (
      <>
          {/* {user ? <Dashboard/> : null} */}
      </>
    );
}
