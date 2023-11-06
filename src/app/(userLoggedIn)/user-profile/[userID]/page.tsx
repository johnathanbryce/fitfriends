'use client'
import React, {useEffect, useState} from 'react'
import styles from './user-profile.module.css'
// Next.js
import Image from 'next/image';
import Link from 'next/link';
// Custom Hooks
import { useFetchUserData } from '@/hooks/useFetchUserData';
// Auth Context
import { useAuth } from '@/context/AuthProvider'
// Components
import ImageFileUploadButton from '@/components/ImageFileUploadButton/ImageFileUploadButton';
import Loading from '@/app/loading';
// External Libraries 
import {LuLogOut} from 'react-icons/lu'
import {AiOutlineEdit} from 'react-icons/ai'
import {IoIosArrowBack} from 'react-icons/io'
import {GoPerson} from 'react-icons/go'

export default function UserProfile() {
  const [profilePic, setProfilePic] = useState(null)
  // auth context
  const { handleLogout } = useAuth();
  // custom hook
  const {userData, isLoading} = useFetchUserData()

  const handleFileChange = (file: any) => {
    setProfilePic(file);
  };

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
                <p> challenges dashboard </p>
              </Link>
            </div>
            <div className={styles.user_main_overview}>
                {profilePic ? (
                    <Image
                      src={URL.createObjectURL(profilePic)}
                      width={100}
                      height={100}
                      className={styles.profile_pic}
                      alt='Your profile picture'
                    />
                  ) : (
                    // default backup
                    <GoPerson className={styles.profile_pic} />
                )}
                {/* <ImageFileUploadButton onFileChange={handleFileChange} /> */}
                <h3>{userData.firstName} {userData.lastName}</h3>
                <p> &quot;{userData.userName}&quot; </p>
                <h5> Total Points</h5>
                <div className={styles.points_container}>
                  <p> Cardio {userData.totalPointsOverall.totalCardio}</p>
                  <h5>Overall {userData.totalPointsOverall.totalPoints}</h5>
                  <p> Weights {userData.totalPointsOverall.totalWeights}</p>
                </div>

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
