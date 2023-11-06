import React from 'react'
import styles from './OurStory.module.css'
// Layout
import LayoutSections from '@/layouts/LayoutSections/LayoutSections'

export default function OurStory() {
  return (
    <section className={styles.our_story}>
        <LayoutSections title="Our Story" bgColor='dark'>
            <p> Our journey started as a fitness challenge among close friends united by a love for fitness and friendly competition. We initially relied on Google Sheets for point tracking, but soon realized it was insufficient. That&apos;s when I took the initiative to create this web app. It provides advanced challenge management, precise point tracking, and a supportive fitness community.</p>
            <p>Join us to elevate your fitness journey, promote friendly competition, and reach new health and well-being milestones. Thank you for exploring the app, and I hope you find it enjoyable!</p>
            <p> - John B</p>
        </LayoutSections>
    </section>
  )
}
