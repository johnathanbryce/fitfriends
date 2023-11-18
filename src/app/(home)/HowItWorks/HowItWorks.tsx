import React from 'react'
import styles from './HowItWorks.module.css'
// Next.js
import Image from 'next/image'
// Layout
import LayoutSections from '@/layouts/LayoutSections/LayoutSections'
// Components
import ButtonPillRoute from '@/components/Buttons/ButtonPillRoute/ButtonPillRoute'
import { Carousel } from '@/components/Carousel/Carousel'
// Internal Assets
import createChallenge1 from '../../../../public/images/create-challenge-1.png'
import createChallenge2 from '../../../../public/images/create-challenge-2.png'
import challengesDashboard from '../../../../public/images/challenge-dashboard-png.png'
import challenge from '../../../../public/images/challenge.png'
// External Libraries
import Lottie from 'lottie-react';
import animationData from '../../../assets/dumbbell-phone-animation.json'

export default function HowItWorks() {
  return (
    <section className={styles.how_it_works}>
        <LayoutSections title='How it works' bgColor='orange'>
            <aside className={styles.how_it_works_flex_wrapper}>
                <p className={styles.text}> Create custom fitness challenges based on weights and cardio. Set the duration and points for each metric to match your fitness goals.</p>
                <p className={styles.text}> Track your progress and compete with friends to stay motivated on your fitness journey.</p>
                <div className={styles.btn_container}>
                    <ButtonPillRoute
                        label="Get started" 
                        src='/sign-up'
                        secondary={true}
                    />
                </div>               
            </aside>
        </LayoutSections>
        <div className={styles.steps_container}>
            <Carousel>
                <figure className={styles.content_wrapper}>
                    <div className={styles.step_wrapper}>
                        <p className={styles.number}> 1 </p>
                        <h3> Define point metrics. </h3>
                    </div>
                    <Image src={createChallenge1} className={styles.create_challenge_img} alt="How to create a challenge"/>
                </figure>
                <figure className={styles.content_wrapper}>
                    <div className={styles.step_wrapper}>
                        <p className={styles.number}> 2 </p>
                        <h3> Add challenge duration. </h3>
                    </div>
                    <Image src={createChallenge2} className={styles.create_challenge_img} alt="How to create a challenge"/>
                </figure>
                <figure className={styles.content_wrapper}>
                    <div className={styles.step_wrapper}>
                        <p className={styles.number}> 3 </p>
                        <h3> Join created challenges. </h3>
                    </div>
                    <Image src={challengesDashboard} className={styles.create_challenge_img} alt="Challenges dashboard."/>
                </figure>
                <figure className={styles.content_wrapper}>
                    <div className={styles.step_wrapper}>
                        <p className={styles.number}> 4 </p>
                        <h3> Enter points to compete. </h3>
                    </div>
                    <Image src={challenge} className={styles.create_challenge_img} alt="Challenges dashboard."/>
                </figure>
            </Carousel>
        </div>
    </section>
  )
}
