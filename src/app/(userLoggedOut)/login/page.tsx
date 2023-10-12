'use client'
import { useState, FormEvent } from 'react'
import styles from './login.module.css'
// Internal Components
import AuthCard from '@/components/Cards/AuthCard/AuthCard'
import InputForm from '@/components/InputForm/InputForm'

export default function Login() {
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [isLoading, setIsLoading] = useState(false); 

  const handleLoginSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(emailInput, passwordInput);
  }

  return (
    <section className={styles.login}>
      <AuthCard 
        title='Log In' 
        subSection="Forgot your password?"
        buttonLabel='Log In' 
        onSubmit={handleLoginSubmit} 
        isLoading={isLoading}
      >
        <p> or log in with email</p>
        <InputForm 
          name='Your Email'
          value={emailInput}
          type='text'
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
      </AuthCard>   
    </section>
  )
}
