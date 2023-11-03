import React from 'react'
import styles from './FooterLoggedIn.module.css'
// Internal Components
import WavesAnimationUp from '@/components/WavesAnimationUp/WavesAnimationUp'
// Next.js
import Link from 'next/link'
// External Libraries
import {AiFillGithub, AiFillLinkedin, AiOutlineMail} from 'react-icons/ai'

export default function FooterLoggedIn() {
  return (
    <>
    <WavesAnimationUp color='#FF5722'/>
    <footer className={styles.footer}>
        <p> designed & developed by johnathan bryce</p>
        <ul className={styles.socials_container}>
            <li>
                <Link href="https://www.linkedin.com/in/johnathanbryce/" target='_blank'>
                   <AiFillLinkedin className={styles.icon} />
                </Link>
            </li>
            <li>
                <Link href="https://github.com/johnathanbryce" target='_blank'>
                    <AiFillGithub className={styles.icon} />
                </Link>
            </li> 
            <li>
                <Link href="mailto:johnathanbryce@gmail.com" target='_blank'> 
                    <AiOutlineMail className={styles.icon} />
                </Link>
            </li>          
        </ul>
    </footer>
    </>
  )
}
