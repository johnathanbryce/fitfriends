import React from 'react'
import styles from './InputForm.module.css'

interface InputFormProps {
    name: string,
    value: string | number|  undefined,
    type: string,
    onChange: (e: any) => void,
    theme: 'dark' | 'light'
}

export default function InputForm({name, value, type, theme, onChange}: InputFormProps) {
  return (
    <input 
        type={type}
        placeholder={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={theme === 'dark' ? styles.input : styles.input_light}
    />
  )
}
