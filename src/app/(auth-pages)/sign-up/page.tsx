'use client'
import { useState, useEffect } from 'react'
import styles from './SignUp.module.css'
// Next.js
import { redirect } from 'next/navigation';
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
  const [nameError, setNameError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);

/*   // Custom hook
  useAuthenticationRedirect('/sign-up', 'challenges-dashboard'); */
  // Auth
  const { handleSignup, authError, clearAuthError, isLoading } = useAuth();

  const handleUserSignUp = (e: any) => {
    e.preventDefault();
    // reset errors
    setEmailError(false);
    setPasswordError(false);
    setNameError(false);
    setUsernameError(false);

    if(!firstName || !lastName){
      setNameError(true)  
      return;
    }

    if(!userName){ 
      setUsernameError(true) 
      return;
    }
    
    const userData = {
      email: email,
      firstName: capitalizeFirstLetter(firstName),
      lastName: capitalizeFirstLetter(lastName),
      userName: userName,
      profilePicture: defaultUser,
      isLoggedin: null,
      challengesWon: 0,
      challenges: {
        
      },
      challengesCreatedLimit: 0,
    };

    handleSignup(email, password, userData);

    if (authError === 'Invalid or missing email address. Please input again.') {
      setEmailError(true);
    } else if (authError === 'Invalid or missing password') {
      setPasswordError(true);
    } else if (authError === 'This email is already registered. Please try another.') {
      setEmailError(true);
    }

    if (!authError) {
      redirect('/email-verification'); 
    }
    // reset errors to false 
    setEmailError(false);
    setPasswordError(false);
    setNameError(false)  
    setUsernameError(false) 
  }

  // Use useEffect to watch for changes in authError
  useEffect(() => {
    if (authError) {
      if (authError === 'Invalid or missing email address. Please input again.') {
        setEmailError(true);
      } else if (authError === 'Invalid or missing password') {
        setPasswordError(true);
      } else if (authError === 'This email is already registered. Please try another.') {
        setEmailError(true);
      }
    } else {
      // Reset email and password errors if there's no authError
      setEmailError(false);
      setPasswordError(false);
      setNameError(false)  
      setUsernameError(false) 
    }
  }, [authError]);

  // when component unmounts, clear any authError's
  useEffect(() => {
    return () => {
      clearAuthError();
    };
  }, []);

  return (
    <section className={styles.login}>
      <AuthCard 
        title='Sign up for Fit Friends' 
        navigateToSubSection='/login'
        subSection="Already have an account? Log in" 
        isLoading={isLoading}
      >
          {emailError && <p className={styles.error_text}> {authError} </p>}
          {passwordError && <p className={styles.error_text}> {authError} </p>}
          {nameError && <p className={styles.error_text}> Please provide your first and last name. </p> }
          {usernameError && <p className={styles.error_text}> Please provide a username. </p> }
          
          <InputForm 
            name='Your Email'
            placeholder={'Your Email'}
            value={email}
            type='email'
            onChange={(newVal) => setEmail(newVal)}
            theme='light'
            error={emailError}
            required={true}
          />
          
          <InputForm 
            name='Password'
            placeholder={'Password'}
            value={password}
            type='password'
            onChange={(newVal) => setPassword(newVal)}
            theme='light'
            error={passwordError}
            required={true}
          /> 
         
          <div className={styles.user_name_wrapper}>
            <InputForm 
                name='First Name'
                placeholder={'First Name'}
                value={firstName}
                type='text'
                onChange={(newVal) => {
                  setFirstName(newVal);
                  if (newVal.trim() !== '') {
                    setNameError(false);
                  }
                }}
                theme='light'
                required={true}
                maxLength={15}
            />
            <InputForm 
                name='Last Name'
                placeholder={'Last Name'}
                value={lastName}
                type='text'
                onChange={(newVal) => {
                  setLastName(newVal);
                  if (newVal.trim() !== '') {
                    setNameError(false);
                  }
                }}
                theme='light'
                required={true}
                maxLength={15}
            />
        </div>
            <InputForm 
                name='User Name'
                placeholder={'Username'}
                value={userName}
                type='text'
                onChange={(newVal) => {
                  setUserName(newVal);
                  if (newVal.trim() !== '') {
                    setUsernameError(false);
                  }
                }}
                theme='light'
                required={true}
                maxLength={15}
            />
          <ButtonPill 
            label="Create account"
            onClick={handleUserSignUp}
            isLoading={isLoading}
          />
      </AuthCard>   
    </section>
  )
}
