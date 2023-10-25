'use client'
import {useState, useEffect} from 'react'
import styles from './dashboard.module.css'
// Internal Components
import DailyPointsInput from '@/components/DailyPointsInput/DailyPointsInput'
import LeaderboardCard from '@/components/Cards/LeaderboardCard/LeaderboardCard'
import ParticipantCard from '@/components/Cards/ParticipantCard/ParticipantCard'
// Internal Assets
import defaultUser from '../../../../../public/images/default-user-img.png'
// Firebase
import { database } from '../../../../../firebaseApp'
import {ref, onValue} from 'firebase/database'
// Utils 
import { getCurrentDay, getCurrentMonth } from '@/utils/dateHelpers'
import { getChallengeMonthAndYear } from '@/utils/monthlyChallengeHelpers'
// Auth Context
import { useAuth } from '@/context/AuthProvider'

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

interface User {
  uid: any,
  firstName: string,
  lastName: string,
  userName: string,
  email: string,
  profilePicture: string,
  challenges: object
  totalPointsOverall: object,
}

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [challengeMonth, setChallengeMonth] = useState(getChallengeMonthAndYear()) //TODO: this should probabyl be coming from db?

  // auth context
  const { user } = useAuth();

  // util functions
  const currentDay = getCurrentDay()
  const displayChallengeMonth = getCurrentMonth()

  // read data from db
  useEffect(() => {
    const usersCountRef= ref(database, 'users');
    onValue(usersCountRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert the data object into an array of objects
        const usersArray = Object.values(data) as User[];
        setUsers(usersArray);
      }
    });
  }, [])

  return (
    <section className={styles.dashboard}>
      <h2 className={styles.challenge_month}>{displayChallengeMonth}  </h2>
      <div className={styles.dashboard_section}>
        <h3> Daily Points Input for {currentDay}  </h3>
        <DailyPointsInput userID={user?.uid} />
      </div>

      <div className={styles.dashboard_section}>
        <h4> Leaderboard</h4>
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
        <h4> Participants</h4>
        <div className={styles.participants_container}>
        {users.length > 0 ? (
            <>
              {users.map((user: any) => (
                <ParticipantCard
                  key={user.uid}
                  userId={user.uid}
                  firstName={user.firstName}
                  lastName={user.lastName}
                  profilePicture={!user.profilePicture ? defaultUser : ''}
                  userName={user.userName}
                  cardio={user.challenges[challengeMonth].cardioPoints}
                  weights={user.challenges[challengeMonth].weightsPoints}
                  total={user.challenges[challengeMonth].totalPoints}
                />
              ))}
            </>
          ) : (
            <p> There are no active users for this challenge</p>
        )}
        </div>
      </div>
    </section>
  )
}
