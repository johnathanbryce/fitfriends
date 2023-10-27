'use client'
import {useState} from 'react'
import styles from './challenges.module.css'
// Next.js
import Link from 'next/link'
// Auth Context
import { useAuth } from '@/context/AuthProvider'
// External Libraries
import {AiOutlinePlusSquare} from 'react-icons/ai'
// Firebase
import { database } from '../../../../firebaseApp'
import {ref, onValue, get} from 'firebase/database'

export default function Challenges() {
  const [challenges, setChallenges] = useState<any>()

  const {user} = useAuth()


  return (
    <section className={styles.challenges}>
      <h2> Join a challenge: </h2>
      <div className={styles.challenge_options_container}>

      </div>
      <p> OR </p>
      <Link href="challenges/create-challenge">
        <h2> Create One </h2>
        <AiOutlinePlusSquare className={styles.icon} />
      </Link>


      
    </section>
  )
}

{/*       <div className={styles.challenge_options_container}>
        <MonthChallengeCard
          month={currentMonth}
          isActive={true}
          handleChallengeClick={handleChallengeClick}
        />
        {nextThreeMonths.map((month, index) => (   
            <MonthChallengeCard 
                key={month}
                index={index}
                month={month}
                isActive={false}
                handleChallengeClick={handleChallengeClick}
            />
        ))} */}
