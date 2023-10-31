
'use client'
import { useEffect } from 'react';
// Next.js
import { useRouter } from 'next/navigation';

export default function LandingPageRouter() {
    const router = useRouter();
    // Checks if user === true and routes to either dashboard or login page
    const user = localStorage.getItem('user');
    const userObject = user ? JSON.parse(user) : null;
    console.log(userObject)

    useEffect(() => {
      if (!user) {
        router.replace('/login'); 
      } else {
        router.replace(`/challenges`); 
      }
    }, [user, router]);

    return (
      <>
          
      </>
    );
}
