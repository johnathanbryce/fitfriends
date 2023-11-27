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
        router.replace(unAuthRoute);
      } else if (user && user.emailVerified) { // ensures the user has also verified their email before routing
        router.replace(authRoute);
      }
      setLoading(false);
    }, [router, user]);

    if (loading) {
      return <Loading />;
    }

    return { loading }
}
