'use client'
import React, {useState} from 'react'
import styles from './HeaderHomePage.module.css'
// Internal Components
import ButtonPillRoute from '../../Buttons/ButtonPillRoute/ButtonPillRoute'
// Next.js
import Link from 'next/link'

export default function HeaderHomePage() {
  // dropdown navbar menu on smaller screens:
  const [isDropdownActive, setIsDropdownActive] = useState(false);

  // toggle dropdown navbar menu on smaller screens:
  const toggleDropdown = () => {
      setIsDropdownActive((prev) => !prev); /* relies on prior state so dont change it to just !isDropdownActive */
  }

  // closes dropdown menu on nav item click
  const onClickCloseDropdown = () =>{
      setIsDropdownActive(false)
  }

  return (
    <header className={styles.header}>
{/*       <Link href='/'>
        <h1> Fit Friends </h1>
      </Link> */}

      <div className={`${styles.hamburger} ${isDropdownActive ? styles.hamburger_active : '' }`} onClick={toggleDropdown}>
          <div className={styles.bar} ></div>
          <div className={styles.bar} ></div>
          <div className={styles.bar} ></div>
      </div>

      <div className={styles.routes_flex_wrapper}>
        <ButtonPillRoute 
          label='Get Started'
          src='sign-up'
        />
      </div>

      {isDropdownActive && 
        <nav className={styles.navbar_dropdown}>
          <ul>
            <li className={styles.link}><Link href='/sign-up' onClick={onClickCloseDropdown} > Get Started</Link></li> 
          </ul>
        </nav>
      }
    </header>
  )
}
