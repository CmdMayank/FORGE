import React from 'react';
import { Star } from 'lucide-react';
import styles from './StarRating.module.css';
import clsx from 'clsx';

const StarRating = ({ rating, max = 5, size = 16, className, interactive = false, onRatingChange }) => {
  return (
    <div className={clsx(styles.container, className)}>
      {[...Array(max)].map((_, i) => {
        const starValue = i + 1;
        const filled = starValue <= rating;
        
        return (
          <Star
            key={i}
            size={size}
            className={clsx(
              styles.star,
              filled ? styles.filled : styles.empty,
              interactive && styles.interactive
            )}
            onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
          />
        );
      })}
      {!interactive && rating > 0 && (
        <span className={styles.text}>{rating.toFixed(1)}</span>
      )}
    </div>
  );
};

export default StarRating;
