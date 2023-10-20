'use client'
import { useState } from 'react'
import styles from './login.module.css'
// Internal Components
import AuthCard from '@/components/Cards/AuthCard/AuthCard'
import InputForm from '@/components/Input/Input'
import ButtonPill from '@/components/Buttons/ButtonPill/ButtonPill'
// Auth Provider Context
import { useAuth } from '@/context/AuthProvider'
// Next.js
import Image from 'next/image'
// Internal Assets
import googleIcon from '../../../../public/images/google-icon.png'
import appleIcon from '../../../../public/images/apple-icon.png'
// Firebase Auth
import { signInWithEmailAndPassword } from 'firebase/auth';
// Firebase 
import { database, auth } from '../../../../firebaseApp'
import { ref, get } from 'firebase/database';

export default function Login() {
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [isLoading, setIsLoading] = useState(false); 

  const { handleSignInWithGoogle } = useAuth();

  const handleSignIn = async() => {
    // Sign in with email and password
    const userCredential = await signInWithEmailAndPassword(auth, emailInput, passwordInput);
    const user = userCredential.user;

    // Check if the user exists in the Realtime Database
    const userRef = ref(database, `users/${user.uid}`);
    const userSnapshot = await get(userRef);

    if (userSnapshot.exists()) {
      console.log(`user ${user.uid} exists`)
      // User exists in the "users" bucket
      // Redirect or perform other actions for authenticated users
    } else {
      console.log('user not authorized')
      // User does not exist in the "users" bucket
      // Handle the case where the user is not authorized
    }
  }

  return (
    <section className={styles.login}>
      <AuthCard 
        title='Sign In' 
        subSection="Forgot your password?" 
        isLoading={isLoading}
      >
        <button onClick={handleSignInWithGoogle} className={styles.login_option}> 
          <Image src={googleIcon} className={styles.icon} alt="Google's icon"/> 
          <p className={styles.button_label}> Sign in using Google </p>
          <div className={styles.empty} />
        </button>
        
        <p> or sign in with email</p>
          <InputForm 
            name='Your Email'
            value={emailInput}
            type='email'
            onChange={(newVal) => setEmailInput(newVal)}
            theme='dark'
          />

          <InputForm 
            name='Password'
            value={passwordInput}
            type='password'
            onChange={(newVal) => setPasswordInput(newVal)}
            theme='dark'
          />
          <ButtonPill 
            label="Submit"
            onClick={handleSignIn}
            isLoading={isLoading}
          />
      </AuthCard>   
    </section>
  )
}

