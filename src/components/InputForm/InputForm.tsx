import React from 'react'
import styles from './InputForm.module.css'

interface InputFormProps {
    name: string,
    value: string | undefined,
    type: string,
    onChange: (e: any) => void,
    theme: 'dark' | 'light'
}

export default function InputForm({name, value, type, onChange}: InputFormProps) {
  return (
    <input 
        type={type}
        placeholder={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={styles.input}
    />
  )
}
