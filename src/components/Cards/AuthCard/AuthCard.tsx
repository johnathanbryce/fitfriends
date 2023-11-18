import styles from './AuthCard.module.css'
// Next.js
import Link from 'next/link';
// Internal Components
import ButtonPill from '@/components/Buttons/ButtonPill/ButtonPill'
import HorizontalLineBreak from '@/components/HorizontalLineBreak/HorizontalLineBreak'

interface AuthCardProps {
    children: any,
    title: string,
    isLoading: boolean,
    buttonLabel?: string,
    onClick?: (e: any) => void;
    subSection?: string,
    subSectionTwo? : string,
    navigateToSubSection?: any,
    navigateToSubSectionTwo?: any,
}

export default function AuthCard({children, title, subSection, subSectionTwo, buttonLabel, onClick, isLoading, navigateToSubSection, navigateToSubSectionTwo}: AuthCardProps) {
  return (
    <div className={styles.auth_card}>
      <h3 className={styles.title}> {title} </h3>
      <form className={styles.form} onClick={onClick} >
        {children}
        { buttonLabel ? <ButtonPill label={buttonLabel} isLoading={isLoading}/> : (null) }
        { subSection &&
          <>
            <HorizontalLineBreak />
            <Link href={navigateToSubSection} className={styles.sub_section_text}>{subSection} </Link>
          </>
        }
        { subSectionTwo &&
            <Link href={navigateToSubSectionTwo} className={styles.sub_section_text}>{subSectionTwo} </Link>
        }
      </form>
    </div>
  )
}
