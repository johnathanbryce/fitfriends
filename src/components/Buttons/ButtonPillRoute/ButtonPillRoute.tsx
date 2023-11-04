import React from 'react';
import styles from "./ButtonPillRoute.module.css"
// Next.js
import Link from 'next/link';

interface ButtonPillRouteProps {
  label: string,
  src: string,
  secondary?: boolean
}
  
const ButtonPillRoute = ({ label, src, secondary }: ButtonPillRouteProps) => {
    return (
      <Link href={src} >
        {secondary ?
          <button className={styles.button_secondary}> {label} </button>
          :
          <button className={styles.button}> {label} </button>
        } 
      </Link> 
    );
};

export default ButtonPillRoute;