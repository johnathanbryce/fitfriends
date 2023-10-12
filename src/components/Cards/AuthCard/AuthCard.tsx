import styles from './AuthCard.module.css'
// Internal Components
import ButtonPill from '@/components/Buttons/ButtonPill/ButtonPill'
import HorizontalLineBreak from '@/components/HorizontalLineBreak/HorizontalLineBreak'

interface AuthCardProps {
    children: any,
    title: string,
    isLoading: boolean,
    buttonLabel: string,
    onSubmit?: (e: any) => void;
    subSection?: string,
}

export default function AuthCard({children, title, subSection, buttonLabel, onSubmit, isLoading}: AuthCardProps) {
  return (
    <div className={styles.auth_card}>
      <h2 className={styles.title}> {title} </h2>
      <div className={styles.form} /* onSubmit={onSubmit} */>
        {children}
        {/* <ButtonPill label={buttonLabel} isLoading={isLoading}/> */}
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
