'use client'
import React, {useState} from 'react';
import styles from './DailyPointsInput.module.css'
// Internal Components
import Input from '../Input/Input';
import ButtonPill from '../Buttons/ButtonPill/ButtonPill';
// Utility Functions
import { getChallengeMonthAndYear } from '@/utils/monthlyChallengeHelpers';
// Firebase
import { database } from '../../../firebaseApp';
import {child, push, get, update, ref, onValue} from 'firebase/database'

interface DailyPointsInputProps {
    userID: any,
}

export default function DailyPointsInput({userID}: DailyPointsInputProps) {
    const [cardio, setCardio] = useState<number | ''>(0);
    const [weights, setWeights] = useState<number | ''>(0);
    const [challengeMonth, setChallengeMonth] = useState(getChallengeMonthAndYear)
 
    const updatePoints = async () => {
        try {
          const userRef = ref(database, `users/${userID}/challenges/${challengeMonth}`);
          const userSnapshot = await get(userRef);
    
          if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            // get the current cardio and weights points
            const currentCardioPoints = parseInt(userData.cardioPoints);
            const currentWeightsPoints = parseInt(userData.weightsPoints);
            // calculate new points based on the current data and the values in the input state
            const newCardioPoints = currentCardioPoints + (parseInt(cardio as string));
            const newWeightsPoints = currentWeightsPoints + (parseInt(weights as string));
            // object with the updated data
            const updatedData = {
              cardioPoints: newCardioPoints,
              weightsPoints: newWeightsPoints,
              totalPoints: newCardioPoints + newWeightsPoints
            };

            const updatedOverallPointsData = {
                totalCardio: newCardioPoints,
                totalWeights: newWeightsPoints,
                totalPoints: newCardioPoints + newWeightsPoints
            }
    
            // Update the user's data in the database
            update(ref(database, `users/${userID}/challenges/${challengeMonth}`), updatedData);
            update(ref(database, `users/${userID}/totalPointsOverall`), updatedOverallPointsData);

            setCardio(0);
            setWeights(0);
          }
        } catch (error) {
          console.error('Error updating points:', error);
        }
      }

  return (
    <div className={styles.daily_points_input}>
        <div className={styles.input}>
            <h5 className={styles.input_category}>Cardio</h5>
            <div className={styles.input_width_wrapper}>
                <Input 
                    name=''
                    value={cardio}
                    type='number'
                    onChange={(e) => setCardio(e)}
                    theme='light'
                />
            </div>
        </div>
        <div className={styles.input}>
            <h5 className={styles.input_category}>Weights</h5>
            <div className={styles.input_width_wrapper}>
                <Input 
                    name=''
                    value={weights}
                    type='number'
                    onChange={(e) => setWeights(e)}
                    theme='light'
                />
            </div>
        </div>
        <div className={styles.button_width_wrapper}>
            <ButtonPill 
                label='Submit'
                isLoading={false}
                secondary={true}
                onClick={updatePoints}
            />
        </div>
    </div>
  )
}


/*
    const updateUserPoints = (uid: string, challengeMonth: any) => {
        const newPoints = {
        weightsPoints: weights,
        cardioPoints: cardio
        }

        const newPointsKey = push(child(ref(database), 'users')).key;

        // this updates at both "users" & "challenges"
        const updates: { [key: string]: any } = {};
        updates['/users/' + uid + newPointsKey] = newPoints;
        updates['/challenges/' + newPointsKey] = newPoints;
        return update(ref(database), updates);
    }


*/