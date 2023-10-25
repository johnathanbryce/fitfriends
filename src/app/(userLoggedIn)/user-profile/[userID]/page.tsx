'use client'
import React, {useEffect, useState} from 'react'
import styles from './user-profile.module.css'
// Next.js
import Image from 'next/image';
import Link from 'next/link';
// Firebase
import { database } from '../../../../../firebaseApp';
import { ref, get, push } from 'firebase/database';
// Auth Context
import { useAuth } from '@/context/AuthProvider'
// Loading
import Loading from '@/app/loading';
// External Libraries 
import {LuLogOut} from 'react-icons/lu'
import {AiOutlineEdit} from 'react-icons/ai'
import {IoIosArrowBack} from 'react-icons/io'

import { getCurrentMonthAndYear } from '@/utils/dateHelpers';

export default function UserProfile() {

  /////////
async function addNewChallenge() {
  // get refs to "users" & "challenges" main data buckets in db
  console.log('run')
  const challengesRef = ref(database, `challenges`);
  const usersRef = ref(database, 'users');

  // gets a snapshot of all users in 'users'
  const usersSnapshot = await get(usersRef);

  // participants object to be added to each monthly challenge
  const participants: any = {};

  usersSnapshot.forEach((userSnapshot) => {
    const userData = userSnapshot.val();
    if (userData) {
      // participant object to be added to "participants" for each monthly challenge
      const participant = {
        cardioPoints: 0,
        weightsPoints: 0,
        totalPoints: 0,
      };
      // add the participant to the participants object with the user's ID as the key
      participants[userSnapshot.key] = participant;
    } 
  });

  // get the current month and year to set the name of the challenge
  const currMonthAndYear = getCurrentMonthAndYear();

  try {
    const newChallenge = {
      name: currMonthAndYear,
      participants: participants
    };

    // Push the new challenge to the 'challenges' node
    push(challengesRef, newChallenge);
  } catch (error) {
    console.error("Error adding a new challenge:", error);
  }
}

useEffect(() => {
  addNewChallenge();
}, [])




////////////

  const [userData, setUserData] = useState<any>();
  const [isLoading, setIsLoading] = useState(false)

  // auth context
  const { user, handleLogout } = useAuth();

  // updates and display's user information based on user.uid
  useEffect(() => {
    setIsLoading(true)
    if (user) {
      // Define the reference to the user's data in the database using their uid
      const userRef = ref(database, `users/${user.uid}`);

      // Fetch the user's data from the database
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            // If the user's data exists, set it in the state
            const userData = snapshot.val();
            setUserData(userData);
            setIsLoading(false)
          } else {
            // Handle the case where the user's data does not exist
            console.log('User data not found in the database');
          }
        })
        .catch((error) => {
          // Handle any errors that occur during the data retrieval
          console.error('Error fetching user data:', error);
        });
    }
  }, [user]);

  if(isLoading){
    return <Loading />
  }

  return (
    <section className={styles.user_profile}>
        {userData ? (
          <>
            <div className={styles.return_container}>
              <Link href={`/dashboard/${user?.uid}`}> 
                <IoIosArrowBack className={styles.back_arrow}/> 
                <p> return to dashboard </p>
              </Link>
            </div>
            <div className={styles.user_main_overview}>
                <Image src={userData.profilePicture.src} width={100} height={100} className={styles.profile_pic} alt='Your profile picture' />
                <h4>{userData.firstName} {userData.lastName}</h4>
                <p> &quot;{userData.userName}&quot; </p>
                <h5> Overall points {userData.totalPointsOverall.totalPoints}</h5>
            </div>
            <div className={styles.user_details_section}>
                <p> {userData.email} </p>
            </div>
            <div className={styles.user_details_section}>
               <button>
                <p> Edit Profile </p>
                <AiOutlineEdit className={styles.icon} />
               </button>
            </div>
            <div className={styles.user_details_section}>
                <button onClick={handleLogout}>
                    <p> Log Out </p>
                    <LuLogOut className={styles.icon} />
                </button>
            </div>
          </>
        ) : (
          <p>User data not available</p>
        )}
    </section>
  )
}
