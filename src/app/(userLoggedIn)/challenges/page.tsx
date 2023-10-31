'use client'
import {useState, useEffect} from 'react'
import styles from './challenges.module.css'
// Next.js
import Link from 'next/link'
// Internal Components
import ActiveChallenge from '@/components/ActiveChallenge/ActiveChallenge'
import Loading from '@/app/loading'
// External Libraries
import {AiOutlinePlusSquare} from 'react-icons/ai'
// Firebase
import { database } from '../../../../firebaseApp'
import {ref, onValue, get} from 'firebase/database'

export default function Challenges() {
  const [challenges, setChallenges] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchActiveChallenges = async () => {
    setIsLoading(true)
    try {
      // get refs to all active challenges from db
      const challengesRef = ref(database, `challenges`);

      // gets a snapshot of all challenges in 'challenges'
      const challengesSnapshot = await get(challengesRef);
      const challengesData = challengesSnapshot.val();

      // convert the challenges object into an array of objects
      const challengesArray = Object.values(challengesData || {});
      setChallenges(challengesArray);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      setIsLoading(false);
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchActiveChallenges();
  }, []);

  return (
    <section className={styles.challenges}>
      <div className={styles.challenge_section}>
        <h2> Your challenges: </h2>
        <ul className={styles.active_challenges_container}>
          {isLoading ? (
              <Loading /> 
            ) : (
              challenges?.length > 0 ? (
                challenges.map((challenge: any) => (
                  <ActiveChallenge
                    key={challenge.id}
                    id={challenge.id}
                    name={challenge.name}
                  />
                ))
              ) : (
                <p className={styles.empty_challenges_text}> You have no active challenges. Create one below! </p>
              )
          )}
        </ul>
      </div>
      <div className={styles.challenge_section}>
        <Link href="challenges/create-challenge" className={styles.create_challenge}>
          <h2> Create a challenge</h2>
          <AiOutlinePlusSquare className={styles.icon} />
        </Link>
      </div>
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
