'use client'
import React, { useState } from 'react';
import styles from './CustomDropdown.module.css'

interface CustomDropdownProps {
    options: any[],
    title: string,
    name: string,
    onChange: (e: any) => void,
}

const CustomDropdown = ({ options, name, title, onChange }: CustomDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(options[0]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionClick = (option: any) => {
        setSelectedOption(option);
        onChange({ target: { name, value: option } }); // Mimic event object structure
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
