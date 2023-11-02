'use client'
import React, {useEffect, useState} from 'react'
import styles from './user-profile.module.css'
// Next.js
import Image from 'next/image';
import Link from 'next/link';
// Firebase
import { database } from '../../../../../firebaseApp';
import { ref, get } from 'firebase/database';
// Auth Context
import { useAuth } from '@/context/AuthProvider'
// Loading
import Loading from '@/app/loading';
// External Libraries 
import {LuLogOut} from 'react-icons/lu'
import {AiOutlineEdit} from 'react-icons/ai'
import {IoIosArrowBack} from 'react-icons/io'

export default function UserProfile() {
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
              <Link href={`/challenges-dashboard`}> 
                <IoIosArrowBack className={styles.back_arrow}/> 
                <p> return to challenges </p>
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
