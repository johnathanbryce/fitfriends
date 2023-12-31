import React, {useState, useEffect} from 'react'
import styles from './ParticipantsModal.module.css'
// Internal Components
import Loading from '@/app/loading';
import ButtonPill from '@/components/Buttons/ButtonPill/ButtonPill';
// Firebase
import { database } from '../../../../firebaseApp';
import {ref, update, get} from 'firebase/database'
// API functions
import { fetchAllUsers } from '@/api/fetchAllUsers'
// External Libraries
import {AiFillCloseCircle, AiOutlineUserAdd} from 'react-icons/ai'

interface ParticipantsModalProps{
    onClose: () => void,
    challengeId: string,
    existingUsers: any,
}

interface Metric {
  name: string,
  score: number,
}

export default function ParticipantsModal({onClose, challengeId, existingUsers}: ParticipantsModalProps) {
    const [users, setUsers] = useState([]); // all of the users in the db
    const [isLoading, setIsLoading] = useState(false);
    const [errorFetch, setErrorFetch] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<any>([]);

    const [pointMetrics, setPointMetrics] = useState<{ [key: string]: Metric }>({});

    const existingUsersArr = existingUsers.map((user: any) => user.userName);

    const toggleInviteSelection = (selectedUser: any) => {
      setIsSelected(selectedUser);
      setSelectedUsers((prevSelectedUsers: any) => {
        if (prevSelectedUsers.includes(selectedUser)) {
          // remove user if already selected
          return prevSelectedUsers.filter((user: any) => user !== selectedUser);
        } else {
           // add user if not selected
          return [...prevSelectedUsers, selectedUser];
        }
      });
    };

    useEffect(() => {
      async function getUsers() {
        setIsLoading(true)
        try {
          const fetchedUsers = await fetchAllUsers();
          // filters out users already invited to the challenge (as passed down via existingUsers)
          const filteredUsers = fetchedUsers.filter((user: any) => 
            !existingUsersArr.includes(user.userName)
          );
          // sort the users array by totalPointsOverall in descending order
          filteredUsers.sort((a: any, b: any) =>
                b.challengesWon - a.challengesWon
          );
          setUsers(filteredUsers);
          setIsLoading(false)
        } catch (error) {
          console.error('Error fetching users:', error);
          setIsLoading(false)
          setErrorFetch(true)
        }
      }
      getUsers();
      setErrorFetch(false)
    }, [existingUsers]);

    // gets the reference to the challenge in order to retrive point metrics
    useEffect(() => {
      const fetchChallengeData = async () => {
          const challengeRef = ref(database, `challenges/${challengeId}`);
          const challengeSnapshot = await get(challengeRef);
          if (challengeSnapshot.exists()) {
              const challengeData = challengeSnapshot.val();
              setPointMetrics(challengeData.pointMetrics)
          }
      };
  
      fetchChallengeData();
  }, [challengeId]);

    const handleAddParticipants = async () => {
      setIsLoading(true);
      // create an object to batch update operations
      const updates: any = {};
      selectedUsers.forEach((user: any) => {
        // define what each user's metrics will be inside challengeId/participants obj
        const userData = {
          name: user.firstName + ' ' + user.lastName[0],
          username: user.userName,
          pointMetricsUser: constructPointMetricsUser(), // run the constructor fn to add the challenges unique pointMetrics (as pointMetric1, pointMetric2, etc...)
          totalPoints: 0,
        }
        updates[`challenges/${challengeId}/participants/${user.uid}`] = userData;
      });

      try {
        // updates database with "updates" batch as constructed above
        await update(ref(database), updates); 
      } catch (error) {
        console.error('Error adding participants:', error);
        // TODO: handle errors
      }
    
      setIsLoading(false);
      onClose(); // Close the modal after the operation
    };

    // function to construct pointMetricUser object with initial scores
    const constructPointMetricsUser = () => {
        const pointMetricsUser: { [key: string]: { name: string; score: number } } = {};
        // iterate over each entry in the pointMetrics object
        Object.entries(pointMetrics).forEach(([id, metric]) => {
          pointMetricsUser[id] = { name: metric.name, score: 0 };
        });
        return pointMetricsUser;
    };
    

  return (
    <div className={styles.participants_modal}>
        <div className={styles.modal_background} onClick={onClose} />
        {isLoading ? (
            <Loading />
        ) : (
            <div className={styles.modal_content}>
                <AiFillCloseCircle className={styles.close} onClick={onClose} />
                <h2> Select users to invite </h2>
                    <div className={styles.users_container}>
                        {users?.map((user: any, index: number) => (
                            <div key={user.uid} onClick={() => toggleInviteSelection(user/* .uid */)} className={`${styles.user} ${
                                selectedUsers.includes(user/* .uid */) ? styles.selected : ''
                            }`} >
                                <p className={styles.username_cell}>
                                    {user.userName}
                                </p>
                                <AiOutlineUserAdd className={styles.icon}/>
                            </div>
                            ))
                        }
                    </div>
                <ButtonPill 
                    label="Add Selected Users"
                    onClick={handleAddParticipants}
                    isLoading={isLoading}
                />
            </div>
        )}  
    </div>
  )
}
