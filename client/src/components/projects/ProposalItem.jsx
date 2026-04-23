import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X, Clock, DollarSign } from 'lucide-react';
import styles from './ProposalItem.module.css';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';
import Button from '../ui/Button';
import RankBadge from '../ui/RankBadge';

const ProposalItem = ({ proposal, onAction, isClient }) => {
  const {
    _id,
    developer,
    coverLetter,
    bidAmount,
    estimatedDays,
    status,
    createdAt
  } = proposal;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.item}
    >
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {developer.name.charAt(0)}
          </div>
          <div>
            <Link to={`/profile/${developer._id}`} className={styles.userName}>
              {developer.name}
            </Link>
            <div className={styles.userMeta}>
              <RankBadge rank={developer.rank} size="sm" />
              <span className={styles.time}>{formatRelativeTime(createdAt)}</span>
            </div>
          </div>
        </div>

        <div className={styles.bidInfo}>
          <div className={styles.bidItem}>
            <DollarSign size={14} className={styles.bidIcon} />
            <span className={styles.bidValue}>{formatCurrency(bidAmount)}</span>
          </div>
          <div className={styles.bidItem}>
            <Clock size={14} className={styles.bidIcon} />
            <span className={styles.bidValue}>{estimatedDays} days</span>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <p className={styles.coverLetter}>{coverLetter}</p>
      </div>

      {isClient && status === 'pending' && (
        <div className={styles.actions}>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => onAction(_id, 'accept')}
            className={styles.actionBtn}
          >
            <Check size={16} /> Accept
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => onAction(_id, 'reject')}
            className={styles.actionBtn}
          >
            <X size={16} /> Reject
          </Button>
        </div>
      )}

      {status !== 'pending' && (
        <div className={styles.statusBadge}>
          <span className={styles[status]}>{status}</span>
        </div>
      )}
    </motion.div>
  );
};

export default ProposalItem;
