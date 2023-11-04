import React from 'react'
import styles from './LayoutSections.module.css'

interface LayoutSectionProps {
  children: any,
  bgColor?: string,
  title?: string
}

export default function LayoutSections({children, title, bgColor}: LayoutSectionProps) {
  let containerStyle: React.CSSProperties = {};

  // Check the bgColor prop and set the corresponding background color
  if (bgColor === 'white') {
    containerStyle.backgroundColor = '#F9F9F9';
  } else if (bgColor === 'orange') {
    containerStyle.backgroundColor = '#FF5722';
  } else if (bgColor === 'dark') {
    containerStyle.backgroundColor = '#263238';
  } 

  return (
    <div className={styles.container} style={containerStyle}>
      {title && <h2 className={bgColor === 'white' ? styles.section_title : styles.section_title_white}>{title}</h2>}
       {children}
    </div>
  )
}
