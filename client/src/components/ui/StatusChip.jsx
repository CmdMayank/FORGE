import React from 'react';
import styles from './StatusChip.module.css';
import clsx from 'clsx';

const StatusChip = ({ status, className }) => {
  const normalizedStatus = status?.toLowerCase();
  
  return (
    <span className={clsx(styles.chip, styles[normalizedStatus], className)}>
      {status}
    </span>
  );
};

export default StatusChip;
