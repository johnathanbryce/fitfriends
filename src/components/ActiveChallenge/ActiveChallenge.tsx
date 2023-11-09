import React from 'react'
import styles from './ActiveChallenge.module.css'
// Next.js
import Link from 'next/link'

interface ActiveChallengeProps {
    name: string,
    id: string,
    creatorName: string,
    rules?: object
}

export default function ActiveChallenge({name, id, creatorName, rules}: ActiveChallengeProps) {
  return (
    <Link href={`/challenge/${id}`} className={styles.active_challenge}>
      <li className={styles.link_container}>
            <h6 className={styles.name}>{name}</h6>
            <p className={styles.creator}> creator: {creatorName} </p>
      </li>
    </Link>
  )
}
