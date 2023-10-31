import React from 'react'
import styles from '../styles/not-found.module.css'
// Next.js
import Link from 'next/link'
// External Libraries
import {AiOutlineHome} from 'react-icons/ai'

export default function NotFound() {
  return (
    <section className={styles.not_found}>
      <h2> 404 page not found. </h2>
      <div className={styles.sub_header_wrapper}>
        <h4> Don&apos;t worry, we&apos;ll help you find your way back to the path of gains: </h4>
        <Link href='/login'>
            <AiOutlineHome className={styles.icon} /> 
        </Link> 
      </div>

    </section>
  )
}
