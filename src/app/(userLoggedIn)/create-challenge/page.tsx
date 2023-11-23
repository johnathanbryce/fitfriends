'use client'
import React, {useState} from 'react'
import styles from './create-challenge.module.css'
// Next.js
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Internal Components
import PointMetric from '@/components/PointMetric/PointMetric';
import Input from '@/components/Input/Input';
import ButtonPill from '@/components/Buttons/ButtonPill/ButtonPill';
import Loading from '@/app/loading';
// Firebase
import { database } from '../../../../firebaseApp';
import { ref, get, push, set, update} from 'firebase/database';
// Custom Hooks
import { useFetchUserData } from '@/hooks/useFetchUserData';
// Util
import { formatDateForChallenges } from '@/utils/dateHelpers'
// External Libraries
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import {IoIosArrowBack, IoIosArrowForward} from 'react-icons/io'
import { FaCirclePlus } from "react-icons/fa6";

export default function CreateChallenge() {
    const [challengeName, setChallengeName] = useState('');
    // pointMetric state
    const [pointMetrics, setPointMetrics] = useState([{ name: '', value: '', duration: '', durationOption: '', intensity: '' }]);
    // challenge creation limit per user flag
    const [limitExceeded, setLimitExceeded] = useState(false);
    // alert state for required inputs
    const [requiredInputAlert, setRequiredInputAlert] = useState('')
    // state for controlling active sections of create challenge
    const [activeSection, setActiveSection] = useState(0);
    // react-date-range state
    const [selection, setSelection] = useState<any>([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      },
    ]);
    // react-date-range fn
    const handleSelect = async (ranges: any) => {
      setSelection([ranges.selection]);
    };

    // maximum allowable challenges cap
    const maxChallenges = 3
    // router
    const router = useRouter();
    // custom hook
    const {userData, isLoading} = useFetchUserData();

    const sections = [
      "challenge_name",
      "challenge_rules",
      "challenge_duration",
      "challenge_summary"
    ];

    // controls to handle each section
    const handlePrevSection = () => {
      setRequiredInputAlert(''); //reset so the error message doesn't persist
      setActiveSection((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    };

    const handleNextSection = () => {
      setRequiredInputAlert(''); //reset so the error message doesn't persist
      // for case 2 to ensure that challenges startDate are not created in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      // cases per section
      switch (activeSection) {
        case 0:
          if (!challengeName) {
            setRequiredInputAlert('Please enter a challenge name.');
            return;
          }
          break;
    
        case 1:
          const allMetricsFilled = pointMetrics.every(metric => 
              metric.name && metric.value && metric.duration /* && metric.durationOption */
          );
      
          if (!allMetricsFilled) {
              setRequiredInputAlert('Please complete all fields in the challenge rules.');
              return;
          }
          break;
    
        case 2:
          if (!selection[0].startDate) {
            setRequiredInputAlert('Please select your challenge duration.');
            return;
          }
          if (selection[0].startDate < today) {
            setRequiredInputAlert('The start date cannot be in the past.');
            return;
          }
          break;
    
        default:
          break;
      }
    
      // Move to the next section if all validations pass
      setActiveSection((prevIndex) => (prevIndex < sections.length - 1 ? prevIndex + 1 : prevIndex));
    };

    async function addNewChallenge(e: any) {
      e.preventDefault();
      // get refs to "users" & "challenges" main data buckets in db
      const challengesRef = ref(database, `challenges`);
      // get the user ref to check and increase challengesCreatedLimit
      const userRef = ref(database, `users/${userData?.uid}`);
    
      try {
        // fetches a snapshot the user
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists()) {
          const userUpdateData = userSnapshot.val(); 
          
          // check if the user has exceeded the limit
          if (userUpdateData.challengesCreatedLimit >= maxChallenges) {
            console.log('Too many challenges');
            setLimitExceeded(true);
            return;
          }
          
          // update challengesCreatedLimit in user data
          const updatedChallengesCreatedLimit = parseInt(userUpdateData.challengesCreatedLimit + 1);
          await update(userRef, {
            challengesCreatedLimit: updatedChallengesCreatedLimit
          });
        } else {
          console.log('User data not found in the database');
          return;
        }
  
        // create the new challenge data to send to db
        const newChallenge: any = {
          id: '',
          creator: userData?.uid,
          creatorEmail: userData?.email,
          creatorName: userData?.userName || 'unknown user',
          name: challengeName,
          participants: {
            [userData?.uid]: {  
              name: userData?.firstName + ' ' + userData?.lastName[0],
              username: userData?.userName || 'unknown user',
              // Dynamically create initial scores for each point metric
              pointMetricsUser: pointMetrics.reduce((acc: any, metric, index) => {
                acc[`metric${index + 1}`] = {
                  name: metric.name,
                  score: 0,  // Initial score for each metric
                };
                return acc;
              }, {}),
              totalPoints: 0    
            }
          },
          pointMetrics: pointMetrics.reduce((acc: any, metric, index) => {
            acc[`metric${index + 1}`] = {
                name: metric.name,
                value: metric.value,
                duration: metric.duration,
                durationOption: metric.durationOption,
                intensity: metric.intensity
            };
            return acc;
          }, {}),
          challengeWinner: '',
          status: 'active',
          challengeDuration: {
            starts: selection[0].startDate.getTime(), // Store start date as a number
            ends: selection[0].endDate.getTime(),     // Store end date as a number
          },
        };

        // push the new challenge to the 'challenges' node
        const newChallengeRef = push(challengesRef, newChallenge);
        // get the generated ID from the reference
        const newChallengeId = newChallengeRef.key;
        // update the 'id' field in the newChallenge object with the generated ID
        newChallenge.id = newChallengeId;
        // update the challenge with the generated ID
        set(newChallengeRef, newChallenge);
        // reset inputs 
        setChallengeName('');
        router.replace(`/challenge/${newChallengeId}`);
      } catch (error) {
        console.error('Error adding a new challenge:', error);
      }
    }

    const addPointMetric = () => {
      if (pointMetrics.length < 4) {
        setPointMetrics([...pointMetrics, { name: '', value: '', duration: '', durationOption: '', intensity: '' }]);
      }
    };

    const deletePointMetric = (index: any) => {
      setPointMetrics(pointMetrics.filter((_, i) => i !== index));
    }

    const updatePointMetric = (index: any, updatedMetric: any) => {
      setPointMetrics(pointMetrics.map((metric, i) => i === index ? updatedMetric : metric));
    };

    if (isLoading) {
      return <Loading />
    }

  return (
    <form className={styles.create_challenge} onSubmit={addNewChallenge}>
          { activeSection === 0 && <h2> Create Your Fitness Challenge </h2>}
          <section className={styles.create_challenge_sections_wrapper}>
            {requiredInputAlert.length > 0 && <p className={styles.warning}> {requiredInputAlert} </p>}
            {activeSection === 0 && (
              <div className={`${styles.section_container} ${styles.name_wrapper}`}>
                <h4> Name your challenge </h4>
                <Input 
                    name='challengeName'
                    placeholder=''
                    value={challengeName}
                    type='text'
                    onChange={(e) => setChallengeName(e)}
                    theme='dark'
                    required={true}
                    maxLength={30}
                />
              </div>
            )}

            {activeSection === 1 && (
              <div className={styles.section_container}>
                <h4> Create your custom point metrics </h4>
                {pointMetrics.map((metric, index) => (
                    <PointMetric
                        key={index}
                        index={index}
                        metric={metric}
                        updateMetric={(updatedMetric) => updatePointMetric(index, updatedMetric)}
                        deleteMetric={() => deletePointMetric(index)}
                    />
                ))}
                { pointMetrics.length < 4 ? <FaCirclePlus className={styles.icon_add_challenge} onClick={addPointMetric} /> : null}
              </div>
          )}

          {activeSection === 2 && (
            <div className={styles.section_container}>
              <h4> Define the duration </h4>
              <DateRange
                ranges={selection}
                onChange={handleSelect}
                className={styles.date_range_picker}
                showMonthAndYearPickers={false}
                showDateDisplay={false}
                rangeColors={['#FF5722']}
              />
            </div>
          )}

          {activeSection === 3 && (
            <div className={styles.section_container}>
              <h4> Summary </h4>
              <div className={styles.challenge_summary}>
                <h5 className={styles.summary_challenge_name}> {challengeName}</h5>
                {pointMetrics.map((metric, index) => (
                    <p key={index}> 
                      <span className={styles.bold}> Metric {index + 1}: </span> 
                      {`${metric.name} for ${metric.duration} ${metric.durationOption === '' ? 'minutes' : metric.durationOption}${metric.intensity !== 'n/a' && metric.intensity !== '' ? ` at ${metric.intensity} intensity` : ''} equals ${metric.value} point(s).`}
                    </p>
                ))}
                <div className={styles.challenge_duration_container}>
                  <p>
                    <span className={styles.bold}> Starts: </span> {selection[0].startDate ? formatDateForChallenges(selection[0].startDate) : 'Not set'}
                  </p>
                  <p>
                  <span className={styles.bold}> Ends: </span> {selection[0].endDate ? formatDateForChallenges(selection[0].endDate) : 'Not set'}
                  </p>
                </div>
              </div>

              <div className={styles.btn_and_warning_container}>
                {limitExceeded && <p className={styles.warning}> Maximum active challenges per user: {maxChallenges}. To create this challenge, please delete or finish one of your active challenges. </p>}
                <ButtonPill 
                    label="Create Challenge"
                    isLoading={false}
                    disabled={activeSection !== sections.length - 1}
                    secondary={true}  
                />
                <Link href='/challenges-dashboard' className={styles.cancel}> Cancel  </Link>
              </div>
            </div>
          )}

          {/* section controls */}
          <div className={styles.section_controls_container}>
              {activeSection === 0 ? null : 
                  <p onClick={handlePrevSection} className={`${styles.control} ${styles.control_left}`}> 
                      <IoIosArrowBack className={styles.arrow}/> 
                      Back 
                  </p>
              }
              {activeSection === sections.length - 1 ? null : 
                  <p onClick={handleNextSection} className={`${styles.control} ${styles.control_right}`}> 
                      Next
                      <IoIosArrowForward className={styles.arrow}/> 
                  </p>
              }
          </div>
        </section>
    </form>
  )
}
