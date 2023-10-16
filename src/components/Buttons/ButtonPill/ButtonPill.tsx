import React from 'react';
import styles from './ButtonPill.module.css';

interface ButtonPillProps {
  label: string;
  isLoading: boolean;
  onClick?: (e: any) => void;
  secondary?: boolean;
}

const ButtonPill = ({label, isLoading, secondary, onClick}: ButtonPillProps) => {
  const buttonClassName = isLoading
    ? secondary
      ? styles.inactive_button
      : styles.inactive_button
    : secondary
    ? styles.button_secondary
    : styles.button;

  return (
    <button
      onClick={onClick}
      className={buttonClassName}
      type="submit"
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : label}
    </button>
  );
};

export default ButtonPill;
