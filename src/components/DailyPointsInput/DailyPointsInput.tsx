'use client'
import React, {useState, useEffect} from 'react';
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
    // each challenges individual point metrics state
    const [pointMetrics, setPointMetrics] = useState<any>([]);
    // input values per point metric
    const [inputValues, setInputValues] = useState<any>({});

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

    const handleMetricChange = (metricName: any, newValue: any) => {
      setInputValues({
          ...inputValues,
          [metricName]: newValue
      });
  };

    // fetches challenge pointMetrics and sets into state
    useEffect(() => {
      const fetchChallengeData = async () => {
          const challengeRef = ref(database, `challenges/${challengeId.challengeID}`);
          const challengeSnapshot = await get(challengeRef);
          if (challengeSnapshot.exists()) {
              const challengeData = challengeSnapshot.val();
              // convert pointMetrics object to an array to then iterate over in JSX below
              const metricsArray = challengeData.pointMetrics ? Object.keys(challengeData.pointMetrics).map(key => {
                return {
                    id: key,
                    ...challengeData.pointMetrics[key]
                };
            }) : [];
            // point metrics specific to each challenge 
            setPointMetrics(metricsArray);
            setInputValues(metricsArray.reduce((acc, metric) => {
              acc[metric.name] = ''; // Initialize input value for each metric
              return acc;
          }, {}));
          }
      };
  
      fetchChallengeData();
  }, [challengeId]);

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
                const participantRef = ref(database, `challenges/${challengeId.challengeID}/participants/${user}`);
                let totalPoints = participant.totalPoints || 0;
                const participantMetrics: any = {};
                
            
                pointMetrics.forEach((metric: any, index: any) => {
                  const metricKey = `metric${index + 1}`;
                  const currentScore = participant.pointMetricsUser[metricKey]?.score || 0;
                  const inputScore = parseInt(inputValues[metric.name], 10);

                  if (!isNaN(inputScore)) {
                      const newScore = currentScore + inputScore;
                      // pushes each individual pointMetric to participantMetrics at the appropriate database route `pointMetricsUser/${metricKey}/score`
                      participantMetrics[`pointMetricsUser/${metricKey}/score`] = newScore;
                      totalPoints += inputScore; 
                  }
              });

                // add the updated total points along with metric scores to participantMetrics { }
                participantMetrics['totalPoints'] = totalPoints;

                // NOTE: this adds the participantMetrics { } which includes each metric (from .forEach above) as well as the totalPoints from participantMetrics['totalPoints'] = totalPoints;
                await update(participantRef, participantMetrics);
                setInputValues(Object.keys(inputValues).reduce((acc, key) => ({...acc, [key]: '0'}), {}));
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
          {pointMetrics.map((metric: any, index: any) => (
            <div key={index} className={styles.input}>
                <h5 className={styles.input_category}>{metric.name}</h5>
                <div className={styles.input_width_wrapper}>
                    <Input 
                        name={metric.name}
                        value={inputValues[metric.name] || 0}
                        type='number'
                        onChange={(e) => handleMetricChange(metric.name, e)}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        theme='light'
                    />
                </div>
            </div>
          ))}
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



