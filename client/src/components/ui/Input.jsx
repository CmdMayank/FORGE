import React from 'react';
import styles from './Input.module.css';
import clsx from 'clsx';

const Input = ({ 
  label, 
  error, 
  className, 
  type = 'text', 
  id,
  icon: Icon,
  compact = false,
  ...props 
}) => {
  return (
    <div className={clsx(styles.container, className)}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <div className={clsx(
        styles.inputWrapper, 
        error && styles.inputError,
        compact && styles.compact
      )}>
        {Icon && <Icon size={18} className={styles.icon} />}
        <input
          id={id}
          type={type}
          className={styles.input}
          {...props}
        />
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default Input;
