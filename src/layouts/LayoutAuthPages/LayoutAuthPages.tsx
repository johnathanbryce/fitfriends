'use client'
import React from 'react'
import styles from './LayoutAuthPages.module.css'
// Next.js
import Link from 'next/link'
import { usePathname } from 'next/navigation';

interface LayoutAuthPagesProps {
  children: any,
}

export default function LayoutAuthPages({children}: LayoutAuthPagesProps) {
  const pathname = usePathname()
  const isVerifyEmailPage = pathname === '/verify-email';
  return (
    <main className={styles.main_container} >
        {!isVerifyEmailPage &&         
        <Link href='/' className={styles.header_position_absolute}>
          <h1> Fit Friends </h1>
        </Link>
        }
       {children}
    </main>
  )
}