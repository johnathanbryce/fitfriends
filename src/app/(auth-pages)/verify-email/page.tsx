'use client'
import  {useState, useEffect} from 'react'
import styles from './verify-email.module.css'
// Next.js
import Link from 'next/link'
// Internal Components
import ButtonPill from '@/components/Buttons/ButtonPill/ButtonPill'
import ButtonPillRoute from '@/components/Buttons/ButtonPillRoute/ButtonPillRoute'
import Loading from '@/app/loading'
// Auth
import { useAuth } from '@/context/AuthProvider'

export default function VerifyEmail() {
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  // auth context
  const { user, resendVerifyEmail, isVerifyEmailResent, authError, isLoading } = useAuth();

  // check if the user object is loaded
/*   useEffect(() => {
    if (user && user.email && user.userName) {
      setIsUserLoaded(true);
    }
  }, [user]);

  if (!isUserLoaded) {
    return <Loading />;
  } */

  if(isVerifyEmailResent){
    return (
      <section className={styles.verify_sign_up}>
        <h4> Another verification email has been sent to {user?.email}. </h4>
        <p> Please re-check your email to verify your account before logging in.</p>
        <p> Remember to check your spam/junk folder. </p>
        <p > Once you have verified your email, you may successfully </p>
        <div>
        <ButtonPillRoute src='/login' label='Login' secondary={true} />
      </div>
      </section>
    )
  }

  return (
    <section className={styles.verify_sign_up}>
      <h4> Thank you for registering for Fit Friends, {user?.userName}! </h4>
      <p> A verification email has been sent to <span className={styles.email}>{user?.email}</span>. </p>
      <p> Please check your email to verify your account before logging in.</p>
      <p> Remember to check your spam/junk folder. </p>
      {authError && <p className={styles.auth_error}>{authError}</p>}
      <ButtonPill 
        onClick={resendVerifyEmail}
        label="Resend email verification"
        isLoading={isLoading}
      />
      <p> Once you have verified your email, you may successfully </p>
      <div>
        <ButtonPillRoute src='/login' label='Login' secondary={true} />
      </div>
  </section>
  )
}
