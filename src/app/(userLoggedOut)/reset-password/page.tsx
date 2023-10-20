'use client'
import { useState } from 'react'
import styles from './reset-password.module.css'
// Internal Components
import AuthCard from '@/components/Cards/AuthCard/AuthCard'
import InputForm from '@/components/Input/Input'
// Auth Provider Context
import { useAuth } from '@/context/AuthProvider'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false); 

  const { resetPassword } = useAuth()



  return (
    <section className={styles.login}>
      <AuthCard 
        title='Reset Your Password' 
        buttonLabel='Submit' 
        isLoading={isLoading}
        onClick={resetPassword}
      >
        <InputForm 
          name='Your Email'
          value={email}
          type='email'
          onChange={(newVal) => setEmail(newVal)}
          theme='dark'
        />
      </AuthCard>   
    </section>
  )
}