import React from 'react'
import styles from './LayoutHomePage.module.css'

interface LayoutHomePageProps {
    children: any,
}
  
  export default function LayoutHomePage({children}: LayoutHomePageProps) {
  
    return (
      <main className={styles.main_container} >
         {children}
      </main>
    )
  }
