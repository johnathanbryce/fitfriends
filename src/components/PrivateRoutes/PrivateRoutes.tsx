'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
 // Import the Firebase auth instance
import { getAuth } from 'firebase/auth';

interface PrivateRouteProps {
    children: any
}

// TODO: make this work
const PrivateRoutes = ({ children }: PrivateRouteProps) => {
  const router = useRouter();

  const auth= getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      if (!user) {
        router.push('/login'); 
      }
    });

    return () => unsubscribe();
  }, [router]);

  return children;
};

export default PrivateRoutes;