'use client'
import {useState, useEffect} from 'react'
import styles from './challenge.module.css'
// Next.js
import { useRouter } from 'next/navigation'
// Internal Components
import DailyPointsInput from '@/components/DailyPointsInput/DailyPointsInput'
import LeaderboardCard from '@/components/Cards/LeaderboardCard/LeaderboardCard'
import ParticipantsModal from '@/components/Modals/ParticipantsModal/ParticipantsModal'
import ParticipantCard from '@/components/Cards/ParticipantCard/ParticipantCard'
import ButtonPill from '@/components/Buttons/ButtonPill/ButtonPill'
// Internal Assets
import defaultUser from '../../../../../public/images/default-user-img.png'
// Firebase
import { database } from '../../../../../firebaseApp'
import {ref, onValue, get, remove, set, update} from 'firebase/database'
// Auth Context
import { useAuth } from '@/context/AuthProvider'
// Util
import { formatDateForChallenges } from '@/utils/dateHelpers'

interface urlParamsProps {
  params: any
}
/*
TODO:
- implemenet challenge duration functionality
- make sure that when a challenge ends, it gets moved to a new endpoint
  in the databse: "completedChallenges { ... } "

*/

export default function Challenge({params}: urlParamsProps) {
  const [challengeData, setChallengeData] = useState<any>()
  const [participantsInfo, setParticipantsInfo] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // state to track if a user is part of this challenge
  const [isUserAParticipant, setIsUserAParticipant] = useState(false);
  // button / modal / challenge active visibility state
  const [isAddParticipantsButtonVisible, setIsAddParticipantsButtonVisible] = useState(false)
  const [isAddParticipantsModalOpen, setIsAddParticipantsModalOpen] = useState(false)
  const [isDeleteButtonVisible, setIsDeleteButtonVisible] = useState(false)
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);
  const [isLeaveConfirmationVisible, setIsLeaveConfirmationVisible] = useState(false);
  // state for active challenge and declaring winner
  const [isChallengeActive, setIsChallengeActive] = useState(true)
  const [challengeWinner, setChallengeWinner] = useState('');

  // auth context
  const { user } = useAuth();
  // routing
  const router = useRouter();

  // checks if the user created the challenge to show or hide the
  // delete button and then add participants button
  useEffect(() => {
    const confirmUserCreatedChallenge = () => {
      const challengeRef = ref(database, `challenges/${params.challengeID}`);
      // fetch the challenge data
      get(challengeRef)
        .then((challengeSnapshot) => {
          if (challengeSnapshot.exists()) {
            const challengeData = challengeSnapshot.val();    
            // check if the current user is the creator to show or hide delete btn
            // and add participants btn
            if (challengeData.creator === user?.uid) {
              setIsDeleteButtonVisible(true);
              setIsAddParticipantsButtonVisible(true);
            } else {
              setIsDeleteButtonVisible(false);
              setIsAddParticipantsButtonVisible(false);
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching challenge data:', error);
        });
    };

    confirmUserCreatedChallenge();
  }, [])

  // fetches all the users included in the participants object in the challenge 
  // participants are invited via ParticipantsModal.tsx which houses this logic
  const fetchActiveChallengeParticipants = () => {
    const challengeRef = ref(database, `challenges/${params.challengeID}`);

    onValue(challengeRef, (snapshot) => {
      const data = snapshot.val();
      setChallengeData(data);
  
      if (data.participants) {
        const participantIds = Object.keys(data.participants);
        // Update the state to reflect whether the logged-in user is a participant
        setIsUserAParticipant(participantIds.includes(user?.uid));
        // 1. create an array to store participants info from users who in this challenge
        const participantsData: any = [];
        // 2. loop through participant IDs and fetch user data and points for each
        // remember: Promise.all() waits for all promises to resolve (takes an array of promises and returns a new Promise)
        Promise.all(participantIds.map((participantID) => {
        const userRef = ref(database, `users/${participantID}`);
  
        return get(userRef)
          .then((userSnapshot) => {
            if (userSnapshot.exists()) {
              const userData = userSnapshot.val(); // data from "users"
              const pointsData = data.participants[participantID]; // get points for this participant ** coming from "challenges" 
              const participantWithPoints = { ...userData, ...pointsData }; 
              participantsData.push(participantWithPoints);
            }
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
          });
        })).then(() => {
          // 3. push this participantsData array from above to state to then map and render
          setParticipantsInfo(participantsData);
        });

        // update isChallengeActive and challengeWinner based on the challenge data
        setIsChallengeActive(data.status === 'active');
        setChallengeWinner(data.challengeWinner || ''); 
      } else {
        setIsUserAParticipant(false);
      }
    });
  }
  // runs the fn to fetch all invited participant of this challenge
  useEffect(() => {
    fetchActiveChallengeParticipants();
  }, [params.challengeID]);

  // toggle functions
  const toggleAddParticipantsModal = () => {
    setIsAddParticipantsModalOpen((prev) => !prev)
  }
  const toggleConfirmDeleteChallenge =  () => {
    setIsDeleteConfirmationVisible((prev) => !prev)
  }

  const toggleConfirmLeaveChallnege = () => {
    setIsLeaveConfirmationVisible((prev) => !prev)
  }

  const deleteChallenge = async () => {
    try {
      // Delete the challenge
      const challengeRef = ref(database, `challenges/${params.challengeID}`);
      await remove(challengeRef);
  
      setIsChallengeActive(false);
      setIsDeleteConfirmationVisible(false);
      router.replace('/challenges-dashboard');
  
      // Decrease the user's challengesCreatedLimit by the number of challenges deleted
      const userRef = ref(database, `users/${user?.uid}`);
      const userSnapshot = await get(userRef);
      const userUpdateData = userSnapshot.val(); 
      // update challengesCreatedLimit in user data
      const updatedChallengesCreatedLimit = userUpdateData.challengesCreatedLimit - 1;
      await update(userRef, {
        challengesCreatedLimit: updatedChallengesCreatedLimit
      });
  
    } catch (error) {
      setIsChallengeActive(true);
      console.error('Error deleting challenge:', error);
    }
  };
  
  const leaveChallenge = () => {
    const challengeRef = ref(database, `challenges/${params.challengeID}`);
    get(challengeRef)
      .then((challengeSnapshot) => {
        if (challengeSnapshot.exists()) {
          const challengeData = challengeSnapshot.val();
          // check if the user is a participant in the challenge
          if (challengeData.participants && challengeData.participants[user?.uid]) {
            // removes user from participants obj
            delete challengeData.participants[user?.uid];
            // update the challenge data in the database
            set(ref(database, `challenges/${params.challengeID}`), challengeData)
              .then(() => {
                // user leaves challenge successfully
                router.replace('/challenges-dashboard')
                setIsLeaveConfirmationVisible(false); 
              })
              .catch((error) => {
                console.error('Error updating challenge data:', error);
              });
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching challenge data:', error);
      });
  };

  return (
    <section className={styles.dashboard}>
      {isChallengeActive ? (
        <>
          <h2 className={styles.challenge_name}> {challengeData?.name}  </h2>
          <div className={styles.challenge_overview}>
            <p> <b>Duration:</b> {formatDateForChallenges(challengeData?.challengeDuration.starts)} - {formatDateForChallenges(challengeData?.challengeDuration.ends)}</p>

            <div className={styles.rules}>
              <p> <b>Cardio: </b>
                  <span className={styles.rule}>
                    {challengeData ? challengeData.rules.cardioMinutes : ''} = {challengeData ? challengeData.rules.cardioPoints : ''}
                  </span>
              </p>
              <p> <b>Weights: </b>
                  <span className={styles.rule}>
                    {challengeData ? challengeData.rules.weightsMinutes : ''} = {challengeData ? challengeData.rules.weightsPoints : ''}
                  </span>
              </p>
            </div>
          </div>

          <div className={styles.dashboard_section}>
            <h3> Submit points  </h3>
            {isUserAParticipant ? (
              <DailyPointsInput 
                challengeId={params} 
                user={user?.uid}   
              />
            ) : (
              <h5 className={styles.not_participant_text}> You are not a participant of this challenge.</h5>
            )}
          </div>

          <div className={styles.dashboard_section}>
            <div className={styles.subheader_container}>
              <h3> Participants </h3>
              {isAddParticipantsButtonVisible && 
                <ButtonPill
                  label='add-users'
                  onClick={toggleAddParticipantsModal}
                  isLoading={isLoading}
                />
              }
            </div>
            <div className={styles.participants_container}>
              {participantsInfo.length > 0 ? (
                  <>
                    {participantsInfo.map((user: any) => (
                      <ParticipantCard
                        key={user.uid}
                        userId={user.uid}
                        firstName={user.firstName}
                        lastName={user.lastName}
                        profilePicture={!user.profilePicture ? defaultUser : ''}
                        userName={user.userName}
                        cardio={user.cardioPoints}
                        weights={user.weightsPoints}
                        total={user.cardioPoints + user.weightsPoints}
                      />
                    ))}
                  </>
                ) : (
                  <div className={styles.no_users}>
                    <p> There are no active users. Invite participants to this challenge! </p>
                  </div>
              )}
            </div>

            <div className={styles.btns_container}>
              {isLeaveConfirmationVisible  ? (
                  <div className={styles.delete_challenge_confirm}>
                    <p className={styles.warning}> Are you sure you want to leave this challenge? </p>
                    <div className={styles.btns_flex_wrapper}>
                      <ButtonPill 
                        label={'Yes'}
                        isLoading={isLoading}
                        onClick={leaveChallenge}
                      />
                      <ButtonPill 
                        label={'No'}
                        isLoading={isLoading}
                        onClick={toggleConfirmLeaveChallnege}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {participantsInfo.length > 0 && isUserAParticipant &&  
                      <ButtonPill 
                        label={'Leave this challenge'}
                        isLoading={isLoading}
                        onClick={toggleConfirmLeaveChallnege}
                      /> 
                    }
                  </>  
                )}
                {isDeleteConfirmationVisible ? (
                  <div className={styles.delete_challenge_confirm}>
                    <p className={styles.warning}> Are you sure you want to delete this challenge? </p>
                    <div className={styles.btns_flex_wrapper}>
                      <ButtonPill 
                        label={'Confirm'}
                        isLoading={isLoading}
                        onClick={deleteChallenge}
                      />
                      <ButtonPill 
                        label={'Decline'}
                        isLoading={isLoading}
                        onClick={toggleConfirmDeleteChallenge}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {isDeleteButtonVisible && participantsInfo.length > 0 && 
                      <ButtonPill 
                        label={'Delete this challenge'}
                        isLoading={isLoading}
                        onClick={toggleConfirmDeleteChallenge}
                      />
                    }
                  </>
                )}
            </div>
          </div>
        </>
      ): (
        <h3 className={styles.inactive_challenge_msg}> 
          {challengeWinner ? 
          `Challenge completed! The winner is ${challengeWinner}` 
          : 'This challenge is not active'}
        </h3>
      )}

      {isAddParticipantsModalOpen && 
        <ParticipantsModal 
          onClose={toggleAddParticipantsModal}
          challengeId={params.challengeID} 
          />
        }
    </section>
  )
}

