import React, {useState, useEffect} from 'react'
// Next.js
import { useRouter, redirect } from 'next/navigation';
// Internal Components
import Loading from '@/app/loading';
// Auth Context
import { useAuth } from '@/context/AuthProvider';

export default function useAuthenticationRedirect(authRoute: string, unAuthRoute: string) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const { user } = useAuth();


    useEffect(() => {
      if (!user) {
        console.log('no user', unAuthRoute)
        router.replace(unAuthRoute);
      } else {
        console.log('user', authRoute)
        router.replace(authRoute);
      }
      setLoading(false);
    }, [router]);

    if (loading) {
      return <Loading />;
    }

    return { loading }
}
