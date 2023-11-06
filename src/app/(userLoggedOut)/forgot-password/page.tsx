'use client'
import { useState, useEffect } from 'react'
import styles from './forgot-password.module.css'
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
  useAuthenticationRedirect('/forgot-password', 'challenges-dashboard');
  // Auth context
  const { forgotPassword, isLoading, authError, isPasswordResetSent} = useAuth()

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


  return (
    <section className={styles.login}>
        {isPasswordResetSent ? (
            <div className={styles.password_reset_container}>
                <p> An email has been sent to {email}</p>
                <p> Please follow the link provided in this email to reset your password. </p>
            </div>
        ) : (
        <AuthCard 
            title='Reset Your Password' 
            buttonLabel='Submit' 
            isLoading={isLoading}
            onClick={handleResetPassword}
          >
            {authError ? <p className={styles.auth_error}>{authError}</p> : <p className={styles.text}>Enter the email associated with your account for a password reset email. </p>}
            <InputForm 
                name='Your Email'
                value={email}
                type='email'
                placeholder='Email'
                onChange={(newVal) => setEmail(newVal)}
                theme='dark'
                onClick={(e) => e.stopPropagation()}
            />
          </AuthCard>   
        )}
    </section>
  )
}