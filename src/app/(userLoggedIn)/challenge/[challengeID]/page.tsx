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
// Custom Hooks
import { useFetchUserData } from '@/hooks/useFetchUserData'
// External Libraries
import Lottie from 'lottie-react';
import animationData from '../../../../assets/ff-dumbbell-animation.json'
import animationDataWinner from '../../../../assets/ff-chall-winner.json'

interface urlParamsProps {
  params: any
}

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
  // custom hook
  const { userData } = useFetchUserData();
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
        // update the state to reflect whether the logged-in user is a participant
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
            // sort participants by total points before setting the state
            const sortedParticipants = participantsData.sort((a: any, b: any) => {
              const totalPointsA = a.cardioPoints + a.weightsPoints;
              const totalPointsB = b.cardioPoints + b.weightsPoints;
              return totalPointsB - totalPointsA; 
            });

            // update state with sorted data of participants
            setParticipantsInfo(sortedParticipants);
        });

        // update isChallengeActive and challengeWinner based on the challenge data
        setIsChallengeActive(data.status === 'active');
        setChallengeWinner(data.challengeWinnerUsername || 'unknown'); 
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
      const challengeRef = ref(database, `challenges/${params.challengeID}`);
      await remove(challengeRef);
  
      setIsChallengeActive(false);
      setIsDeleteConfirmationVisible(false);
      router.replace('/challenges-dashboard');
  
      // decrease the user's challengesCreatedLimit by the number of challenges deleted
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
          <div className={styles.header_container}>
            <div className={styles.animation}>
              <Lottie animationData={animationData} loop={false} />
            </div>
            <h2 className={styles.challenge_name}> {challengeData?.name}  </h2>
            <div className={styles.animation}>
              <Lottie animationData={animationData} loop={false}/>
            </div>
          </div>
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
              <div className={styles.not_participant_container}>
                <h5 className={styles.not_participant_text}> You are not a participant of this challenge.</h5>
                <a 
                    className={styles.request_to_join_button} 
                    href={`mailto:${challengeData?.creatorEmail}?subject=User%20${userData?.userName + ' is requesting to join your FitFriends challenge: ' + challengeData?.name}.&body=Hello%2C%20${challengeData?.creatorName}%2C%0D%0A%0D%0A${userData?.userName + ' is requesting to join your challenge: ' + challengeData?.name}.%0D%0A%0D%0APlease invite them to your challenge: ${'https://fitfriends.ca/challenge/' + params.challengeID}%0D%0A%0D%0AThank you,%0D%0AFitFriends`} 
                    target="_blank"
                >
                    Request to Join Challenge
                </a>


              </div>
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
                    {participantsInfo.map((user: any, index) => (
                      <ParticipantCard
                        key={user.uid}
                        index={index}
                        userId={user.uid}
                        firstName={user.firstName}
                        lastName={user.lastName}
                        profilePicture={user.profilePicture ? user.profilePicture : defaultUser}
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
        <>
          {challengeWinner ? (
            <div className={styles.inactive_challenge_container}> 
              <div className={styles.inactive_challenge_announcement_wrapper}>
                <div className={styles.animation_winner}>
                  <Lottie animationData={animationDataWinner} loop={false} />
                </div>
                <div className={styles.animation_winner_text}>
                  <h2> Challenge complete. </h2>
                  <h2> The winner is <span className={styles.winner_text}>{challengeWinner}</span></h2>
                </div>
              </div>
              <div className={styles.inactive_challenge_participants_container}>          
                {participantsInfo.map((user: any, index) => (
                  <ParticipantCard
                    key={user.uid}
                    index={index}
                    userId={user.uid}
                    firstName={user.firstName}
                    lastName={user.lastName}
                    profilePicture={user.profilePicture ? user.profilePicture : defaultUser}
                    userName={user.userName}
                    cardio={user.cardioPoints}
                    weights={user.weightsPoints}
                    total={user.cardioPoints + user.weightsPoints}
                  />
                ))}  
              </div> 
            </div>
          )
          : null}
        </>
      )}

      {isAddParticipantsModalOpen && 
        <ParticipantsModal 
          onClose={toggleAddParticipantsModal}
          challengeId={params.challengeID} 
          existingUsers={participantsInfo}
        />
        }
    </section>
  )
}

