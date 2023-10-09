
'use client'
import { useEffect } from 'react';
// Next.js
import { useRouter } from 'next/navigation';

// User Login Authorization -- Auth Context
/* import { useAuth } from '@/context/AuthContext'; */

export default function LandingPageRouter() {
    const router = useRouter();
    /* const {user} = useAuth() */
    const user = false; // TODO: replace with auth logic

    useEffect(() => {
      if (!user) {
        // User is not logged in, redirect to the login page
        router.replace('/login'); 
      }
    }, [user, router]);
  
    return (
      <>
          {user ? <h1> logged in (/dashboard)</h1> : null}
      </>
    );
}
