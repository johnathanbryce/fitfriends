'use client'
import React, {useState, useEffect} from 'react'
import styles from './HeaderLoggedIn.module.css'
// Internal Components
import ButtonPillRoute from '../../Buttons/ButtonPillRoute/ButtonPillRoute'
// External Libraries
import {BsBell} from 'react-icons/bs'
import {MdOutlineDashboardCustomize} from 'react-icons/md'
import {PiUserListFill} from 'react-icons/pi'
import { FaUsers } from "react-icons/fa";
// Next.js
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
// Auth Context
import { useAuth } from '@/context/AuthProvider'
// Custom Hooks
import { useFetchUserData } from '@/hooks/useFetchUserData'

export default function HeaderLoggedIn() {
  // dropdown navbar menu on smaller screens:
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  // auth context
  const { user } = useAuth();
  // next pathname
  const pathname = usePathname();
  // custom hooks
  const { userData } = useFetchUserData();

  // toggle dropdown navbar menu on smaller screens:
  const toggleDropdown = () => {
      setIsDropdownActive((prev) => !prev); /* relies on prior state so dont change it to just !isDropdownActive */
  }

  // closes dropdown menu on nav item click
  const onClickCloseDropdown = () =>{
      setIsDropdownActive(false)
  }

  // TODO: when notifications are ready
  const onClickDisplayNotifications = () => {
    console.log('click')
  }

  // ensures no scrolling when dropdown is active (the nav items stay locked in place)
  useEffect(() => {
    if (isDropdownActive) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
  }, [isDropdownActive]);

  return (
    <header className={styles.header}>
      <Link href='/challenges-dashboard' className={styles.fit_friends_header}>
        <h3 className={styles.header_text}> Fit Friends </h3>
      </Link>

      <div className={`${styles.hamburger} ${isDropdownActive ? styles.hamburger_active : '' }`} onClick={toggleDropdown}>
          <div className={styles.bar} ></div>
          <div className={styles.bar} ></div>
          <div className={styles.bar} ></div>
      </div>
      
      <nav>
        <ul className={styles.navbar}>
          <li>
            <Link href='/challenges-dashboard' className={`${styles.nav_item} ${pathname === '/challenges-dashboard' ? styles.active : ''}`}>
              <MdOutlineDashboardCustomize className={styles.icon} />
              <p className={styles.nav_item_text}> challenges </p>
            </Link>
          </li>
          <li>
            <Link href='/users' className={`${styles.nav_item} ${pathname === '/users' ? styles.active : ''}`}>
              <FaUsers className={styles.icon} />
              <p className={styles.nav_item_text}> users </p>
            </Link>
          </li>
          <li>
            <Link href={`/user-profile/${user?.uid}`} className={`${styles.nav_item} ${pathname === `/user-profile/${user?.uid}` ? styles.active : ''}`}>
              {userData?.profilePicture ? (
                <div className={styles.prof_pic_container}>
                    <Image 
                      src={userData?.profilePicture} 
                      width={100} 
                      height={100} 
                      className={styles.prof_pic} 
                      alt="your profile picture"
                    />
                </div>
                ) : ( 
                <p className={styles.initials}> {userData?.firstName[0]}{userData?.lastName[0]}  </p>
                )}
            </Link>
          </li>
        </ul>
      </nav>
      
      {isDropdownActive && 
        <nav className={styles.navbar_dropdown}>
          <ul className={styles.navbar_links_container}>   
              <li className={styles.link}><Link href='/challenges-dashboard' onClick={onClickCloseDropdown} > Challenges </Link></li> 
              <li className={styles.link}><Link href={`/user-profile/${user?.uid}`} onClick={onClickCloseDropdown} > Profile </Link></li> 
              <li className={styles.link}><Link href='/create-challenge' onClick={onClickCloseDropdown} > Create Challenge </Link></li>
              <li className={styles.link}><Link href='/users' onClick={onClickCloseDropdown} > Users </Link></li> 
          </ul>
        </nav>
      }

    </header>
  )
}
