'use client'
import { useState, useEffect } from 'react';
import styles from './PointMetric.module.css';
// Internal Components
import Input from '../Input/Input';
import CustomDropdown from '../CustomDropdown/CustomDropdown';
// External Libraries
import { FaTrashAlt, FaEquals  } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

interface PointMetricProps {
    metric: {
      name: any,
      value: string,
      duration: string,
      durationOption: string,
      intensity: string,
    },
    index: number,
    updateMetric: (metric: object) => void,
    deleteMetric: (index: number) => void,
  }

export default function PointMetric({metric, index, updateMetric, deleteMetric}: PointMetricProps) {
    const [placeholder, setPlaceholder] = useState('');

    const handleChange = (propertyName: any, newValue: any) => {
        updateMetric({ ...metric, [propertyName]: newValue });
    };

    const durationOptions = [
        'minutes',
        'hours',
        'reps',
        'sets',
        'n/a',
    ]

    const intensityOptions =[
        'any',
        'low',
        'medium',
        'high',
        'n/a',
    ]

    const placeholderOptions = [
        'Yoga',
        'Cardio',
        'Cycling',
        'Weight Lifting',
        'Soccer',
        'Walking',
        'Running',
        'Swimming',
        'Hiking',
        'CrossFit',
        'Pilates',
        'Boxing',
        'Rowing',
        'Jump Rope',
        'Dance',
        'Basketball',
    ]

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * placeholderOptions.length);
        setPlaceholder(`ex:  ${placeholderOptions[randomIndex]}`);
    }, []);

  return (
    <div className={styles.point_metric}>
        <p className={styles.metric_number}> {index + 1}. </p>
        <div className={`${styles.input_wrapper} ${styles.small_screen_name}`}>
                <p> activity </p>
                <Input 
                    name='name'
                    placeholder={placeholder}
                    value={metric.name}
                    onChange={(newValue) => handleChange('name', newValue)}
                    type='text'
                    theme='light'
                    required={true}
                    smallInput={true}
                    maxLength={20}
                />
        </div>
        <div className={styles.point_metric_flex_wrapper}>
            <div className={`${styles.input_wrapper} ${styles.name}`}>
                <p> activity </p>
                <Input 
                    name='name'
                    placeholder={placeholder}
                    value={metric.name}
                    onChange={(newValue) => handleChange('name', newValue)}
                    type='text'
                    theme='light'
                    required={true}
                    smallInput={true}
                    maxLength={18}
                />
            </div>
            <div className={`${styles.input_wrapper} ${styles.quantity}`}>
                <p> quantity </p>
                <Input 
                    name='duration'
                    placeholder=""
                    value={metric.duration}
                    onChange={(newValue) => handleChange('duration', newValue)}
                    type='number'
                    theme='light'
                    required={true}
                    smallInput={true}
                    maxLength={3}
                />
            </div>

            <div className={`${styles.input_wrapper} ${styles.dropdown}`}>
                <p> duration </p>
                <CustomDropdown 
                    options={durationOptions} 
                    name='durationOption'
                    onChange={(e) => handleChange('durationOption', e.target.value)}
                />
            </div>

            <div className={`${styles.input_wrapper} ${styles.dropdown}`}>
                <p> intensity </p>
                <CustomDropdown 
                    options={intensityOptions} 
                    name='intensity'
                    onChange={(e) => handleChange('intensity', e.target.value)}
                />
            </div>

            <FaEquals />
            <div className={`${styles.input_wrapper} ${styles.points}`}>
                <p> point(s) </p>
                <Input 
                    name='value'
                    placeholder=""
                    value={metric.value}
                    onChange={(newValue) => handleChange('value', newValue)}
                    type='number'
                    theme='light'
                    required={true}
                    smallInput={true}
                    maxLength={3}
                />
            </div>
            {/* trash icon for small screens */}
            {index > 0 ? <FaTrashAlt className={styles.trash_icon } onClick={() => deleteMetric(index)}  /> : null  }
            {/* X icon for small screens */}
            {index > 0 ? <MdCancel className={styles.cancel_icon } onClick={() => deleteMetric(index)}  /> : null  }
        </div>
    </div>
  )
}
