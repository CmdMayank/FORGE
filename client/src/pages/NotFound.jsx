import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, AlertTriangle } from 'lucide-react';
import styles from './NotFound.module.css';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className={styles.page}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.content}
      >
        <div className={styles.iconContainer}>
          <AlertTriangle size={80} className={styles.icon} />
        </div>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Lost in the Void</h2>
        <p className={styles.text}>
          The page you are looking for has been disassembled or never existed in this forge.
        </p>
        <Link to="/">
          <Button size="lg" className={styles.btn}>
            <Home size={18} /> Return Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
