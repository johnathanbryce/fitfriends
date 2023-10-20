'use client'
import {useState, useEffect} from 'react'
import styles from './dashboard.module.css'
// Internal Components
import DailyPointsInput from '@/components/DailyPointsInput/DailyPointsInput'
import LeaderboardCard from '@/components/Cards/LeaderboardCard/LeaderboardCard'
import ParticipantCard from '@/components/Cards/ParticipantCard/ParticipantCard'
// Internal Assets
import defaultUser from '../../../../public/images/default-user-img.png'
// Firebase
import { database } from '../../../../firebaseApp'
import {child, push, update, ref, onValue} from 'firebase/database'
// Utils 
import { getCurrentDay } from '@/utils/dateHelpers'

// TODO:
/*

1. create a function which adds authorized users into "users"
    - make sure the UID (user id) is unique and unchanging
2. reference updateUserCardioPoints function to play around and test
   updating that specific authorized users points

*/

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
  const [users, setUsers] = useState([]);

  // util functions
  const currentDay = getCurrentDay()

  // testing db updates 
  const updateUserCardioPoints = (uid: any, user: string, cardioPoints: any) => {
    const newPoints = {
      uid: uid,
      user: user,
      cardioPoints: cardioPoints
    }

    const newPointsKey = push(child(ref(database), 'users')).key;

    // this updates at both "users" & "challenges"
    const updates: { [key: string]: any } = {};
    updates['/users/' + uid + newPointsKey] = newPoints;
    updates['/challenges/' + newPointsKey] = newPoints;
    return update(ref(database), updates);
  }

  
  // read data from db
  useEffect(() => {
    const usersCountRef= ref(database, 'users');
    onValue(usersCountRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data)
      setUsers(data);
    });

    //updateUserCardioPoints('', 'john', 100);

  }, [])

  return (
    <section className={styles.dashboard}>
      <div className={styles.dashboard_section}>
        <h2> Daily Points Input for {currentDay}  </h2>
        <DailyPointsInput />
      </div>

      <div className={styles.dashboard_section}>
        <h3> Leaderboard</h3>
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
