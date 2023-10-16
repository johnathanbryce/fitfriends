import React from 'react'
import styles from './dashboard.module.css'
// Internal Components
import DailyPointsInput from '@/components/DailyPointsInput/DailyPointsInput'
import LeaderboardCard from '@/components/Cards/LeaderboardCard/LeaderboardCard'
// Internal Assets
import defaultUser from '../../../../public/images/default-user-img.png'

const USERS_DUMMY_LIST = [
  {
    category: 'Overall',
    name: 'John Bryce',
    points: 75,
    img: defaultUser,
  },
  {
    category: 'Cardio',
    name: 'Joel Busby',
    points: 34,
    img: defaultUser,
  },
  {
    category: 'Weights',
    name: 'Colin Stonier',
    points: 44,
    img: defaultUser,
  },
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



    </section>
  )
}
