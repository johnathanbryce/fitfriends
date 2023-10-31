'use client'
import {useState, useEffect, useLayoutEffect} from 'react'
import styles from './dashboard.module.css'
// Internal Components
import DailyPointsInput from '@/components/DailyPointsInput/DailyPointsInput'
import LeaderboardCard from '@/components/Cards/LeaderboardCard/LeaderboardCard'
import ParticipantCard from '@/components/Cards/ParticipantCard/ParticipantCard'
import ButtonPill from '@/components/Buttons/ButtonPill/ButtonPill'
// Internal Assets
import defaultUser from '../../../../../public/images/default-user-img.png'
// Firebase
import { database } from '../../../../../firebaseApp'
import {ref, onValue, get} from 'firebase/database'
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

  // auth context
  const { user } = useAuth();

  const fetchParticipantsFromChallenge = () => {
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

  useEffect(() => {
    fetchParticipantsFromChallenge();
  }, [params.challengeID]);
  
  return (
    <section className={styles.dashboard}>
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
{/*           <ButtonPill 
            label='+Add Participants'
            isLoading={false}
            onClick={addParticipants}     
          /> */}
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
      </div>
    </section>
  )
}

{/*       <div className={styles.dashboard_section}>
        <h4> Leaderboard</h4>
        <div className={styles.leaderboard_container}>
          { USERS_DUMMY_LIST.map((user) => (
            <LeaderboardCard
              key={user.name} 
              category={user.category}
              name={user.name}
              points={user.points}
              img={user.img}
            />
          ))}
        </div>
      </div> */}
