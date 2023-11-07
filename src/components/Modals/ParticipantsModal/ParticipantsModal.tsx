import React, {useState, useEffect} from 'react'
import styles from './ParticipantsModal.module.css'
// Internal Components
import Loading from '@/app/loading';
import ButtonPill from '@/components/Buttons/ButtonPill/ButtonPill';
// API functions
import { fetchAllUsers } from '@/api/fetchAllUsers'
// External Libraries
import {AiFillCloseCircle, AiOutlineUserAdd} from 'react-icons/ai'

interface ParticipantsModalProps{
    onClose: () => void,
    challengeId: string,
}

export default function ParticipantsModal({onClose, challengeId}: ParticipantsModalProps) {
    const [users, setUsers] = useState([]);
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

    const handleAddParticipants = () => {
        // challengeId -- add to database
        // You can now use the selectedUsers array for further processing
        console.log('Selected Users:', selectedUsers);
        // Add your logic here to do something with the selected users
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
