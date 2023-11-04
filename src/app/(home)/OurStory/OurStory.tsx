import React from 'react'
import styles from './OurStory.module.css'
// Layout
import LayoutSections from '@/layouts/LayoutSections/LayoutSections'

export default function OurStory() {
  return (
    <section className={styles.our_story}>
        <LayoutSections title="Our Story" bgColor='dark'>
            <p>Our journey began with close friends, driven by a shared passion for fitness and friendly competition.  </p>
            <p>Initially, we used Google Sheets for tracking points for our challenges, but it wasn&apos;t enough. So, I took the initiative to develop and design our web app. It offers advanced challenge management, precise point tracking, and a welcoming community for you and your fellow fitness enthusiasts.</p>
            <p>Join us to enhance your fitness journey, foster friendly competition, and achieve new milestones in health and well-being.</p>
            <p> Thanks for checkout out this app and I hope you enjoy it!</p>
            <p> - John B</p>
        </LayoutSections>
    </section>
  )
}
