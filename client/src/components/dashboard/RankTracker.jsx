import React from 'react';
import styles from './RankTracker.module.css';
import { RANKS, getRankColor, getNextRank } from '../../utils/rankUtils';
import RankBadge from '../ui/RankBadge';
import ProgressRing from '../ui/ProgressRing';

const RankTracker = ({ currentRank, points, nextRankPoints }) => {
  const nextRank = getNextRank(currentRank);
  const progress = nextRankPoints ? (points / nextRankPoints) * 100 : 100;

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.textGroup}>
          <h4 className={styles.title}>Current Rank</h4>
          <RankBadge rank={currentRank} size="lg" />
        </div>
        
        {nextRank && (
          <div className={styles.nextRank}>
            <span className={styles.nextLabel}>Next: {nextRank}</span>
            <span className={styles.pointsNeeded}>{points} / {nextRankPoints} RP</span>
          </div>
        )}
      </div>

      <div className={styles.visual}>
        <ProgressRing 
          progress={progress} 
          size={140} 
          strokeWidth={10} 
          color={getRankColor(currentRank)}
          label="Progress"
        />
      </div>
    </div>
  );
};

export default RankTracker;
