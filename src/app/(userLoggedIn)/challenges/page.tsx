'use client'
import {useState} from 'react'
import styles from './challenges.module.css'
// Utils
import { getCurrentMonth, getNextThreeMonths } from '@/utils/dateHelpers'
// Internal Components
import MonthChallengeCard from '@/components/Cards/MonthChallengeCard/MonthChallengeCard'

export default function Challenges() {
  const currentMonth = getCurrentMonth();
  const nextThreeMonths = getNextThreeMonths();

  const handleChallengeClick = (isActive: boolean) => {
    if (isActive) {
      // handle routing to active challenge
    } else {
      // 
    }
  };

  return (
    <section className={styles.challenges}>
      <h2> Join A Challenge </h2>
      <div className={styles.challenge_options_container}>
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
        ))}
      </div>
    </section>
  )
}
