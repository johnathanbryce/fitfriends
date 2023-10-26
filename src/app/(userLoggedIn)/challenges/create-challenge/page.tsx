'use client'
import React, {useState} from 'react'
import styles from './create-challenge.module.css'
// Internal Components
import Input from '@/components/Input/Input';
import ButtonPill from '@/components/Buttons/ButtonPill/ButtonPill';
// Firebase
import { database } from '../../../../../firebaseApp';
import { ref, get, push, set} from 'firebase/database';

export default function CreateChallenge() {
    const [challengeName, setChallengeName] = useState('');
    const [cardioRules, setCardioRules] = useState('');
    const [weightsRules, setWeightsRules] = useState('');
    const [challengeStart, setChallengeStart] = useState('');
    const [challengeEnd, setChallengeEnd] = useState('');

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
            name: challengeName,
            participants: participants,
            rules: {
                cardioRules: cardioRules,
                weightsRules: weightsRules,
            },
            challengeDuration: {
              starts: challengeStart,
              ends: challengeEnd
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
          setCardioRules('');
          setWeightsRules('');
          setChallengeStart('');
          setChallengeEnd('');
        } catch (error) {
          console.error("Error adding a new challenge:", error);
        }
      }

  return (
    <section className={styles.create_challenge}>
        <h2> Create Your Fitness Challenge</h2>
        <div className={`${styles.input_container} ${styles.name_wrapper}`}>
            <h4> Challenge name </h4>
            <Input 
                name='challengeName'
                placeholder='write a fun and apt challenge name!'
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
                 <Input 
                    name='cardioRules'
                    placeholder="ex: 15 minutes of cardio equals 1 point..."
                    value={cardioRules}
                    type='text'
                    onChange={(e) => setCardioRules(e)}
                    theme='dark'
                    required={true}
                />
            </div>
            <div className={styles.rule}>
                <h5> Weights </h5>
                <Input 
                    name='weightsRules'
                    placeholder='ex: 30 minutes of weights equals 1 point...'
                    value={weightsRules}
                    type='text'
                    onChange={(e) => setWeightsRules(e)}
                    theme='dark'
                    required={true}
                />
            </div>
        </div>
        
        <div className={styles.input_container}>
            <h4> Challenge duration </h4>
            <div className={styles.rule}>
                 <h5> Start date: </h5>
                 <Input 
                    name='startDate'
                    placeholder=""
                    value={challengeStart}
                    type='text'
                    onChange={(e) => setChallengeStart(e)}
                    theme='dark'
                    required={true}
                />
            </div>
            <div className={styles.rule}>
                <h5> End date: </h5>
                <Input 
                    name='endDate'
                    placeholder=''
                    value={challengeEnd}
                    type='text'
                    onChange={(e) => setChallengeEnd(e)}
                    theme='dark'
                    required={true}
                />
            </div>
        </div>
        <ButtonPill 
            label="Create"
            onClick={addNewChallenge}
            isLoading={false}
        
        />


    </section>
  )
}
