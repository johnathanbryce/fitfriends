import React from 'react'
import styles from './LayoutLoggedIn.module.css'

interface LayoutLoggedOutProps {
  children: any,
}

export default function LayoutLoggedIn({children}: LayoutLoggedOutProps) {

  return (
    <main className={styles.main_container} >
       {children}
    </main>
  )
}