'use client'
import React, {useState} from 'react'
import styles from './HeaderAuthPages.module.css'
// Internal Components
import ButtonPillRoute from '../../Buttons/ButtonPillRoute/ButtonPillRoute'
// Next.js
import Link from 'next/link'

export default function HeaderAuthPages() {
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
      <Link href='/'>
        <h1> Fit Friends </h1>
      </Link>

{/*       <div className={`${styles.hamburger} ${isDropdownActive ? styles.hamburger_active : '' }`} onClick={toggleDropdown}>
          <div className={styles.bar} ></div>
          <div className={styles.bar} ></div>
          <div className={styles.bar} ></div>
      </div>

      <div className={styles.routes_flex_wrapper}>
        <ButtonPillRoute 
          label='Sign Up'
          src='sign-up'
        />
        <ButtonPillRoute 
          label='Login'
          src='login'
        />
      </div>

      {isDropdownActive && 
        <nav className={styles.navbar_dropdown}>
          <ul>
          <li className={styles.link}><Link href='/' onClick={onClickCloseDropdown} > Home </Link></li> 
            <li className={styles.link}><Link href='/login' onClick={onClickCloseDropdown} > Login </Link></li>   
            <li className={styles.link}><Link href='/sign-up' onClick={onClickCloseDropdown} > Sign Up </Link></li> 
          </ul>
        </nav>
      } */}
    </header>
  )
}
