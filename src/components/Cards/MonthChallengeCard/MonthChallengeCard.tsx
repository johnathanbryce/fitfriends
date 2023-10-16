'use client'
import {useState} from 'react'
import styles from './MonthChallengeCard.module.css'
// Utility Functions
import {countDownToNextMonth} from '../../../utils/countDownToNextMonth'

interface MonthChallengeCardProps {
    index?: any,
    month: string,
    isActive: boolean,
    handleChallengeClick?: (isActive: boolean) => void,
}

export default function MonthChallengeCard({index, month, isActive, handleChallengeClick}: MonthChallengeCardProps) {
    const [notifyUser, setNotifyUser] = useState('');
    const [toggleNotification, setToggleNotification] = useState(false);
    
    const countdownStringCurrentMonth = countDownToNextMonth(1); // Next month

    const handleClick = () => {
        setNotifyUser(`challenge will be active in ${countdownStringCurrentMonth}`)
        if (handleChallengeClick) {
            handleChallengeClick(isActive);
        }
    };

    const toggleNotifyUser = () => {
        setToggleNotification(prev => !prev)
    }

    const disableButton = index === 1 || index === 2

  return (
    <div onClick={toggleNotifyUser} className={styles.challenge_card_container}>
        <button 
            onClick={handleClick} 
            disabled={disableButton ? true : false }
            className={`${styles.month_card_btn} ${isActive ? styles.active_challenge : ''} ${disableButton ? styles.disabled : ''}`}
         >
            <h3>
                {toggleNotification && !isActive ? (
                    <span className={styles.notify_user}>{notifyUser}</span>
                ) : (
                    month
                )}
            </h3>
        </button>
    </div>
  )
}
