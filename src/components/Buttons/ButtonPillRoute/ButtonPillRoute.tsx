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
      <Link href={src} className={secondary ? styles.button_secondary : styles.button} passHref>
        {label}
      </Link>
    );
};

export default ButtonPillRoute;