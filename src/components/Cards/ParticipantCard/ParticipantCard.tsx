import React from 'react'
import styles from './ParticipantCard.module.css'
// Next.js
import Image from 'next/image'
import Link from 'next/link'
import defaultUserImage from '../../../../public/images/default-user-img.png'

interface ParticipantCardProps {
    firstName: string,
    lastName: string,
    userName: string,
    profilePicture: any,
    cardio: number,
    weights: number,
    total: number
}

export default function ParticipantCard({firstName, lastName, userName, profilePicture, cardio, weights, total}: ParticipantCardProps) {
  return (
    <Link href="/"> {/*TODO: route this to user specific url ID: /user-overview/userID */}
        <div className={styles.participant_card}>
            <div>
                <h5 className={styles.name}>{firstName} {lastName}</h5>
                <p className={styles.nickname}> aka &quot;{userName}&quot; </p>
            </div>
            <div className={styles.participant_overview}>
                <Image src={profilePicture || defaultUserImage} width={100} height={100} className={styles.img} alt='an image of one of the participants' />
                <div className={styles.points_container}>
                    <p> Cardio: {cardio}</p>
                    <p> Weights: {weights}</p>
                    <p className={styles.total_points}> Total: {cardio + weights}</p>
                </div>
            </div>
        </div>
    </Link>
  )
}
