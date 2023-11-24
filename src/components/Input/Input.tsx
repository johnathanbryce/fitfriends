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
    smallInput?: boolean,
    maxLength?: number;
}

export default function Input({name, onClick, smallInput, placeholder, value, type, theme, onChange, onFocus, onBlur, error=false, required=false, maxLength}: InputFormProps) {

    const handleInputChange = (event: any) => {
        let inputValue = event.target.value;
    
        // check if the input type is 'number' and a maxLength is defined
        if (type === 'number' && maxLength !== undefined) {
          // convert the input value to a string, trim it to the maxLength, and convert back to a number
          // restricts input limit for 'type === number inputs' via maxLength
          inputValue = String(inputValue).slice(0, maxLength);
        }
    
        onChange(inputValue);
      };
    
    return (
      <input 
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          maxLength={maxLength}
          min='1'
          max='4'
          /* onChange={(event) => onChange(event.target.value)} */
          onChange={handleInputChange}
          onClick={onClick}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`
          ${theme === 'dark' ? styles.input : styles.input_light} 
          ${error ? styles.error : '' }
          ${required ? styles.required : ''} 
          ${smallInput? styles.small_input: ''}
          `}
      />
  )
}
