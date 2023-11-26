'use client'
import { useState, useEffect } from 'react'
import styles from './login.module.css'
// Internal Components
import AuthCard from '@/components/Cards/AuthCard/AuthCard'
import InputForm from '@/components/Input/Input'
import ButtonPill from '@/components/Buttons/ButtonPill/ButtonPill'
// Auth Provider Context
import { useAuth } from '@/context/AuthProvider'
// Custom Hook
import useAuthenticationRedirect from '@/hooks/useAuthenticationRedirect'

export default function Login() {
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  // Error state variables
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
/*   // Custom hook
  useAuthenticationRedirect('/login', 'challenges-dashboard'); */
  // Auth
  const { handleLogin, resendVerifyEmail, authError, clearAuthError, isLoading } = useAuth();

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

  // when component unmounts, clear any authError's
  useEffect(() => {
    return () => {
      clearAuthError();
    };
  }, []);

  const handleSignIn = async () => {
    await handleLogin(emailInput, passwordInput);
    setEmailError(false);
    setPasswordError(false);
  }

  return (
    <section className={styles.login}>
      <AuthCard 
        title='Log in to Fit Friends' 
        subSection="Reset password"
        navigateToSubSection='/forgot-password'
        subSectionTwo="No account? Sign up"
        navigateToSubSectionTwo='/sign-up'
        isLoading={isLoading}
      >  

        {authError && <p className={styles.auth_error}>{authError}</p>}
        <InputForm 
          name='Your Email'
          placeholder={'Your Email'}
          value={emailInput}
          error={emailError}
          required={true}
          type='email'
          onChange={(newVal) => setEmailInput(newVal)}
          theme='light'
        />

        <InputForm 
          name='Password'
          placeholder={'Password'}
          value={passwordInput}
          error={passwordError}
          required={true}
          type='password'
          onChange={(newVal) => setPasswordInput(newVal)}
          theme='light'
        />
        <ButtonPill 
          label="Log in"
          onClick={handleSignIn}
          isLoading={isLoading}
        />
        {authError === 'Please verify your email before logging in.' && 
          <ButtonPill
            label="Resend verification email"
            onClick={resendVerifyEmail}
            isLoading={isLoading}
          /> 
        }
      </AuthCard>   
    </section>
  )
}


