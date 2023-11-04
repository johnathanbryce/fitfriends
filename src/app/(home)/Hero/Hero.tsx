import React from 'react'
import styles from './Hero.module.css'
// Internal Components
import ButtonPillRoute from '@/components/Buttons/ButtonPillRoute/ButtonPillRoute'
// Next.js
import Image from 'next/image'
// Internal Assets
import logoTransparent from '../../../../public/images/logo-transparent.png'

export default function Hero() {
  return (
    <section className={styles.hero}>
        <Image src={logoTransparent} className={styles.logo} alt="Fit Friend's logo" />
        <h1 >Welcome to Fit Friends!</h1>
        <p className={styles.subheader}> Elevate your fitness journey with our dynamic challenges. Join today and invite your friends for a fun and motivational competition.</p>
        <div className={styles.btn_container}>
            <ButtonPillRoute 
                label='Login'
                src='/login'
            />
            <ButtonPillRoute 
                label='Sign Up'
                src='/sign-up'
            />
        </div>

    </section>
  )
}
