'use client'
import { useState, useEffect } from 'react'
import styles from './login.module.css'
// Internal Components
import AuthCard from '@/components/Cards/AuthCard/AuthCard'
import InputForm from '@/components/Input/Input'
import ButtonPill from '@/components/Buttons/ButtonPill/ButtonPill'
// Auth Provider Context
import { useAuth } from '@/context/AuthProvider'
// Next.js
import { useRouter } from 'next/navigation';

export default function Login() {
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')

  // Routing
  const router = useRouter();
  const { handleSignInWithGoogle, handleLogin, authError, isLoading } = useAuth();

  const handleSignIn = async () => {
    await handleLogin(emailInput, passwordInput);
  }

  return (
    <section className={styles.login}>
      <AuthCard 
        title='Sign In' 
        subSection="Forgot your password?" 
        isLoading={isLoading}
      >   
        <p className={styles.auth_error}>{authError}</p>
        <InputForm 
          name='Your Email'
          placeholder={'Your Email'}
          value={emailInput}
          type='email'
          onChange={(newVal) => setEmailInput(newVal)}
          theme='dark'
        />

        <InputForm 
          name='Password'
          placeholder={'Password'}
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

{/*      

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



<button onClick={handleSignInWithGoogle} className={styles.login_option}> 
          <Image src={googleIcon} className={styles.icon} alt="Google's icon"/> 
          <p className={styles.button_label}> Sign in using Google </p>
          <div className={styles.empty} />
        </button>
        
        <p> or sign in with email</p> */}

