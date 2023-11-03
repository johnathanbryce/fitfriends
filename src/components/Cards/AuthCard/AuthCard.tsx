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
    navigateTo?: any,
}

export default function AuthCard({children, title, subSection, buttonLabel, onClick, isLoading, navigateTo}: AuthCardProps) {
  
  
  return (
    <div className={styles.auth_card}>
      <h2 className={styles.title}> {title} </h2>
      <form className={styles.form} onClick={onClick} >
        {children}
        { buttonLabel ? <ButtonPill label={buttonLabel} isLoading={isLoading}/> : (null) }
        { subSection ? (
          <>
            <HorizontalLineBreak />
            <Link href={navigateTo}>{subSection} </Link>
          </>
        ) : (null)
        }
      </form>
    </div>
  )
}
