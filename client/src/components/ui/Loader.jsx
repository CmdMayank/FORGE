import React from 'react';
import styles from './Loader.module.css';

const Loader = ({ fullPage = false }) => {
  return (
    <div className={fullPage ? styles.fullPage : styles.container}>
      <div className={styles.spinner}>
        <div className={styles.inner}></div>
      </div>
      <p className={styles.text}>Forging...</p>
    </div>
  );
};

export default Loader;
