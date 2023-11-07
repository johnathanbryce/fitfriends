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
}

export default function ParticipantsModal({onClose}: ParticipantsModalProps) {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorFetch, setErrorFetch] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);

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
                <h2>Users</h2>
                <table className={styles.table_container}>
                    <thead>
                        <tr>
                            <th>Rank </th>
                            <th>Username </th>
                            <th>Total Wins</th>
                            <th>Invite</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                            <td colSpan={3}>
                                <Loading />
                            </td>
                            </tr>
                        ) : (
                            users?.map((user: any, index: number) => (
                            <tr key={user.uid}>
                                <td>{`${index + 1}.`}</td>
                                <td className={styles.username_cell}>
                                    {user.userName}
                                </td>
                                <td>{user.challengesWon}</td>
                                <td onClick={() => toggleInviteSelection(user.uid)}>
                                    <AiOutlineUserAdd
                                        className={`${styles.icon} ${
                                            selectedUsers.includes(user.uid) ? styles.selected : ''
                                        }`}
                                    />
                                </td>
                            </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <ButtonPill 
                    label="Add Participants"
                    onClick={handleAddParticipants}
                    isLoading={isLoading}
                />
            </div>
        )}  
    </div>
  )
}
