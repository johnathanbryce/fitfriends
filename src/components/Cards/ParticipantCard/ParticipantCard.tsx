import React from 'react'
import styles from './ParticipantCard.module.css'
// Next.js
import Image from 'next/image'
// External Libraries 
import { TbHexagonNumber1 } from "react-icons/tb";

interface ParticipantCardProps {
    userId: string,
    firstName: string,
    lastName: string,
    userName: string,
    profilePicture: any,
    pointMetrics: any
    total: number,
    index?: number
}

export default function ParticipantCard({firstName, lastName, userName, profilePicture, pointMetrics, index, total}: ParticipantCardProps) {
    let pointMetricsArray = Object.entries(pointMetrics).map(([id, metric]) => {
      if (metric && typeof metric === 'object') {
          return { id, ...metric };
      } else {
          // Return a default structure if metric is not an object
          return { id, name: '', score: 0 };
      }
    });

    return (
        <div className={index === 0 ? styles.first_place_participant_card : styles.participant_card}>
            {index === 0  && <TbHexagonNumber1 className={styles.first_place_number} />}
            <div className={styles.name_container}>
              <div className={styles.profile_pic_container_small_screens}>
                <Image
                  src={profilePicture}
                  className={styles.profile_pic} 
                  alt='The profile picture of one of the participants'
                  width={100}
                  height={100}
                />      
              </div>
              <h6 className={styles.name}>{firstName} {lastName[0]}</h6>
              <p className={styles.nickname}> {userName} </p>
            </div>
            <div className={styles.participant_overview}>
              <div className={profilePicture ? styles.profile_pic_container : ''}>
                <Image
                    src={profilePicture}
                    className={styles.profile_pic} 
                    alt='The profile picture of one of the participants'
                    width={100}
                    height={100}
                  />      
                </div>
              <div className={styles.points_container}>
                {pointMetricsArray.map((metric: any, idx: number) => (
                  <p key={idx}> {metric.name}: {metric.score}</p>
                ))}
                <p className={styles.total_points}> Total: {total}</p>
              </div>
            </div>
        </div>
  )
}
