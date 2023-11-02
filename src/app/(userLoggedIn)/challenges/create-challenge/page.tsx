'use client'
import React, {useState, useEffect} from 'react'
import styles from './create-challenge.module.css'
// Next.js
import { useRouter } from 'next/navigation';
// Internal Components
import Input from '@/components/Input/Input';
import ButtonPill from '@/components/Buttons/ButtonPill/ButtonPill';
// Firebase
import { database } from '../../../../../firebaseApp';
import { ref, get, push, set} from 'firebase/database';
// Auth Context
import { useAuth } from '@/context/AuthProvider';
// External Libraries
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';


export default function CreateChallenge() {
    const [challengeName, setChallengeName] = useState('');
    const [cardioMinutes, setCardioMinutes] = useState('');
    const [cardioPoints, setCardioPoints] = useState('');
    const [weightsMinutes, setWeightsMinutes] = useState('');
    const [weightsPoints, setWeightsPoints] = useState('');

    // router
    const router = useRouter();
    // auth context
    const {user} = useAuth();

    // react-date-range state
    const [selection, setSelection] = useState([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      },
    ]);

    // react-date-range fn
    const handleSelect = (ranges: any) => {
      setSelection([ranges.selection]);
    };

    async function addNewChallenge(e: any) {
        e.preventDefault();
        // get refs to "users" & "challenges" main data buckets in db
        const challengesRef = ref(database, `challenges`);
        const usersRef = ref(database, 'users');
    
        // gets a snapshot of all users in 'users'
        const usersSnapshot = await get(usersRef);
    
        // participants object to be added to each monthly challenge
        const participants: any = {};
    
        // adds ALL registered users from "users" bucket to this challenge 
        usersSnapshot.forEach((userSnapshot) => {
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
        });
    
        try {
          const newChallenge: any = {
            id: '', 
            creator: user?.uid,
            name: challengeName,
            participants: participants,
            rules: {
                cardioMinutes: cardioMinutes,
                cardioPoints: cardioPoints,
                weightsMinutes: weightsMinutes,
                weightsPoints: weightsPoints,
            },
            challengeDuration: {
              starts: selection[0].startDate.toString(),
              ends: selection[0].endDate.toString()
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

          // reset all inputs
          setChallengeName('');
          setCardioPoints('');
          setCardioMinutes('');
          setWeightsPoints('');
          setWeightsMinutes('');
          // route to the challenge
          router.replace(`/dashboard/${newChallengeId}`); 
        } catch (error) {
          console.error("Error adding a new challenge:", error);
        }
    }

  return (
    <form className={styles.create_challenge} onSubmit={addNewChallenge}>
        <h2> Create Your Fitness Challenge</h2>
        <div className={`${styles.input_container} ${styles.name_wrapper}`}>
            <h4> Challenge name </h4>
            <Input 
                name='challengeName'
                placeholder=''
                value={challengeName}
                type='text'
                onChange={(e) => setChallengeName(e)}
                theme='dark'
                required={true}
            />
        </div>

        <div className={styles.input_container}>
            <h4> Rules </h4>
            <div className={styles.rule}>
                 <h5> Cardio: </h5>
                 <div className={styles.rules_flex_wrapper}>
                  <Input 
                      name='cardioMinutes'
                      placeholder=" ex: 20 minutes"
                      value={cardioMinutes}
                      type='text'
                      onChange={(e) => setCardioMinutes(e)}
                      theme='dark'
                      required={true}
                  />
                  <p> equals </p>
                  <Input 
                      name='cardioPoints'
                      placeholder=" ex: 1 point"
                      value={cardioPoints}
                      type='text'
                      onChange={(e) => setCardioPoints(e)}
                      theme='dark'
                      required={true}
                  />
                 </div>
            </div>
            <div className={styles.rule}>
                <h5> Weights </h5>
                <div className={styles.rules_flex_wrapper}>
                  <Input 
                      name='weightsMinutes'
                      placeholder='ex: 30 mins'
                      value={weightsMinutes}
                      type='text'
                      onChange={(e) => setWeightsMinutes(e)}
                      theme='dark'
                      required={true}
                  />
                  <p> equals </p>
                  <Input 
                      name='weightsPoints'
                      placeholder='ex: 1 point'
                      value={weightsPoints}
                      type='text'
                      onChange={(e) => setWeightsPoints(e)}
                      theme='dark'
                      required={true}
                  />
                </div>
            </div>
        </div>
        
        <div className={styles.input_container}>
            <h4> Challenge duration </h4>
            <DateRange
              ranges={selection}
              onChange={handleSelect}
              className={styles.date_range_picker}
              showMonthAndYearPickers={false}
              showDateDisplay={false}
              rangeColors={['#FF5722']}
              style={{width: '28.5rem'}}
            />
        </div>

        <ButtonPill 
            label="Create Challenge"
            isLoading={false}
            secondary={true}  
        />
    </form>
  )
}
