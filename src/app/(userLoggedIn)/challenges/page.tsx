'use client'
import {useState} from 'react'
import styles from './challenges.module.css'
// Next.js
import Link from 'next/link'
// Utils
import { getCurrentMonth, getNextThreeMonths } from '@/utils/dateHelpers'
// Internal Components
import MonthChallengeCard from '@/components/Cards/MonthChallengeCard/MonthChallengeCard'
// Firebase
import { database } from '../../../../firebaseApp'
import { ref, get, push, set} from 'firebase/database';
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

  async function addNewChallenge() {
    // get refs to "users" & "challenges" main data buckets in db
    const challengesRef = ref(database, `challenges`);
    const usersRef = ref(database, 'users');

    // gets a snapshot of all users in 'users'
    const usersSnapshot = await get(usersRef);

    // participants object to be added to each monthly challenge
    const participants: any = {};

/*     usersSnapshot.forEach((userSnapshot) => {
      const userData = userSnapshot.val();
      if (userData) {
        // participant object to be added to "participants" for each monthly challenge
        const participant = {
          cardioPoints: 0,
          weightsPoints: 0,
          totalPoints: 0,
        };
        // add the participant to the participants object with the user's ID as the key
        participants[userSnapshot.key] = participant;
      } 
    }); */

    try {
      const newChallenge: any = {
        id: '', 
        name: '',
        participants: participants,
        rules: {
            cardioRules: '',
            weightsRules: '',
        },
        challengeDuration: {
          starts: '',
          ends: ''
        }
      };
  
      // push the new challenge to the 'challenges' node
      const newChallengeRef = push(challengesRef, newChallenge);
      // get the generated ID from the reference
      const newChallengeId = newChallengeRef.key;
      // update the 'id' field in the newChallenge object with the generated ID
      newChallenge.id = newChallengeId;
      // update the challenge with the generated ID
      set(newChallengeRef, newChallenge);
    } catch (error) {
      console.error("Error adding a new challenge:", error);
    }
  }

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
