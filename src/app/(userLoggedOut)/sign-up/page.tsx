'use client'
import { useState } from 'react'
import styles from './SignUp.module.css'
// Internal Components
import AuthCard from '@/components/Cards/AuthCard/AuthCard'
import InputForm from '@/components/Input/Input'
import ButtonPill from '@/components/Buttons/ButtonPill/ButtonPill'
// Internal Assets
import defaultUser from '../../../../public/images/default-user-img.png'
// Next.js
import { useRouter } from 'next/navigation';
// Firebase Auth
import { createUserWithEmailAndPassword } from 'firebase/auth';
// Firebase
import { database, auth } from '../../../../firebaseApp'
import {set, ref} from 'firebase/database'
// Utility Functions
import { getChallengeMonthAndYear } from '@/utils/monthlyChallengeHelpers'

export default function SignUp() {
  // User input state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [userName, setUserName] = useState('')
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  // Error state variables
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  // Routing
  const router = useRouter();

  const handleUserSignUp = async() => {
    setIsLoading(true);
    // resets errors to false
    setUsernameError(false);
    setEmailError(false); 
    setPasswordError(false); 
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const challengeMonthAndYear = getChallengeMonthAndYear();

      const userData = {
        uid: user.uid,
        email: user.email,
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        profilePicture: defaultUser,
        challenges: {
          [challengeMonthAndYear]: {
            cardioPoints: 0,
            weightsPoints: 0,
            totalPoints: 0
          }
        },
       totalPointsOverall: {
          totalWeights: 0,
          totalCardio: 0,
          totalPoints: 0
       }
      };

      const userRef = ref(database, `users/${user.uid}`);
      await set(userRef, userData);

      setIsLoading(false);
      router.replace(`/dashboard/${user.uid}`);
    } catch (error: any) {
      console.error('Error creating user:', error);
      if (error.code === 'auth/invalid-email' || error.code === 'auth/missing-email') {
        setEmailError(true);
      } else if (error.code === 'auth/weak-password' || error.code === 'auth/missing-password') {
        setPasswordError(true);
      } 
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.login}>
      <AuthCard 
        title='Create Your Account' 
        subSection="Forgot your password?" 
        isLoading={isLoading}
      >
         <p>Join the fitness challenge, conquer your goals, and seize the glory as you compete against friends to become the reigning fitness champion of the month</p>
          {emailError && <p className={styles.error_text}>Invalid email address. </p>}
          <InputForm 
            name='Your Email'
            value={email}
            type='email'
            onChange={(newVal) => setEmail(newVal)}
            theme='dark'
            error={emailError}
            required={true}
          />
          {passwordError && <p className={styles.error_text}> Your password must be at least 6 characters long. </p>}
          <InputForm 
            name='Password'
            value={password}
            type='password'
            onChange={(newVal) => setPassword(newVal)}
            theme='dark'
            error={passwordError}
            required={true}
          /> 
         
          <div className={styles.user_name_wrapper}>
            <InputForm 
                name='First Name'
                value={firstName}
                type='text'
                onChange={(newVal) => setFirstName(newVal)}
                theme='dark'
                required={true}
            />
            <InputForm 
                name='Last Name'
                value={lastName}
                type='text'
                onChange={(newVal) => setLastName(newVal)}
                theme='dark'
                required={true}
            />
        </div>
            <InputForm 
                name='User Name'
                value={userName}
                type='text'
                onChange={(newVal) => setUserName(newVal)}
                theme='dark'
                required={true}
            />
          <ButtonPill 
            label="Submit"
            onClick={handleUserSignUp}
            isLoading={isLoading}
          />
      </AuthCard>   
    </section>
  )
}
