'use client'
import {useState, useEffect} from 'react'
import styles from './dashboard.module.css'
// Next.js
import { useRouter } from 'next/navigation'
// Internal Components
import DailyPointsInput from '@/components/DailyPointsInput/DailyPointsInput'
import LeaderboardCard from '@/components/Cards/LeaderboardCard/LeaderboardCard'
import ParticipantCard from '@/components/Cards/ParticipantCard/ParticipantCard'
import ButtonPill from '@/components/Buttons/ButtonPill/ButtonPill'
// Internal Assets
import defaultUser from '../../../../../public/images/default-user-img.png'
// Firebase
import { database } from '../../../../../firebaseApp'
import {ref, onValue, get, remove, set} from 'firebase/database'
// Auth Context
import { useAuth } from '@/context/AuthProvider'
// Util
import { formatDateForChallenges } from '@/utils/dateHelpers'

interface urlParamsProps {
  params: any
}

export default function Dashboard({params}: urlParamsProps) {
  const [challengeData, setChallengeData] = useState<any>()
  const [participantsInfo, setParticipantsInfo] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteButtonVisible, setIsDeleteButtonVisible] = useState(false)
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);
  const [isLeaveConfirmationVisible, setIsLeaveConfirmationVisible] = useState(false);
  const [isChallengeActive, setIsChallengeActive] = useState(true)

  // auth context
  const { user } = useAuth();
  // routing
  const router = useRouter();

  useEffect(() => {
    const confirmUserCreatedChallenge = () => {
      const challengeRef = ref(database, `challenges/${params.challengeID}`);
      // fetch the challenge data
      get(challengeRef)
        .then((challengeSnapshot) => {
          if (challengeSnapshot.exists()) {
            const challengeData = challengeSnapshot.val();    
            // check if the current user is the creator to show or hide delete btn
            if (challengeData.creator === user?.uid) {
              setIsDeleteButtonVisible(true)
            } else {
              setIsDeleteButtonVisible(false);
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching challenge data:', error);
        });
    };

    confirmUserCreatedChallenge();
  }, [])
  
  const addAllActiveUsersToChallenge = () => {
    const challengeRef = ref(database, `challenges/${params.challengeID}`);

    onValue(challengeRef, (snapshot) => {
      const data = snapshot.val();
      setChallengeData(data)
  
      if (data.participants) {
        const participantIds = Object.keys(data.participants);
  
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
      }
    });
  }

  // TODO: create a function which adds/invites participants individually
  const addParticipants = () => {
    const challengeRef = ref(database, `challenges/${params.challengeID}`);
  }

  const confirmDeleteChallenge = () => {
    setIsDeleteConfirmationVisible((prev) => !prev)
  }

  const confirmLeaveChallenge = () => {
    setIsLeaveConfirmationVisible((prev) => !prev)
  }

  const deleteChallenge = () => {
    const challengeRef = ref(database, `challenges/${params.challengeID}`);
      remove(challengeRef)
      .then(() => {
        setIsChallengeActive(false);
        setIsDeleteConfirmationVisible(false); 
        router.replace('/challenges-dashboard')
      })
      .catch((error) => {
        // Handle errors
        setIsChallengeActive(true);
        console.error('Error deleting challenge:', error);
      });
  }

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
  

  //TODO: remove this when invite participants logic is live
  useEffect(() => {
    addAllActiveUsersToChallenge();
  }, [params.challengeID]);

  return (
    <section className={styles.dashboard}>
      {isChallengeActive ? (
        <>
          <h2 className={styles.challenge_name}> {challengeData?.name}  </h2>
          <div className={styles.challenge_overview}>
            <p> Review this challenge&apos;s rules and take note of the start and end dates: </p>
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
            <h3> Points Input  </h3>
            <DailyPointsInput 
              challengeId={params} 
              user={user?.uid}   
            />
          </div>

          <div className={styles.dashboard_section}>
            <div className={styles.subheader_container}>
              <h3> Participants </h3>
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
                    <p> There are no active users for this challenge. Invite participants to this challenge! </p>
                  </div>
              )}
            </div>

            <div className={styles.btns_container}>
            {isLeaveConfirmationVisible ? (
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
                      onClick={confirmLeaveChallenge}
                    />
                  </div>
                </div>
              ) : (
                <>
                  {participantsInfo.length > 0 &&  
                    <ButtonPill 
                      label={'Leave this challenge'}
                      isLoading={isLoading}
                      onClick={confirmLeaveChallenge}
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
                      onClick={confirmDeleteChallenge}
                    />
                  </div>
                </div>
              ) : (
                <>
                  {isDeleteButtonVisible && participantsInfo.length > 0 && 
                    <ButtonPill 
                      label={'Delete this challenge'}
                      isLoading={isLoading}
                      onClick={confirmDeleteChallenge}
                    />
                  }
                </>
              )}
            </div>
          </div>
        </>
      ): (
        <h3 className={styles.inactive_challenge_msg}> This challenge is no longer active.</h3>
      )}

    </section>
  )
}

