import React, {useState, useEffect} from 'react'
// Next.js
import { useRouter } from 'next/navigation';
// Internal Components
import Loading from '@/app/loading';

export default function useAuthenticationRedirect(authRoute: string, unAuthRoute: string) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const user = localStorage.getItem('user');
      // this works
      if (!user) {
        router.replace(authRoute);
      } else {
        router.replace(unAuthRoute);
      }
      setLoading(false);
    }, [router]);
  
    if (loading) {
      return <Loading />;
    }

    return { loading }
}
