import styles from './AuthCard.module.css'
// Internal Components
import ButtonPill from '@/components/Buttons/ButtonPill/ButtonPill'
import HorizontalLineBreak from '@/components/HorizontalLineBreak/HorizontalLineBreak'

interface AuthCardProps {
    children: any,
    title: string,
    isLoading: boolean,
    buttonLabel?: string,
    onClick?: (email: any) => void;
    subSection?: string,
}

export default function AuthCard({children, title, subSection, buttonLabel, onClick, isLoading}: AuthCardProps) {
  return (
    <div className={styles.auth_card}>
      <h2 className={styles.title}> {title} </h2>
      <div className={styles.form} >
        {children}
        { buttonLabel ? <ButtonPill label={buttonLabel} onClick={onClick} isLoading={isLoading}/> : (null) }
        { subSection ? (
          <>
            <HorizontalLineBreak />
            <p> {subSection} </p>
          </>
        ) : (null)
        }
      </div>
    </div>
  )
}
