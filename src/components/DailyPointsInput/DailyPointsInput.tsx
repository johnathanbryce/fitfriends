'use client'
import React, {useState} from 'react';
import styles from './DailyPointsInput.module.css'
// Internal Components
import Input from '../Input/Input';
import ButtonPill from '../Buttons/ButtonPill/ButtonPill';
// Firebase
import { database } from '../../../firebaseApp';
import {get, update, ref} from 'firebase/database'
// Custom Hooks
import { useFetchUserData } from '@/hooks/useFetchUserData';

interface DailyPointsInputProps {
    challengeId: any,
    user: any,
}

export default function DailyPointsInput({challengeId, user}: DailyPointsInputProps) {
    const [cardio, setCardio] = useState<number | ''>(0);
    const [weights, setWeights] = useState<number | ''>(0);
    const [isConfirmActive, setIsConfirmActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // custom hook
    const { userData } = useFetchUserData();

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (e.target.value === '0') {
          e.target.value = '';
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
            e.target.value = '0';
        }
    };

    const toggleConfirmPoints = () => {
      setIsConfirmActive((prev) => !prev)
    }

    const updatePoints = async () => {
        setIsLoading(true);
        try {
          // get challenge from db
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
      
                // update the logged-in user's points in 'challenges'
                const participantRef = ref(database, `challenges/${challengeId.challengeID}/participants/${user}`);
                await update(participantRef, {
                  cardioPoints: newCardioPoints,
                  weightsPoints: newWeightsPoints,
                  totalPoints: newCardioPoints + newWeightsPoints,
                });

                // calculate new points based on the current data and input values for the user
                const currentUserRef = ref(database, `users/${userData.uid}/totalPointsOverall`);
                const currentUserSnapshot = await get(currentUserRef);
                const currentUserData = currentUserSnapshot.val() || {};

                const currentCardioPointsUser = currentUserData.totalCardio || 0;
                const currentWeightsPointsUser = currentUserData.totalWeights || 0;
                const newCardioPointsUser = currentCardioPointsUser + parseInt(cardio as string, 10);
                const newWeightsPointsUser = currentWeightsPointsUser + parseInt(weights as string, 10);

                // update the total overall points for the user in 'users'
                await update(currentUserRef, {
                  totalCardio: newCardioPointsUser,
                  totalWeights: newWeightsPointsUser,
                  totalPoints: newCardioPointsUser + newWeightsPointsUser,
                });

                setCardio(0);
                setWeights(0);
                setIsConfirmActive(false);
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
                        onFocus={handleFocus}
                        onBlur={handleBlur}
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
                        onFocus={handleFocus}
                        onBlur={handleBlur}
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
                onClick={toggleConfirmPoints}
            />
        </div>
        { isConfirmActive && (
          <div className={styles.confirm_points_container}>
            <div className={styles.confirm_text_wrapper}>
              <h6> Confirm:</h6>
              <div className={styles.points_wrapper}>
                <p> Cardio {cardio}</p>
                <p> Weights {weights}</p>
              </div>
            </div>
            <div className={styles.btn_confirm_wrapper}>
              <ButtonPill 
                  label='Submit'
                  isLoading={isLoading}
                  secondary={true}
                  onClick={updatePoints}
              />
              <ButtonPill 
                  label='Edit'
                  isLoading={isLoading}
                  onClick={toggleConfirmPoints}
              />
            </div>
          </div>
        )}
    </div>
  )
}



