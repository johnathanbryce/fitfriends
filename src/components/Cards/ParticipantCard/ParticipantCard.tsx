import React from 'react'
import styles from './ParticipantCard.module.css'
// Next.js
import Image from 'next/image'
import Link from 'next/link'
import defaultUserImage from '../../../../public/images/default-user-img.png'
// External Libraries 
import {GoPerson} from 'react-icons/go'
import { TbHexagonNumber1 } from "react-icons/tb";

interface ParticipantCardProps {
    userId: string,
    firstName: string,
    lastName: string,
    userName: string,
    profilePicture: any,
    cardio: number,
    weights: number,
    total: number,
    index?: number
}

export default function ParticipantCard({firstName, lastName, userName, profilePicture, cardio, weights, index}: ParticipantCardProps) {
    return (
        <div className={index === 0 ? styles.first_place_participant_card : styles.participant_card}>
            {index === 0  && <TbHexagonNumber1 className={styles.first_place_number} />}
            <div className={styles.name_container}>
                {profilePicture ? (
                        <Image
                          src={URL.createObjectURL(profilePicture)}
                          className={styles.profile_pic_small_screens} 
                          alt='The profile picture of one of the participants'
                        />
                      ) : (
                        <Image
                          src={defaultUserImage}
                          className={`${styles.profile_pic_small_screens} ${styles.default_img}`} 
                          alt='The profile picture of one of the participants'
                        />
                )}
                <h6 className={styles.name}>{firstName} {lastName[0]}</h6>
                <p className={styles.nickname}> {userName} </p>
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
