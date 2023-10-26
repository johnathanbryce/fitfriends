'use client'
import React from 'react'
import styles from './HeaderLoggedIn.module.css'
// Internal Components
import ButtonPillRoute from '../Buttons/ButtonPillRoute/ButtonPillRoute'
// External Libraries
import {BsPersonCircle, BsBell} from 'react-icons/bs'
import {GiStrong} from 'react-icons/gi'
// Next.js
import Link from 'next/link'
import { useRouter } from 'next/navigation';
// Auth Context
import { useAuth } from '@/context/AuthProvider'

export default function HeaderLoggedIn() {
  // Routing
  const router = useRouter();

  // auth context
  const { user } = useAuth();

  const onClickDisplayNotifications = () => {
    console.log('click')
  }

  return (
    <header className={styles.header}>
        <Link href='/'><h1> FitFriends</h1></Link>
        <div className={styles.icons_container}>
          <Link href={`/challenges`}><GiStrong className={styles.icon} /></Link>
          <BsBell className={styles.icon} onClick={onClickDisplayNotifications } />
          <Link href={`/user-profile/${user?.uid}`}><BsPersonCircle className={styles.icon} /></Link>
        </div>

    </header>
  )
}
