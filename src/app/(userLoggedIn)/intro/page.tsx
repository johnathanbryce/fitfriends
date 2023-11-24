'use client'
import styles from './intro.module.css'
// Internal Components
import ButtonPillRoute from '@/components/Buttons/ButtonPillRoute/ButtonPillRoute'
// Next.js
import Image from 'next/image'
import Link from 'next/link'
// Internal Assets
import logoTransparent from '../../../../public/images/logo-transparent.png'
// Auth Context
import { useAuth } from '@/context/AuthProvider'

export default function Intro() {
  // auth context
  const { user } = useAuth();

  return (
    <section className={styles.intro}>
      <figure className={styles.logo_wrapper}>
        <Image src={logoTransparent} className={styles.logo} alt="Fit Friend's official logo"/>
      </figure>
      <h2> Welcome to Fit Friends! </h2>
      <p> Level up your fitness routine by engaging friends in dynamic, customizable workout challenges. Score points according to the parameters established by the challenge creator, encompassing activities like cardio, weightlifting, or any other chosen exercise, for a fitness challenge that&apos;s customized to your liking. </p>
      <p> Simply  <Link href="/create-challenge" className={styles.link}>create a challenge </Link>  and invite participants, or <Link href="/challenges-dashboard" className={styles.link}>join an active one</Link> – it&apos;s that easy! </p>

    <div className={styles.get_started_section}>
      <p> Well, what are you waiting for? </p>
      <ButtonPillRoute
        label="Get started!"
        src="/challenges-dashboard"
      />
      <Link href={`/user-profile/${user?.uid}`}> Take me to my profile instead. </Link>
    </div>
    </section>
  )
}
