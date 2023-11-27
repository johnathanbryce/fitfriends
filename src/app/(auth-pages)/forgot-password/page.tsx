'use client'
import { useState, useEffect } from 'react'
import styles from './forgot-password.module.css'
// Next.js
import Link from 'next/link'
// Internal Components
import AuthCard from '@/components/Cards/AuthCard/AuthCard'
import InputForm from '@/components/Input/Input'
import ButtonPill from '@/components/Buttons/ButtonPill/ButtonPill'
// Auth Provider Context
import { useAuth } from '@/context/AuthProvider'
// Custom Hook
import useAuthenticationRedirect from '@/hooks/useAuthenticationRedirect'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  // Custom hook
  useAuthenticationRedirect('challenges-dashboard', 'forgot-password');
  // Auth context
  const { forgotPassword, isLoading, authError, clearAuthError, isPasswordResetSent} = useAuth()

  const handleResetPassword = (e: any) => {
    e.preventDefault();
    forgotPassword(email)
  }

  useEffect(() => {
    return () => {
      // Reset the isPasswordResetSent state when the component is unmounted
      if (isPasswordResetSent) {
        // Assuming you have a function to reset this state in your AuthProvider
        /* resetPasswordState(); */
      }
    };
  }, [isPasswordResetSent]);

    // when component unmounts, clear any authError's
    useEffect(() => {
      return () => {
        clearAuthError();
      };
    }, []);


  return (
    <section className={styles.login}>
        {isPasswordResetSent ? (
            <div className={styles.password_reset_container}>
                <p className={styles.text}>If an account exists for {email}, you will get an email with instructions on resetting your password.</p>
                <Link href='/login' className={styles.route_to_login_text}> Back to Log in</Link>
            </div>
        ) : (
        <AuthCard 
            title='Enter your email to reset password' 
            buttonLabel='Submit' 
            isLoading={isLoading}
            subSection='Cancel'
            navigateToSubSection='/login'
            onClick={handleResetPassword}
          >
            {authError ? <p className={styles.auth_error}>{authError}</p> : null}
            <InputForm 
                name='Your Email'
                value={email}
                type='email'
                placeholder='Email'
                onChange={(newVal) => setEmail(newVal)}
                theme='light'
                onClick={(e) => e.stopPropagation()}
            />
          </AuthCard>   
        )}
    </section>
  )
}