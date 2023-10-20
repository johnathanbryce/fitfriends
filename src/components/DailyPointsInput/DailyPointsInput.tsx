'use client'
import React, {useState} from 'react';
import styles from './DailyPointsInput.module.css'
// Internal Components
import Input from '../Input/Input';
import ButtonPill from '../Buttons/ButtonPill/ButtonPill';

export default function DailyPointsInput() {
    const [cardio, setCardio] = useState<number | ''>(0);
    const [weights, setWeights] = useState<number | ''>(0);
 
  return (
    <div className={styles.daily_points_input}>
        <div className={styles.input}>
            <h5 className={styles.input_category}>Cardio</h5>
            <div className={styles.input_width_wrapper}>
                <Input 
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
                <Input 
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
