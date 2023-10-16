import React from 'react'
import styles from './dashboard.module.css'
// Internal Components
import DailyPointsInput from '@/components/DailyPointsInput/DailyPointsInput'
import LeaderboardCard from '@/components/Cards/LeaderboardCard/LeaderboardCard'
import ParticipantCard from '@/components/Cards/ParticipantCard/ParticipantCard'
// Internal Assets
import defaultUser from '../../../../public/images/default-user-img.png'

const USERS_DUMMY_LIST = [
  {
    category: 'Overall',
    name: 'John Bryce',
    nickname: 'Johnny Squats',
    points: 75,
    cardio: 20,
    weights: 15,
    total: 35,
    img: defaultUser,
  },
  {
    category: 'Cardio',
    name: 'Joel Busby',
    nickname: 'Buzz Queen',
    points: 34,
    cardio: 20,
    weights: 5,
    total: 25,
    img: defaultUser,
  },
  {
    category: 'Weights',
    name: 'Colin Stonier',
    nickname: 'Stones',
    points: 44,
    cardio: 25,
    weights: 20,
    total: 45,
    img: defaultUser,
  }
]

export default function Dashboard() {

  return (
    <section className={styles.dashboard}>
      <div className={styles.dashboard_section}>
        <h2> Daily Input for Month </h2>
        <DailyPointsInput />
      </div>

      <div className={styles.dashboard_section}>
        <h3> Month Leaderboard</h3>
        <div className={styles.leaderboard_container}>
          { USERS_DUMMY_LIST.map((user) => (
            <LeaderboardCard
              key={user.name} 
              category={user.category}
              name={user.name}
              points={user.points}
              img={user.img}
            />
          ))}
        </div>
      </div>

      <div className={styles.dashboard_section}>
        <h3> Participants</h3>
        <div className={styles.participants_container}>
          { USERS_DUMMY_LIST.map((user) => (
            <ParticipantCard
              key={user.name} 
              name={user.name}
              img={user.img}
              nickname={user.nickname}
              cardio={user.cardio}
              weights={user.weights}
              total={user.points}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
