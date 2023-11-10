'use client'
import React, {useState} from 'react'
import styles from './HeaderLoggedIn.module.css'
// Internal Components
import ButtonPillRoute from '../../Buttons/ButtonPillRoute/ButtonPillRoute'
// External Libraries
import {BsPersonCircle, BsBell} from 'react-icons/bs'
import {MdOutlineDashboardCustomize} from 'react-icons/md'
import {GiStrong} from 'react-icons/gi'
import {PiUserListFill} from 'react-icons/pi'
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
      <Link href='/challenges-dashboard' className={styles.fit_friends_header}>
        <h1> Fit Friends </h1>
      </Link>

      <div className={`${styles.hamburger} ${isDropdownActive ? styles.hamburger_active : '' }`} onClick={toggleDropdown}>
          <div className={styles.bar} ></div>
          <div className={styles.bar} ></div>
          <div className={styles.bar} ></div>
      </div>
      
      <nav>
        <ul className={styles.navbar}>
          <li>
            <Link href={`/challenges-dashboard`} className={styles.nav_item}>
              <MdOutlineDashboardCustomize className={styles.icon} />
              <span className={styles.nav_item_text}> challenges </span>
            </Link>
          </li>
          <li>
            <Link href={`/users`} className={styles.nav_item}>
              <PiUserListFill className={styles.icon} />
              <span className={styles.nav_item_text}> users </span>
            </Link>
          </li>
          <li>
            <Link href={`/user-profile/${user?.uid}`} className={styles.nav_item}>
              <BsPersonCircle className={styles.icon} />
              <span className={styles.nav_item_text}> profile </span>
            </Link>
          </li>
        </ul>
      </nav>
      
      {isDropdownActive && 
        <nav className={styles.navbar_dropdown}>
          <ul>
              <li className={styles.link}><Link href='/challenges-dashboard' onClick={onClickCloseDropdown} > Challenges </Link></li> 
              <li className={styles.link}><Link href='/users' onClick={onClickCloseDropdown} > Users </Link></li> 
              <li className={styles.link}><Link href={`/user-profile/${user?.uid}`} onClick={onClickCloseDropdown} > Profile </Link></li>   
          </ul>
        </nav>
      }

    </header>
  )
}
