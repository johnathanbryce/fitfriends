'use client'
import { useState } from 'react'
import styles from './SignUp.module.css'
// Internal Components
import AuthCard from '@/components/Cards/AuthCard/AuthCard'
import InputForm from '@/components/Input/Input'
import ButtonPill from '@/components/Buttons/ButtonPill/ButtonPill'
// Next.js
import { useRouter } from 'next/navigation';
// Firebase Auth
import { createUserWithEmailAndPassword } from 'firebase/auth';
// Firebase
import { database, auth } from '../../../../firebaseApp'
import {set, ref} from 'firebase/database'

export default function SignUp() {
  // User input state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [nickName, setNickName] = useState('')
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  // Routing
  const router = useRouter();

  const handleUserSignUp = async() => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        uid: user.uid,
        email: user.email,
        firstName: firstName,
        lastName: lastName,
        nickName: nickName
      };

      const userRef = ref(database, `users/${user.uid}`);
      await set(userRef, userData);

      setIsLoading(false);
      router.replace('/dashboard');
    } catch (error) {
      console.error('Error creating user:', error);
      setIsLoading(false);
      // Handle error, e.g., display an error message to the user
    }
  }

  return (
    <section className={styles.login}>
      <AuthCard 
        title='Create Your Account' 
        subSection="Forgot your password?" 
        isLoading={isLoading}
      >
         <p>Join the fitness challenge, conquer your goals, and seize the glory as you compete against friends to become the reigning fitness champion of the month</p>
          <InputForm 
            name='Your Email'
            value={email}
            type='email'
            onChange={(newVal) => setEmail(newVal)}
            theme='dark'
          />

          <InputForm 
            name='Password'
            value={password}
            type='password'
            onChange={(newVal) => setPassword(newVal)}
            theme='dark'
          /> 
          <div className={styles.user_name_wrapper}>
            <InputForm 
                name='First Name'
                value={firstName}
                type='text'
                onChange={(newVal) => setFirstName(newVal)}
                theme='dark'
            />
            <InputForm 
                name='Last Name'
                value={lastName}
                type='text'
                onChange={(newVal) => setLastName(newVal)}
                theme='dark'
            />
        </div>
            <InputForm 
                name='Nickname'
                value={nickName}
                type='text'
                onChange={(newVal) => setNickName(newVal)}
                theme='dark'
            />
          <ButtonPill 
            label="Submit"
            onClick={handleUserSignUp}
            isLoading={isLoading}
          />
      </AuthCard>   
    </section>
  )
}
