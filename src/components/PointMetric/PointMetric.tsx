import styles from './PointMetric.module.css'
// Internal Components
import Input from '../Input/Input'
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
        'N/A',
        'low',
        'medium',
        'high',
        'any'
    ]

  return (
    <div className={styles.point_metric}>
        <p> Custom Metric {index + 1} </p>
        <div className={styles.point_metric_flex_wrapper}>
            <Input 
                name='name'
                placeholder="Name (ex: Weightlifting)"
                value={metric.name}
                onChange={(newValue) => handleChange('name', newValue)}
                type='text'
                theme='dark'
                required={true}
                maxLength={20}
            />
            <Input 
                name='duration'
                placeholder="Duration"
                value={metric.duration}
                onChange={(newValue) => handleChange('duration', newValue)}
                type='number'
                theme='dark'
                required={true}
                maxLength={10}
            />
            <select name='durationOption' value={metric.durationOption} onChange={(e) => handleChange('durationOption', e.target.value)}>
                {durationOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>

            <select name='intensity'  value={metric.intensity} onChange={(e) => handleChange('intensity', e.target.value)}>
                {intensityOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>

            <p> = </p>
            <Input 
                name='value'
                placeholder="Value (ex: 1 point)"
                value={metric.value}
                onChange={(newValue) => handleChange('value', newValue)}
                type='number'
                theme='dark'
                required={true}
                maxLength={10}
            />
            {index > 0 ? <FaTrashAlt className={styles.icon} onClick={() => deleteMetric(index)}  /> : <div> </div> }
        </div>
    </div>
  )
}
