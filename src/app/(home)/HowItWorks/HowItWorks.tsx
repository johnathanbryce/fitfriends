import React from 'react'
import styles from './HowItWorks.module.css'
// Next.js
import Image from 'next/image'
// Layout
import LayoutSections from '@/layouts/LayoutSections/LayoutSections'
// Components
import ButtonPillRoute from '@/components/Buttons/ButtonPillRoute/ButtonPillRoute'
import WavesAnimationUp from '@/components/WavesAnimationUp/WavesAnimationUp'
import { Carousel } from '@/components/Carousel/Carousel'
// Internal Assets
import step1 from '../../../../public/images/ff-step-1.png'
import step2 from '../../../../public/images/ff-step-2.png'
import step3 from '../../../../public/images/ff-step-3.png'
import step4 from '../../../../public/images/ff-step-4.png'
import step5 from '../../../../public/images/step-5.png'

export default function HowItWorks() {
  return (
    <section className={styles.how_it_works}>
        <LayoutSections title='How it works' bgColor='white'>
            <div className={styles.content_flex_wrapper}>
                <aside className={styles.how_it_works_flex_wrapper}>
                    <p className={styles.text}> Create your own fitness challenge with complete flexibility. Choose the exercises and set the duration and points for each activity to align with your fitness objectives. Whether it&apos;s strength training, cardio, or any other workout, tailor each challenge to suit your goals.</p>
                    <p className={styles.text}> Track your progress and compete with friends to stay motivated on your fitness journey.</p>
                    <div className={styles.btn_container}>
                        <ButtonPillRoute
                            label="Get started" 
                            src='/sign-up'
                            
                        />
                    </div>               
                </aside>
                <div className={styles.steps_container}>
                    <Carousel>
                        <figure className={styles.content_wrapper}>
                            <div className={styles.step_wrapper}>
                                <p className={styles.number}> 1. </p>
                                <p> Name your challenge </p>
                            </div>
                            <Image src={step1} className={styles.create_challenge_img} alt="How to create a challenge"/>
                        </figure>
                        <figure className={styles.content_wrapper}>
                            <div className={styles.step_wrapper}>
                                <p className={styles.number}> 2. </p>
                                <p> Define your point metrics </p>
                            </div>
                            <Image src={step2} className={styles.create_challenge_img} alt="How to create a challenge"/>
                        </figure>
                        <figure className={styles.content_wrapper}>
                            <div className={styles.step_wrapper}>
                                <p className={styles.number}> 3. </p>
                                <p> Select challenge duration </p>
                            </div>
                            <Image src={step3} className={styles.create_challenge_img} alt="Challenges dashboard."/>
                        </figure>
                        <figure className={styles.content_wrapper}>
                            <div className={styles.step_wrapper}>
                                <p className={styles.number}> 4. </p>
                                <p> Review your challenge </p>
                            </div>
                            <Image src={step4} className={styles.create_challenge_img} alt="Challenges dashboard."/>
                        </figure>
                        <figure className={styles.content_wrapper}>
                            <div className={styles.step_wrapper}>
                                <p className={styles.number}> 5. </p>
                                <p> Enter points to compete </p>
                            </div>
                            <Image src={step5} className={styles.create_challenge_img} alt="Challenges dashboard."/>
                        </figure>
                    </Carousel>
                </div>
            </div>
            </LayoutSections>
    </section>
  )
}
