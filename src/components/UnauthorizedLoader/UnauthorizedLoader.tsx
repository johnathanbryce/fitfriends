import styles from './UnauthorizedLoader.module.css'

const UnauthorizedLoader = () => {
    return (
      <div className={styles.container}>
          <h5> You do not have permission to view this page. Returning to login...</h5>
          <div className={styles.spinner}></div>
      </div>
    );
  };
  
  export default UnauthorizedLoader;