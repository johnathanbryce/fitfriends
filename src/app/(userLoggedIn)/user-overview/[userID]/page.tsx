'use client'
import React, {useState} from 'react'
import styles from './user-overview.module.css'
// Internal Components
import Input from '@/components/Input/Input'
// External Libraries
import {IoIosArrowBack, IoIosArrowForward} from 'react-icons/io'
// Utility Functions
import { getCurrentDay, getCurrentMonth } from '@/utils/dateHelpers'

interface UserOverviewProps {
    params: any
}

// /user-overview/XXXXX
export default function UserOverview({params}: UserOverviewProps) {
    const currentDay = getCurrentDay();
    const currentMonth = getCurrentMonth();
    const currMonthAbbreviated = currentMonth.slice(0, 3)
  
    const previousWeek = () => {

    };
  
    const nextWeek = () => {

    };
  
    return (
        <section className={styles.user_overview}>
          <div className={styles.flex_wrapper_top}>
            <h4> Week: </h4>
            <div className={styles.week_toggle_container}>
              <IoIosArrowBack className={styles.arrow} onClick={previousWeek} />
                <div className={styles.date_range}>
                    <p>{currMonthAbbreviated}</p>
                    <p>{currentDay}</p>
                </div>
                 - 
                <div className={styles.date_range}>
                    <p>{currMonthAbbreviated}</p>
                    <p>{}</p>
                </div>
              <IoIosArrowForward className={styles.arrow} onClick={nextWeek} />
            </div>
          </div>

{/*           <div className={styles.days_container}>
            {days.map((day) => (
              <div key={day} className={styles.day}>{day}</div>
            ))}
          </div> */}
        </section>
      );
}
