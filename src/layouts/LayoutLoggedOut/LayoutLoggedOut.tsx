import React from 'react'
import styles from './LayoutLoggedOut.module.css'

interface LayoutLoggedOutProps {
  children: any,
}

export default function LayoutLoggedOut({children}: LayoutLoggedOutProps) {

  return (
    <main className={styles.main_container} >
       {children}
    </main>
  )
}