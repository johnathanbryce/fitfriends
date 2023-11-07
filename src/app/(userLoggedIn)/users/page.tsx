'use client'
import React, {useEffect, useState} from 'react'
import styles from './users.module.css'
// Internal Components
import Loading from '@/app/loading'
// External Libraries
import {GiPodiumWinner} from 'react-icons/gi'
// API functions
import { fetchAllUsers } from '@/api/fetchAllUsers'


export default function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorFetch, setErrorFetch] = useState(false)

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


  if (errorFetch) {
    <h2>There was an error fetching user data...</h2>
  }

  return (
    <section className={styles.users}>
      <h2>Users</h2>
      <table className={styles.table_container}>
        <thead>
          <tr>
            <th>Rank </th>
            <th>Username </th>
            <th>Name</th>
            <th>Total Wins</th>
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
            users?.map((user: any, index) => (
              <tr key={user.uid}>
                <td>{`${index + 1}.`}</td>
                <td className={styles.username_cell}>
                  {index === 0 && <GiPodiumWinner className={styles.icon} />}
                  {user.userName}
                </td>
                <td>{`${user.firstName} ${user.lastName[0]}`}</td>
                <td>{user.challengesWon}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  )
}
