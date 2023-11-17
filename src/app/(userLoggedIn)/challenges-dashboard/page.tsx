'use client'
import {useState, useEffect} from 'react'
import styles from './challenges-dashboard.module.css'
// Next.js
import Link from 'next/link'
// Internal Components
import ActiveChallenge from '@/components/ActiveChallenge/ActiveChallenge'
import Loading from '@/app/loading'
import ButtonPillRoute from '@/components/Buttons/ButtonPillRoute/ButtonPillRoute'
import ExpandableContainer from '@/components/ExpandableContainer/ExpandableContainer'
// Firebase
import { database } from '../../../../firebaseApp'
import {ref, get} from 'firebase/database'
// Auth Context
import { useAuth } from '@/context/AuthProvider'

interface Challenge {
  id: string;
  name: string;
  challengeWinner: string,
  challengeWinnerUsername: string,
  creatorName: string;
  creatorEmail: string,
  participants: object; 
  rules: object,
  challengeDuration: object
  status: 'active' | 'inactive';
}

export default function Challenges() {
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [yourChallenges, setYourChallenges] = useState<Challenge[]>([]);
  const [pastChallenges, setPastChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // auth context
  const { user } = useAuth();

  const fetchChallenges = async () => {
    try {
      setIsLoading(true);
      // get refs to all challenges from db
      const challengesRef = ref(database, `challenges`);
      // gets a snapshot of all challenges in 'challenges'
      const challengesSnapshot = await get(challengesRef);
      const challengesData = challengesSnapshot.val();
      // convert the challenges object into an array of objects
      const challengesArray: Challenge[] = Object.values(challengesData || {});
      // filter challenges to only those that the user is a participant 
      const yourChallenges = challengesArray.filter((challenge: any) => user?.uid in challenge.participants && challenge.status === 'active');
      setYourChallenges(yourChallenges);
      // filter out 'yourChallenges' from 'activeChallenges' so as not to duplicate
      const activeChallenges = challengesArray.filter((challenge: any) => !(user?.uid in challenge.participants) && challenge.status === 'active');
      setActiveChallenges(activeChallenges);
      // filter out 'pastChallenges' from challenges marked "status: inactive"
      const pastChallenges = challengesArray.filter((challenge: any) => challenge.status === 'inactive');
      setPastChallenges(pastChallenges)
  
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }
  
  useEffect(() => {
    fetchChallenges();
  }, []);
  
  return (
    <section className={styles.challenges}>
      <div className={styles.challenge_section}>
        <ExpandableContainer title="Your Challenges" isOpenDefault={true}>
          <ul className={styles.active_challenges_container}>
            {isLoading ? (
                 <div className={styles.loading_container}>
                    <Loading /> 
                 </div>
              ) : (
                yourChallenges?.length > 0 ? (
                  yourChallenges.map((challenge: any) => (
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
                  <p><Link href="/create-challenge"> <span className={styles.underline}>Create one</span> and invite your friends! </Link></p>
                </>
                )
            )}
          </ul>
         </ExpandableContainer>
      </div>
      <div className={styles.challenge_section}>
        <ExpandableContainer title="Active Challenges">
          <ul className={styles.active_challenges_container}>
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
                      <p className={styles.empty_challenges_text}> There are no active challenges. </p>
                      <p><Link href="/create-challenge"> <span className={styles.underline}>Create one</span> and invite your friends! </Link></p>
                    </>
                  )
              )}
          </ul>
        </ExpandableContainer>
      </div>

      <div className={styles.challenge_section}>
        <ExpandableContainer title="Past Challenges">
          <ul className={styles.active_challenges_container}>
              {isLoading ? (
                  <Loading /> 
                ) : (
                  pastChallenges?.length > 0 ? (
                    pastChallenges.map((challenge: any) => (
                      <ActiveChallenge
                        key={challenge.id}
                        id={challenge.id}
                        name={challenge.name}
                        creatorName={challenge.creatorName}
                      />
                    ))
                  ) : (
                    <p> There are no completed challenges yet! </p>
                  )
              )}
          </ul>
        </ExpandableContainer>
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


