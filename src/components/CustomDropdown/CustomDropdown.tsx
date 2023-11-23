'use client'
import React, { useState } from 'react';
import styles from './CustomDropdown.module.css'

interface CustomDropdownProps {
    options: any[],
    name: string,
    onChange: (e: any) => void,
}

const CustomDropdown = ({ options, name, onChange }: CustomDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    // ensures 'minutes' is the default and already selected option
    const defaultOption = options.includes('minutes') ? 'minutes' : options[0];
    const [selectedOption, setSelectedOption] = useState(defaultOption);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionClick = (option: any) => {
        setSelectedOption(option);
        onChange({ target: { name, value: option } }); 
        setIsOpen(false);
    };
    
    return (
        <div className={styles.custom_dropdown}>
            <div className={styles.select_trigger} onClick={toggleDropdown}>
                {selectedOption}
            </div>
            {isOpen && (
                <div className={styles.options}>
                    {options.map((option, index) => (
                        <div 
                            key={index} 
                            className={styles.option} 
                            onClick={() => handleOptionClick(option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
            <select name={name} value={selectedOption} onChange={onChange} className={styles.hidden_select}>
                {options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
};

export default CustomDropdown;
