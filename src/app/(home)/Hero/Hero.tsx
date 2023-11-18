import React from 'react'
import styles from './Hero.module.css'
// Internal Components
import ButtonPillRoute from '@/components/Buttons/ButtonPillRoute/ButtonPillRoute'
// Next.js
import Image from 'next/image'
// Internal Assets
import logoTransparent from '../../../../public/images/logo-transparent.png'
// External Libraries
import Lottie from 'lottie-react';
import animationData from '../../../assets/dumbbell-phone-animation.json'

interface Interactivity {
  mode: 'scroll' 
  actions: any[]
}

export default function Hero() {
  const interactivity: Interactivity = {
    mode: "scroll",
    actions: [
      {
        visibility: [0, 0.2],
        type: "stop",
        frames: [0],
      },
      {
        visibility: [0.2, 0.45],
        type: "seek",
        frames: [0, 45],
      },
      {
        visibility: [0.45, 1.0],
        type: "loop",
        frames: [45, 60],
      },
    ],
  };

  return (
    <section className={styles.hero}>
        <Image src={logoTransparent} className={styles.logo} priority alt="Fit Friend's logo" />
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
        <div className={styles.animation}>
            <Lottie animationData={animationData} loop={false} interactivity={interactivity} /* interactivity={interactivity} */ />
        </div>
    </section>
  )
}
