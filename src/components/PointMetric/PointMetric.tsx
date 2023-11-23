'use client'
import { useState, useEffect } from 'react';
import styles from './PointMetric.module.css';
// Internal Components
import Input from '../Input/Input';
import CustomDropdown from '../CustomDropdown/CustomDropdown';
// External Libraries
import { FaTrashAlt } from "react-icons/fa";

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
        'seconds',
        'minutes',
        'hours',
        'reps',
        'sets'
    ]

    const intensityOptions =[
        'n/a',
        'low',
        'medium',
        'high',
        'any'
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
        'Dance Fitness',
        'Basketball',
    ]

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * placeholderOptions.length);
        setPlaceholder(`ex:  ${placeholderOptions[randomIndex]}`);
    }, []);

  return (
    <div className={styles.point_metric}>
        <p className={styles.title}> metric {index + 1} </p>
        <div className={styles.point_metric_flex_wrapper}>
            <div className={`${styles.input_wrapper} ${styles.name}`}>
                <p> name </p>
                <Input 
                    name='name'
                    placeholder={placeholder}
                    value={metric.name}
                    onChange={(newValue) => handleChange('name', newValue)}
                    type='text'
                    theme='dark'
                    required={true}
                    maxLength={20}
                />
            </div>
            <div className={`${styles.input_wrapper} ${styles.duration}`}>
                <p> quantity </p>
                <Input 
                    name='duration'
                    placeholder=""
                    value={metric.duration}
                    onChange={(newValue) => handleChange('duration', newValue)}
                    type='number'
                    theme='dark'
                    required={true}
                    maxLength={10}
                />
            </div>

            <div className={`${styles.input_wrapper} ${styles.dropdown}`}>
                <p> duration </p>
                <CustomDropdown 
                    options={durationOptions} 
                    title='parameters'
                    name='durationOption'
                    onChange={(e) => handleChange('durationOption', e.target.value)}
                />
            </div>

            <div className={`${styles.input_wrapper} ${styles.dropdown}`}>
                <p> intensity </p>
                <CustomDropdown 
                    options={intensityOptions} 
                    title='intensity'
                    name='intensity'
                    onChange={(e) => handleChange('intensity', e.target.value)}
                />
            </div>

            <p> = </p>
            <div className={`${styles.input_wrapper} ${styles.points}`}>
                <p> point(s) </p>
                <Input 
                    name='value'
                    placeholder=""
                    value={metric.value}
                    onChange={(newValue) => handleChange('value', newValue)}
                    type='number'
                    theme='dark'
                    required={true}
                    maxLength={2}
                />
            </div>
            {index > 0 ? <FaTrashAlt className={styles.icon} onClick={() => deleteMetric(index)}  /> : <FaTrashAlt className={styles.icon_hidden} />  }
        </div>
    </div>
  )
}
