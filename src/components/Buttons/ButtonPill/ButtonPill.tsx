import React from 'react';
import styles from './ButtonPill.module.css';
// External Libraries
import {AiOutlineUsergroupAdd} from 'react-icons/ai'
import { FaCheck } from "react-icons/fa";

interface ButtonPillProps {
  label: any;
  isLoading: boolean;
  onClick?: (e: any) => void;
  secondary?: boolean;
  disabled?: boolean;
}

const ButtonPill = ({label, isLoading, disabled, secondary, onClick}: ButtonPillProps) => {
  const buttonClassName = isLoading
    ? secondary
      ? styles.inactive_button
      : styles.inactive_button
    : secondary
    ? styles.button_secondary
    : styles.button;

    if (label === 'add-users'){
      label = <AiOutlineUsergroupAdd className={styles.icon} />
    }

    if (label === 'confirm'){
      label = <FaCheck className={styles.icon_confirm} />
    }

  return (
    <button
      onClick={onClick}
      className={buttonClassName}
      type="submit"
      disabled={isLoading || disabled}
    >
      <span className={styles.label}> {isLoading ? 'Loading...' : label} </span>
    </button>
  );
};

export default ButtonPill;
