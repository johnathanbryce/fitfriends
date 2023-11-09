import React, {useState, useEffect} from 'react'
import styles from './ParticipantsModal.module.css'
// Internal Components
import Loading from '@/app/loading';
import ButtonPill from '@/components/Buttons/ButtonPill/ButtonPill';
// Firebase
import { database } from '../../../../firebaseApp';
import {ref, update} from 'firebase/database'
// API functions
import { fetchAllUsers } from '@/api/fetchAllUsers'
// External Libraries
import {AiFillCloseCircle, AiOutlineUserAdd} from 'react-icons/ai'

interface ParticipantsModalProps{
    onClose: () => void,
    challengeId: string,
}

// TODO: ADD THE USER WHO CREATED THE CHALLENGE TO THE CHALLENGE FROM "CREATE-CHALLENGE"

export default function ParticipantsModal({onClose, challengeId}: ParticipantsModalProps) {
    const [users, setUsers] = useState([]); // all of the users in the db
    const [isLoading, setIsLoading] = useState(false);
    const [errorFetch, setErrorFetch] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<any>([]);

    const toggleInviteSelection = (user: any) => {
        setIsSelected(user)   
        setSelectedUsers((prevSelectedUsers: any) => {
          if (prevSelectedUsers.includes(user)) {
            // remove user if already selected
            return prevSelectedUsers.filter((user: any) => user !== user);
          } else {
            // add user if not selected
            return [...prevSelectedUsers, user];
          }
        });
    };

    useEffect(() => {
      async function getUsers() {
        setIsLoading(true)
        try {
          const fetchedUsers = await fetchAllUsers();
          // sort the users array by totalPointsOverall in descending order
          fetchedUsers.sort((a: any, b: any) =>
                b.challengesWon - a.challengesWon
          );
          setUsers(fetchedUsers);
          setIsLoading(false)
        } catch (error) {
          console.error('Error fetching users:', error);
          setIsLoading(false)
          setErrorFetch(true)
        }
      }
      getUsers();
      setErrorFetch(false)
    }, []);

    const handleAddParticipants = async () => {
      setIsLoading(true);
    
      // create an object to batch update operations
      const updates: any = {};
      selectedUsers.forEach((user: any) => {
        // TODO: eventually, when I move to custom metrics, this will have to be first fetched from the db from challenge/rules
        // and then set in this object below for each user:
        
        // define what each user's metrics will be inside challengeId/participants obj
        const userData = {
          name: user.firstName + ' ' + user.lastName[0],
          username: user.userName,
          cardioPoints: 0,      // will eventually be metricPoints1
          weightsPoints: 0,     // will eventually be metricPoints2
          totalPoints: 0,
        }
        updates[`challenges/${challengeId}/participants/${user.uid}`] = userData;
      });

      try {
        // updates database with "updates" batch as constructed above
        await update(ref(database), updates); 
        // TODO: call a method to refresh the participant's list in the parent component
      } catch (error) {
        console.error('Error adding participants:', error);
        // TODO: handle errors
      }
    
      setIsLoading(false);
      onClose(); // Close the modal after the operation
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
