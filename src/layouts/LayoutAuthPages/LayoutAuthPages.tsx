import React from 'react'
import styles from './LayoutAuthPages.module.css'
// Next.js
import Link from 'next/link'

interface LayoutAuthPagesProps {
  children: any,
}

export default function LayoutAuthPages({children}: LayoutAuthPagesProps) {

  return (
    <main className={styles.main_container} >
        <Link href='/' className={styles.header_position_absolute}>
          <h1> Fit Friends </h1>
        </Link>
       {children}
    </main>
  )
}