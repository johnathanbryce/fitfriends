import React from 'react';
import styles from "./ButtonPill.module.css"

interface ButtonPillProps {
  label: string,
  isLoading: boolean,

}
  
const ButtonPill = ({ label, isLoading }: ButtonPillProps) => {
    return (
      <button className={ isLoading ? styles.inactive_button : styles.button} type='submit' disabled={isLoading}>
        {isLoading ? 'Loading...': label}
      </button> 
    );
};

export default ButtonPill;