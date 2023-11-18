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
import Image from 'next/image'
// Internal Assets
import googleIcon from '../../../../public/images/google-icon.png'
import appleIcon from '../../../../public/images/apple-icon.png'
// Custom Hook
import useAuthenticationRedirect from '@/hooks/useAuthenticationRedirect'

export default function Login() {
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  // Error state variables
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // Custom hook
/*   useAuthenticationRedirect('/login', 'challenges-dashboard'); */

  // Auth
  const { handleSignInWithGoogle, handleLogin, authError, isLoading } = useAuth();

  // Use useEffect to watch for changes in authError
  useEffect(() => {
    // Reset errors to false initially
    setEmailError(false);
    setPasswordError(false);
    if (authError === 'Invalid email. Please check your email address.') {
      setEmailError(true);
    } else if (authError === 'Wrong or missing password. Please check your password.') {
      setPasswordError(true);
    } else if (authError === 'Invalid credentials. Please check your email or password.') {
      setEmailError(true);
      setPasswordError(true);
    }
  }, [authError]);

  const handleSignIn = async () => {
    await handleLogin(emailInput, passwordInput);
    setEmailError(false);
    setPasswordError(false);
  }

  return (
    <section className={styles.login}>
      <AuthCard 
        title='Login' 
        navigateTo='/forgot-password'
        subSection="Forgot your password?" 
        isLoading={isLoading}
      >  
{/*         <button type="button" onClick={handleSignInWithGoogle} className={styles.login_option}> 
          <Image src={googleIcon} className={styles.icon} alt="Google's icon"/> 
          <p className={styles.button_label}> Sign in using Google </p>
          <div className={styles.empty} />
        </button>
        
        <p> or sign in with email</p> */}
        {authError && <p className={styles.auth_error}>{authError}</p>}
        <InputForm 
          name='Your Email'
          placeholder={'Your Email'}
          value={emailInput}
          error={emailError}
          required={true}
          type='email'
          onChange={(newVal) => setEmailInput(newVal)}
          theme='dark'
        />

        <InputForm 
          name='Password'
          placeholder={'Password'}
          value={passwordInput}
          error={passwordError}
          required={true}
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


