import React from 'react'
import styles from './HeaderLoggedOut.module.css'
// Internal Components
import ButtonPillRoute from '../Buttons/ButtonPillRoute/ButtonPillRoute'

export default function HeaderLoggedOut() {

  return (
    <header className={styles.header}>
        <h1> FitFriends</h1>
        <ButtonPillRoute 
          label='Sign Up'
          src='sign-up'
        />

    </header>
  )
}
