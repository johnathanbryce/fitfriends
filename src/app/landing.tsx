
'use client'
import { useEffect } from 'react';
// Next.js
import { useRouter } from 'next/navigation';
// Pages
import Dashboard from './(userLoggedIn)/dashboard/page';

export default function LandingPageRouter() {
    // Checks if user === true and routes to either dashboard or login page
    const user = localStorage.getItem('user')
    console.log('landing', user)

    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.replace('/login'); 
      }
    }, [user, router]);

    return (
      <>
          {user ? <Dashboard/> : null}
      </>
    );
}
