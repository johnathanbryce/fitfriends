'use client'
import React, {useState} from 'react';
import styles from './DailyPointsInput.module.css'
// Internal Components
import InputForm from '../InputForm/InputForm';
import ButtonPill from '../Buttons/ButtonPill/ButtonPill';

const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
    'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
];

export default function DailyPointsInput() {
    const [cardio, setCardio] = useState<number>();
    const [weights, setWeights] = useState<number>();


    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentMonthName = monthNames[currentMonth - 1];
    const currentDay = currentDate.getDate();

  return (
    <div className={styles.daily_points_input}>
        <h4 className={styles.curr_month_day}>{currentMonthName} {currentDay}</h4>
        <div className={styles.input}>
            <h5 className={styles.input_category}>Cardio</h5>
            <div className={styles.input_width_wrapper}>
                <InputForm 
                    name=''
                    value={cardio}
                    type='number'
                    onChange={(e) => setCardio(e)}
                    theme='light'
                />
            </div>
        </div>
        <div className={styles.input}>
            <h5 className={styles.input_category}>Weights</h5>
            <div className={styles.input_width_wrapper}>
                <InputForm 
                    name=''
                    value={weights}
                    type='number'
                    onChange={(e) => setWeights(e)}
                    theme='light'
                />
            </div>
        </div>
        <div className={styles.button_width_wrapper}>
            <ButtonPill 
                label='Submit'
                isLoading={false}
                secondary={true}
                onClick={() => console.log('submit')}
            />
        </div>
    </div>
  )
}
