'use client'
import {useState, useEffect} from 'react'
import styles from './challenges.module.css'
// Next.js
import Link from 'next/link'
// Internal Components
import { Carousel } from '@/components/Carousel/Carousel'
import ActiveChallenge from '@/components/ActiveChallenge/ActiveChallenge'
import Loading from '@/app/loading'
import ButtonPillRoute from '@/components/Buttons/ButtonPillRoute/ButtonPillRoute'
// External Libraries
import {AiOutlinePlusSquare} from 'react-icons/ai'
// Firebase
import { database } from '../../../../firebaseApp'
import {ref, onValue, get} from 'firebase/database'

export default function Challenges() {
  const [activeChallenges, setActiveChallenges] = useState<any>();
  const [yourChallenges, setYourChallenges] = useState<any>();
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
      setActiveChallenges(challengesArray);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      setIsLoading(false);
    } finally {
      setIsLoading(false)
    }
  }

  const fetchYourChallenges = async () => {
    
  }

  useEffect(() => {
    fetchActiveChallenges();
    console.log(activeChallenges)
  
    
  }, []);

  return (
    <section className={styles.challenges}>
      <div className={styles.challenge_section}>
        <h2> Your challenges </h2>
         <p> This feature is coming soon... </p>
{/*         <ul className={styles.active_challenges_container}>
          {isLoading ? (
              <Loading /> 
            ) : (
              activeChallenges?.length > 0 ? (
                activeChallenges.map((challenge: any) => (
                  <ActiveChallenge
                    key={challenge.id}
                    id={challenge.id}
                    name={challenge.name}
                    creatorName={challenge.creatorName}
                  />
                ))
              ) : (
                <p className={styles.empty_challenges_text}> You have no active challenges. Create one and invite your friends! </p>
              )
          )}
        </ul> */}
      </div>
      <div className={styles.challenge_section}>
        <h2> Active challenges </h2>
          <ul className={styles.active_challenges_container}>
            {/* <Carousel> */}
              {isLoading ? (
                  <Loading /> 
                ) : (
                  activeChallenges?.length > 0 ? (
                    activeChallenges.map((challenge: any) => (
                      <ActiveChallenge
                        key={challenge.id}
                        id={challenge.id}
                        name={challenge.name}
                        creatorName={challenge.creatorName}
                      />
                    ))
                  ) : (
                    <>
                      <p className={styles.empty_challenges_text}> You have no active challenges. </p>
                      <p><Link href="/create-challenge"> <span className={styles.underline}>Create one</span>   and invite your friends! </Link></p>
                    </>
   
                  )
              )}
            {/* </Carousel> */}
          </ul>
        
      </div>
      <div className={styles.btn_wrapper}>
        <ButtonPillRoute 
          label="Create a challenge"
          src="/create-challenge"
        />
      </div>
    </section>
  )
}


