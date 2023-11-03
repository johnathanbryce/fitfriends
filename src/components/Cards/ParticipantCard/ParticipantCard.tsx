import React from 'react'
import styles from './ParticipantCard.module.css'
// Next.js
import Image from 'next/image'
import Link from 'next/link'
import defaultUserImage from '../../../../public/images/default-user-img.png'
// External Libraries 
import {GoPerson} from 'react-icons/go'

interface ParticipantCardProps {
    userId: string,
    firstName: string,
    lastName: string,
    userName: string,
    profilePicture: any,
    cardio: number,
    weights: number,
    total: number
}

export default function ParticipantCard({userId, firstName, lastName, userName, profilePicture, cardio, weights, total}: ParticipantCardProps) {
  
    return (
        <div className={styles.participant_card}>
            <div className={styles.name_container}>
                <h5 className={styles.name}>{firstName} {lastName}</h5>
                <p className={styles.nickname}> aka &quot;{userName}&quot; </p>
            </div>
            <div className={styles.participant_overview}>
                {profilePicture ? (
                    <Image
                      src={URL.createObjectURL(profilePicture)}
                      className={styles.profile_pic} 
                      alt='The profile picture of one of the participants'
                    />
                  ) : (
                    <Image
                      src={defaultUserImage}
                      className={`${styles.profile_pic} ${styles.default_img}`} 
                      alt='The profile picture of one of the participants'
                    />
                )}
                <div className={styles.points_container}>
                    <p> Cardio: {cardio}</p>
                    <p> Weights: {weights}</p>
                    <p className={styles.total_points}> Total: {cardio + weights}</p>
                </div>
            </div>
        </div>
  )
}
