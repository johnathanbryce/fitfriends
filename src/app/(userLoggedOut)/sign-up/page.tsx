'use client'
import { useState, useEffect } from 'react'
import styles from './SignUp.module.css'
// Internal Components
import AuthCard from '@/components/Cards/AuthCard/AuthCard'
import InputForm from '@/components/Input/Input'
import ButtonPill from '@/components/Buttons/ButtonPill/ButtonPill'
// Internal Assets
import defaultUser from '../../../../public/images/default-user-img.png'
// Auth
import { useAuth } from '@/context/AuthProvider'
// Util Functions
import { capitalizeFirstLetter } from '@/utils/stringHelpers'
// Custom Hook
import useAuthenticationRedirect from '@/hooks/useAuthenticationRedirect';

export default function SignUp() {
  // User input state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [userName, setUserName] = useState('')
  // Error state variables
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  // Custom hook
  useAuthenticationRedirect('/sign-up', 'challenges-dashboard');
  // Auth
  const { handleSignup, authError, isLoading } = useAuth();

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

  const handleUserSignUp = async(e: any) => {
    e.preventDefault();
    try {
      const userData = {
        email: email,
        firstName: capitalizeFirstLetter(firstName),
        lastName: capitalizeFirstLetter(lastName),
        userName: userName,
        profilePicture: defaultUser,
        isLoggedin: null,
        challenges: {
          
        },
        challengesCreatedLimit: 0,
        totalPointsOverall: {
          totalWeights: 0,
          totalCardio: 0,
          totalPoints: 0
       }
      };

      handleSignup(email, password, userData);
      // reset errors to false 
      setEmailError(false);
      setPasswordError(false);
    } catch (error: any) {

    }
    
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
        navigateTo='/login'
        subSection="Already have an account?" 
        isLoading={isLoading}
      >
         <p className={styles.headline}>Create or join a fitness challenge, conquer goals, and become the reigning champion amongst your friends!</p>
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
                maxLength={15}
            />
            <InputForm 
                name='Last Name'
                placeholder={'Last Name'}
                value={lastName}
                type='text'
                onChange={(newVal) => setLastName(newVal)}
                theme='dark'
                required={true}
                maxLength={15}
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
                maxLength={15}
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
