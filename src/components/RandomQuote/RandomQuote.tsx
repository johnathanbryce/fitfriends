import React from 'react';
import styles from './RandomQuote.module.css'
// Internal Assets
import quotes from '../../assets/quotes.json'

export default function RandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
  return (
    <blockquote className={styles.blockquote}>
        <p className={styles.quote}>{/* &quot; */}{quotes[randomIndex].quote}{/* &quot; */}</p>
        <footer className={styles.quote}>
            — <cite className={styles.quote}>{quotes[randomIndex].name}</cite>
        </footer>
    </blockquote>
  )
}
