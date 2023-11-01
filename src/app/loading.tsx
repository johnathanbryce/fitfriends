import styles from '../styles/loading.module.css';
// Next.js
import Image from 'next/image';
// Internal Assets
import logoTransparent from '../../public/images/logo-transparent.png'


const Loading = () => {
    return (
      <div className={styles.container}>
          <div className={styles.spinner}>
            {/* <Image src={logoTransparent} className={styles.logo} alt="Fit Friend's logo"/> */}
          </div>
      </div>
    );
  };
  
  export default Loading;