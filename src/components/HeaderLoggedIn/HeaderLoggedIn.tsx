'use client'
import React from 'react'
import styles from './HeaderLoggedIn.module.css'
// Internal Components
import ButtonPillRoute from '../Buttons/ButtonPillRoute/ButtonPillRoute'
// External Libraries
import {BsPersonCircle, BsBell} from 'react-icons/bs'
// Next.js
import Link from 'next/link'
import { useRouter } from 'next/navigation';

export default function HeaderLoggedIn() {
  // Routing
  const router = useRouter();

  const onClickDisplayNotifications = () => {
    console.log('click')
  }

  const onClickRouteToProfile = () => {
    // routes to dashboard
    router.replace('/profile');
  }

  return (
    <header className={styles.header}>
        <h1> FitFriends</h1>
        <div className={styles.icons_container}>
          <BsBell className={styles.icon} onClick={onClickDisplayNotifications } />
          <Link href={'/profile'}><BsPersonCircle className={styles.icon} /></Link>
        </div>

    </header>
  )
}
