'use client'
import { useState } from 'react'
import styles from './login.module.css'
// Internal Components
import AuthCard from '@/components/Cards/AuthCard/AuthCard'
import InputForm from '@/components/InputForm/InputForm'
// Auth Provider Context
import { useAuth } from '@/context/AuthProvider'
// Next.js
import Image from 'next/image'
// Internal Assets
import googleIcon from '../../../../public/images/google-icon.png'
import appleIcon from '../../../../public/images/apple-icon.png'

export default function Login() {
  const [isLoading, setIsLoading] = useState(false); 

  const { handleSignInWithGoogle } = useAuth()

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

      </AuthCard>   
    </section>
  )
}

{/*         

 const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('') 

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
        /> */}