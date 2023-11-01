'use client'
import React, {useState} from 'react'
import styles from './HeaderLoggedIn.module.css'
// Internal Components
import ButtonPillRoute from '../Buttons/ButtonPillRoute/ButtonPillRoute'
// External Libraries
import {BsPersonCircle, BsBell} from 'react-icons/bs'
import {GiStrong} from 'react-icons/gi'
// Next.js
import Link from 'next/link'
// Auth Context
import { useAuth } from '@/context/AuthProvider'

export default function HeaderLoggedIn() {
  // dropdown navbar menu on smaller screens:
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  // auth context
  const { user } = useAuth();

  // toggle dropdown navbar menu on smaller screens:
  const toggleDropdown = () => {
      setIsDropdownActive((prev) => !prev); /* relies on prior state so dont change it to just !isDropdownActive */
  }

  // closes dropdown menu on nav item click
  const onClickCloseDropdown = () =>{
      setIsDropdownActive(false)
  }

  // TODO: when notifications are developed
  const onClickDisplayNotifications = () => {
    console.log('click')
  }

  return (
    <header className={styles.header}>
      <Link href='/'>
        <h1> Fit Friends </h1>
      </Link>

      <div className={`${styles.hamburger} ${isDropdownActive ? styles.hamburger_active : '' }`} onClick={toggleDropdown}>
          <div className={styles.bar} ></div>
          <div className={styles.bar} ></div>
          <div className={styles.bar} ></div>
      </div>

        <ul className={styles.navbar}>
          <li>
            <Link href={`/challenges`} className={styles.nav_item}>
              <GiStrong className={styles.icon} />
              <span className={styles.nav_item_text}> challenges </span>
            </Link>
          </li>
          {/* <BsBell className={styles.icon} onClick={onClickDisplayNotifications } /> */}
          <li>
            <Link href={`/user-profile/${user?.uid}`} className={styles.nav_item}>
              <BsPersonCircle className={styles.icon} />
              <span className={styles.nav_item_text}> profile </span>
            </Link>
          </li>
        </ul>

        {isDropdownActive && 
        <nav className={styles.navbar_dropdown}>
          <ul>
              <li className={styles.link}><Link href='/challenges' onClick={onClickCloseDropdown} > Challenges </Link></li> 
              <li className={styles.link}><Link href={`/user-profile/${user?.uid}`} onClick={onClickCloseDropdown} > Profile </Link></li>   
          </ul>
        </nav>
      }

    </header>
  )
}
