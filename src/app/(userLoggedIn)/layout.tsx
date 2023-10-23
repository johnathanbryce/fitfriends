
'use client'
import React, {useState, useEffect} from 'react';
import styles from './layout.module.css'
// Next.js
import { useRouter } from 'next/navigation';
// Internal Components
import HeaderLoggedIn from '@/components/HeaderLoggedIn/HeaderLoggedIn';
// Layouts
import LayoutLoggedIn from '@/layouts/LayoutLoggedIn/LayoutLoggedIn';
// Auth Context
import { useAuth } from '@/context/AuthProvider';


/* export const metadata: Metadata = {
  title: 'FitFriends',
  description: "Login to access your FitFriends account and challenges!",
} */

/* all logged in pages receive this layout */
export default function LoggedInLayout({
  children,
} : {
  children: React.ReactNode
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!user || !user.uid) {
      // Redirect to login page
      router.replace('/login');
    } else {
      setIsLoading(false);
    }
  }, [user, router]);

  // Display loading indicator while checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <HeaderLoggedIn />
    <LayoutLoggedIn>
     {children}
     </LayoutLoggedIn>
    </>
  )
}