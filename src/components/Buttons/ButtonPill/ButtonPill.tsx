import React from 'react';
import styles from "./ButtonPill.module.css"

interface ButtonPillProps {
  label: string,
  onClick?: (...args: any[]) => void;
  type: string,
  isLoading: boolean
}
  
const ButtonPill = ({ label, onClick, type, isLoading }: ButtonPillProps) => {

    return (
      <button className={[styles.container, type === 'primary' ? styles.primary : styles.secondary].join(' ')} onClick={onClick} disabled={isLoading}>
        {isLoading ? 'Loading...': label}
      </button> 
    );
};

export default ButtonPill;