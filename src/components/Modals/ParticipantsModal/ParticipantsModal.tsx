import React, {useState, useEffect} from 'react'
import styles from './ParticipantsModal.module.css'
// Internal Components
import Loading from '@/app/loading';
import ButtonPill from '@/components/Buttons/ButtonPill/ButtonPill';
// Firebase
import { database } from '../../../../firebaseApp';
import {ref, onValue, get, remove, set, update} from 'firebase/database'
// API functions
import { fetchAllUsers } from '@/api/fetchAllUsers'
// External Libraries
import {AiFillCloseCircle, AiOutlineUserAdd} from 'react-icons/ai'

interface ParticipantsModalProps{
    onClose: () => void,
    challengeId: string,
}

export default function ParticipantsModal({onClose, challengeId}: ParticipantsModalProps) {
    const [users, setUsers] = useState([]); // all of the users in the db
    const [isLoading, setIsLoading] = useState(false);
    const [errorFetch, setErrorFetch] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<any>([]);

    const toggleInviteSelection = (userId: any) => {
        setIsSelected(userId)   
        setSelectedUsers((prevSelectedUsers: any) => {
          if (prevSelectedUsers.includes(userId)) {
            // remove user if already selected
            return prevSelectedUsers.filter((user: any) => user !== userId);
          } else {
            // add user if not selected
            return [...prevSelectedUsers, userId];
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
    
      // Create an object to batch update operations
      const updates: any = {};
      selectedUsers.forEach((userId: any) => {
        // TODO: create the data schema for participants being added 
        const userData = {
          cardioPoints: 0,
          weightsPoints: 0,
          totalPoints: 0,
        }

        // Set the path for the user being added to the challenge's participants
        // This example assumes you're just setting the userID as true to indicate they are part of the challenge
        updates[`challenges/${challengeId}/participants/${userId}`] = true;
      });

/*       // TODO: adds the invite participants with this data schema: 
      usersSnapshot.forEach((userSnapshot) => {
        const userData = userSnapshot.val();
        if (userData) {
          const participant = {
            cardioPoints: 0,
            weightsPoints: 0,
            totalPoints: 0,
          };
          participants[userSnapshot.key] = participant;
        }
      }); */
    
      try {
        // Perform the batch update
        await update(ref(database), updates);
        // Optionally, you can do something here after successful update
        // For example, you can call a method to refresh the participant's list in the parent component
      } catch (error) {
        console.error('Error adding participants:', error);
        // Handle errors, e.g., by setting an error state and showing a message to the user
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
                            <div key={user.uid} onClick={() => toggleInviteSelection(user.uid)} className={`${styles.user} ${
                                selectedUsers.includes(user.uid) ? styles.selected : ''
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
