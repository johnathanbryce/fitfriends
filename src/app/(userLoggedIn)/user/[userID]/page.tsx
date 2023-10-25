'use client'
import React, {useState, useEffect} from 'react'
import styles from './user-overview.module.css'
// Internal Components
import DailyPointsInput from '@/components/DailyPointsInput/DailyPointsInput'
// Next.js
import { useRouter } from 'next/navigation'
// Auth Context
import { useAuth } from '@/context/AuthProvider';

interface UserOverviewProps {
    params: any
}

// /user-overview/XXXXX
export default function UserOverview({params}: UserOverviewProps) {
  const { user } = useAuth();
  const { handleLogout } = useAuth();

  useEffect(() => {
      // fetch data based on params.userID from Firebase here
  }, [])
  

    return (
        <section className={styles.user_overview}>
          {/* <DailyPointsInput /> */}      

          <button onClick={handleLogout}> Log out </button>
        </section>
      );
}
