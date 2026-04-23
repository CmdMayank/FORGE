import React from 'react';
import { motion } from 'framer-motion';
import styles from './Button.module.css';
import clsx from 'clsx';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  loading = false, 
  disabled = false,
  fullWidth = false,
  ...props 
}) => {
  const buttonVariants = {
    hover: { y: -2, boxShadow: '0 4px 12px rgba(133, 79, 108, 0.3)' },
    tap: { scale: 0.97 },
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? 'hover' : ''}
      whileTap={!disabled && !loading ? 'tap' : ''}
      variants={buttonVariants}
      className={clsx(
        styles.button,
        styles[variant],
        styles[size],
        loading && styles.loading,
        fullWidth && styles.fullWidth,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className={styles.loader}></span>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;
