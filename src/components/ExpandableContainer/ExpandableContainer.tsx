'use client'
import styles from './Expandable.module.css'
import { useState } from 'react'
// internal components
import HorizontalLineBreak from '@/components/HorizontalLineBreak/HorizontalLineBreak'
// external libraries
import {AiOutlinePlus, AiOutlineMinus} from 'react-icons/ai'

interface ExpandableContainerProps {
    title: any,
    isOpenDefault?: true;
    children: any
}

function ExpandableContainer({title, isOpenDefault, children}: ExpandableContainerProps) {
  const [isExpanded, setIsExpanded] = useState(isOpenDefault ? true : false);

  const toggleExpand = () =>{
    setIsExpanded((prev) => !prev)
  }

  
  return (
    <div className={styles.expandable_container}>
        <div onClick={toggleExpand}>
            <div className={styles.content_flex_wrapper}>
                <h4> {title}</h4>
                {isExpanded ? 
                    <div > <AiOutlineMinus className={styles.toggle_icon}/> </div> :
                    <div > <AiOutlinePlus className={styles.toggle_icon}/> </div>
                }
            </div>
            <HorizontalLineBreak />
        </div>
        
        {isExpanded &&
            <div className={`${styles.expandable_content} ${isExpanded ? styles.expanded : ''}`}>
                {children}
            </div>
        }
    </div>
  )
}

export default ExpandableContainer