'use client'
import React, {useState, useEffect} from 'react';
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
    challengeId: any,
    user: any,
}

export default function DailyPointsInput({challengeId, user}: DailyPointsInputProps) {
    const [cardio, setCardio] = useState<number | ''>(0);
    const [weights, setWeights] = useState<number | ''>(0);
    const [isLoading, setIsLoading] = useState(false);

    const updatePoints = async () => {
        setIsLoading(true);
        try {
          const challengeRef = ref(database, `challenges/${challengeId.challengeID}`);
          const challengeSnapshot = await get(challengeRef);
      
          if (challengeSnapshot.exists()) {
            const challengeData = challengeSnapshot.val();
            // update the points for the logged-in user
            if (challengeData.participants && user) {
              const participant = challengeData.participants[user];
      
              if (participant) {
                // calculate new points based on the current data and input values
                const currentCardioPoints = participant.cardioPoints || 0;
                const currentWeightsPoints = participant.weightsPoints || 0;
                const newCardioPoints = currentCardioPoints + parseInt(cardio as string, 10);
                const newWeightsPoints = currentWeightsPoints + parseInt(weights as string, 10);
      
                // Update the logged-in user's points
                const participantRef = ref(database, `challenges/${challengeId.challengeID}/participants/${user}`);
                await update(participantRef, {
                  cardioPoints: newCardioPoints,
                  weightsPoints: newWeightsPoints,
                  totalPoints: newCardioPoints + newWeightsPoints,
                });
      
                setCardio(0);
                setWeights(0);
              }
            }
          }
        } catch (error) {
          console.error('Error updating points:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
  return (
    <div className={styles.daily_points_input}>
        <div className={styles.inputs_container}>
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
        </div>
        <div className={styles.button_width_wrapper}>
            <ButtonPill 
                label='Submit'
                isLoading={isLoading}
                secondary={true}
                onClick={updatePoints}
            />
        </div>
    </div>
  )
}



