import React from 'react';
import styles from './RankBadge.module.css';
import { RANK_COLORS } from '../../utils/rankUtils';
import clsx from 'clsx';

const RankBadge = ({ rank, size = 'md', className }) => {
  const color = RANK_COLORS[rank] || RANK_COLORS.Apprentice;

  return (
    <div 
      className={clsx(styles.badge, styles[size], className)}
      style={{ 
        borderColor: color,
        color: color,
        '--glow-color': `${color}40`
      }}
    >
      <span className={styles.dot} style={{ backgroundColor: color }} />
      {rank}
    </div>
  );
};

export default RankBadge;
