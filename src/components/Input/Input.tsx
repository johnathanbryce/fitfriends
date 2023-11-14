import React from 'react'
import styles from './Input.module.css'

interface InputFormProps {
    name: string,
    value: string | number | undefined,
    type: string,
    placeholder?: string,
    onChange: (e: any) => void,
    onClick?: (e: any) => void,
    onFocus?: (e: any) => void,
    onBlur?: (e: any) => void,
    theme: 'dark' | 'light',
    error?: boolean,
    required?: boolean,
    maxLength?: number;
}

export default function Input({name, onClick, placeholder, value, type, theme, onChange, onFocus, onBlur, error=false, required=false, maxLength}: InputFormProps) {
  return (
      <input 
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          maxLength={maxLength}
          onChange={(event) => onChange(event.target.value)}
          onClick={onClick}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`
          ${theme === 'dark' ? styles.input : styles.input_light} 
          ${error ? styles.error : '' }
          ${required ? styles.required : ''} 
          `}
      />
  )
}
