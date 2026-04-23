import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, ArrowUp, ArrowDown, User } from 'lucide-react';
import { userService } from '../services/userService';
import clsx from 'clsx';
import styles from './Leaderboard.module.css';
import RankBadge from '../components/ui/RankBadge';
import Loader from '../components/ui/Loader';
import { Link } from 'react-router-dom';

const Leaderboard = () => {
  const [devs, setDevs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await userService.getLeaderboard();
        setDevs(data || []);
      } catch (error) {
        console.error('Failed to fetch leaderboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <Loader fullPage />;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <Trophy size={48} className={styles.trophy} />
          </div>
          <h1 className={styles.title}>Hall of Architects</h1>
          <p className={styles.subtitle}>The top 10 elite developers in the Forge ecosystem.</p>
        </div>

        <div className={styles.board}>
          <div className={styles.boardHeader}>
            <span className={styles.rankCol}>Rank</span>
            <span className={styles.userCol}>Developer</span>
            <span className={styles.tierCol}>Tier</span>
            <span className={styles.pointsCol}>Points</span>
          </div>

          <div className={styles.list}>
            {devs.map((dev, index) => {
              const pos = index + 1;
              return (
                <motion.div 
                  key={dev._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={clsx(styles.row, pos <= 3 && styles[`top${pos}`])}
                >
                  <div className={styles.rankCol}>
                    {pos <= 3 ? (
                      <Medal className={styles.medal} size={20} />
                    ) : (
                      <span className={styles.posText}>{pos}</span>
                    )}
                  </div>
                  
                  <div className={styles.userCol}>
                    <div className={styles.userCell}>
                      <div className={styles.avatar}>
                        {dev.name.charAt(0)}
                      </div>
                      <Link to={`/profile/${dev._id}`} className={styles.userName}>
                        {dev.name}
                      </Link>
                    </div>
                  </div>

                  <div className={styles.tierCol}>
                    <RankBadge rank={dev.rank} size="sm" />
                  </div>

                  <div className={styles.pointsCol}>
                    <span className={styles.pointsValue}>{dev.rankPoints || 0}</span>
                    <span className={styles.pointsLabel}>RP</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {devs.length === 0 && (
          <div className={styles.empty}>
            <p>The leaderboard is currently empty. Start forging to claim your spot!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
