import React from 'react';
import styles from './StatsCard.module.css';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const StatsCard = ({ label, value, icon: Icon, trend, trendValue }) => {
  return (
    <motion.div 
      whileHover={{ y: -4, backgroundColor: 'var(--bg-card-hover)' }}
      className={styles.card}
    >
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <div className={styles.iconContainer}>
          <Icon size={20} className={styles.icon} />
        </div>
      </div>
      <div className={styles.content}>
        <h3 className={styles.value}>{value}</h3>
        {trend && (
          <div className={clsx(styles.trend, trend === 'up' ? styles.up : styles.down)}>
            {trendValue}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;
