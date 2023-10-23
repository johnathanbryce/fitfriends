import React from 'react'
import styles from './Input.module.css'

interface InputFormProps {
    name: string,
    value: string | number | undefined,
    type: string,
    onChange: (e: any) => void,
    theme: 'dark' | 'light',
    error?: boolean,
    required?: boolean
}

export default function Input({name, value, type, theme, onChange, error=false, required=false}: InputFormProps) {
  return (
    <input 
        type={type}
        placeholder={name}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${theme === 'dark' ? styles.input : styles.input_light} ${
          error ? styles.error : '' 
        }`}
    />
  )
}
