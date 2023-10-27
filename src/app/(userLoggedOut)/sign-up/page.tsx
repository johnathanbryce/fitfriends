'use client'
import { useState, useEffect } from 'react'
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
// Auth
import { useAuth } from '@/context/AuthProvider'

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
  const [emailErrorMsg, setEmailErrorMsg] = useState('')
  const [passwordError, setPasswordError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  // Routing
  const router = useRouter();
  // Auth
  const { handleSignup, authError } = useAuth();

  // Use useEffect to watch for changes in authError
  useEffect(() => {
    // Reset errors to false initially
    setEmailError(false);
    setPasswordError(false);
    if (authError === 'Invalid or missing email address. Please input again.') {
      setEmailError(true);
    } else if (authError === 'Invalid or missing password') {
      setPasswordError(true);
    } else if (authError === 'This email is already registered. Please try another.') {
      setEmailError(true);
    }
  }, [authError]);

  const handleUserSignUp = async() => {
    setIsLoading(true);

    try {
      const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        profilePicture: defaultUser,
        isLoggedin: null,
        challenges: {
          
        },
       totalPointsOverall: {
          totalWeights: 0,
          totalCardio: 0,
          totalPoints: 0
       }
      };

      handleSignup(email, password, userData);
      setIsLoading(false);
      // reset errors to false 
      setEmailError(false);
      setPasswordError(false);
     /*  router.replace(`/challenges`); */
    } catch (error: any) {

    }
    // Set the appropriate error states based on the error message
    if (authError === 'Invalid or missing email address. Please input again.') {
      setEmailError(true);
    } else if (authError === 'Invalid or missing password') {
      setPasswordError(true);
    } else if (authError === 'This email is already registered. Please try another.') {
      setEmailError(true);
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
          {emailError && <p className={styles.error_text}> {authError} </p>}
          {passwordError && <p className={styles.error_text}> {authError} </p>}
          <InputForm 
            name='Your Email'
            placeholder={'Your Email'}
            value={email}
            type='email'
            onChange={(newVal) => setEmail(newVal)}
            theme='dark'
            error={emailError}
            required={true}
          />
          
          <InputForm 
            name='Password'
            placeholder={'Password'}
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
                placeholder={'First Name'}
                value={firstName}
                type='text'
                onChange={(newVal) => setFirstName(newVal)}
                theme='dark'
                required={true}
            />
            <InputForm 
                name='Last Name'
                placeholder={'Last Name'}
                value={lastName}
                type='text'
                onChange={(newVal) => setLastName(newVal)}
                theme='dark'
                required={true}
            />
        </div>
            <InputForm 
                name='User Name'
                placeholder={'Username'}
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
