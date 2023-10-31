import React from 'react'
import styles from './ActiveChallenge.module.css'
// Next.js
import Link from 'next/link'

interface ActiveChallengeProps {
    name: string,
    id: string,
    rules?: object
}

export default function ActiveChallenge({name, id, rules}: ActiveChallengeProps) {
  return (
    <Link href={`/dashboard/${id}`} className={styles.active_challenge}>
        <h5 className={styles.name}>{name}</h5>

    </Link>
  )
}
