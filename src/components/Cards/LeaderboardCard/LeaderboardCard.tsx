import React from 'react'
import styles from './LeaderboardCard.module.css'
// Next.js
import Image from 'next/image'

interface LeaderboardCardProps {
    category: string,
    name: string,
    points: number,
    img?: any
}

export default function LeaderboardCard({category, img, name, points}: LeaderboardCardProps) {
  return (
    <div className={styles.leaderboard_card}>
        <h5>{category}</h5>
        <div className={styles.user_details}>
            <Image src={img.src} width={100} height={100} className={styles.user_img} alt='a profile picture image of one of the leaderboard members' />
            <div>
                <p className={styles.name}>{name}</p>
                <p className={styles.points}>Total: {points}</p>
            </div>
        </div>
    </div>
  )
}
