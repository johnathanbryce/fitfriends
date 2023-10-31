import React from 'react';
import styles from "./ButtonPillRoute.module.css"
// Next.js
import Link from 'next/link';

interface ButtonPillRouteProps {
  label: string,
  src: string,
}
  
const ButtonPillRoute = ({ label, src }: ButtonPillRouteProps) => {
  const href = src || '/';

    return (
      <Link href={src} className={styles.button} >
        {label} 
      </Link> 
    );
};

export default ButtonPillRoute;