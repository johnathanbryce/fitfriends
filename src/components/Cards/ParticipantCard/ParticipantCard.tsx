import React from 'react'
import styles from './ParticipantCard.module.css'
// Next.js
import Image from 'next/image'
import Link from 'next/link'

interface ParticipantCardProps {
    name: string,
    nickname?: string,
    img: any,
    cardio: number,
    weights: number,
    total: number
}

export default function ParticipantCard({name, nickname, img, cardio, weights, total}: ParticipantCardProps) {

    const totalPoints = cardio + weights;

  return (
    <Link href="/">
        <div className={styles.participant_card}>
            <div>
                <h5 className={styles.name}>{name}</h5>
                <p className={styles.nickname}> aka &quot;{nickname}&quot; </p>
            </div>
            <div className={styles.participant_overview}>
                <Image src={img.src} width={100} height={100} className={styles.img} alt='an image of one of the participants' />
                <div className={styles.points_container}>
                    <p> Cardio: {cardio}</p>
                    <p> Weights: {weights}</p>
                    <p className={styles.total_points}> Total: {totalPoints}</p>
                </div>
            </div>
        </div>
    </Link>
  )
}
