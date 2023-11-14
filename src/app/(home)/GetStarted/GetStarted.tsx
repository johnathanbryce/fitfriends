import React from 'react'
import styles from './GetStarted.module.css'
// Internal Components
import ButtonPillRoute from '@/components/Buttons/ButtonPillRoute/ButtonPillRoute'

export default function GetStarted() {
  return (
    <section className={styles.get_started}>
        <h4> Ready to elevate your fitness game? </h4>
        <div>
          <ButtonPillRoute 
              label="Let's get started!"
              src='/sign-up'
          />
        </div>
    </section>
  )
}
