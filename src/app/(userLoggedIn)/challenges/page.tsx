'use client'
import {useState} from 'react'
import styles from './challenges.module.css'
// Next.js
import Link from 'next/link'
// Utils
import { getCurrentMonth, getNextThreeMonths } from '@/utils/dateHelpers'
// Internal Components
import MonthChallengeCard from '@/components/Cards/MonthChallengeCard/MonthChallengeCard'

// Auth Context
import { useAuth } from '@/context/AuthProvider'
// External Libraries
import {AiOutlinePlusSquare} from 'react-icons/ai'

export default function Challenges() {
  const currentMonth = getCurrentMonth();
  const nextThreeMonths = getNextThreeMonths();
 
  const {user} = useAuth()

  const handleChallengeClick = (isActive: boolean) => {
    if (isActive) {
      // handle routing to active challenge
    } else {
      // 
    }
  };



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
