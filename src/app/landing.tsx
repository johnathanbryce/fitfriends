
'use client'
import { useEffect, useState } from 'react';
// Next.js
import { useRouter } from 'next/navigation';
// Internal Components
import Loading from './loading';

export default function LandingPageRouter() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.replace('/login');
    } else {
      router.replace('/challenges-dashboard');
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    // You can display a loading spinner or message here
    return <Loading />;
  }

  return null;
}