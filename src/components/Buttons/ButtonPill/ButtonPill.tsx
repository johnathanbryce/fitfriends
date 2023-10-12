import React from 'react';
import styles from "./ButtonPill.module.css"

interface ButtonPillProps {
  label: string,
  isLoading: boolean,
  onClick?: (e: any) => void
}
  
const ButtonPill = ({ label, isLoading, onClick }: ButtonPillProps) => {
    return (
      <button onClick={onClick} className={ isLoading ? styles.inactive_button : styles.button} type='submit' disabled={isLoading}>
        {isLoading ? 'Loading...': label}
      </button> 
    );
};

export default ButtonPill;