import React from 'react';
import styles from './ReviewCard.module.css';
import StarRating from '../ui/StarRating';
import { formatDate } from '../../utils/formatters';

const ReviewCard = ({ review }) => {
  const {
    reviewer,
    rating,
    comment,
    createdAt,
    projectTitle
  } = review;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.reviewerInfo}>
          <div className={styles.avatar}>
            {reviewer.name.charAt(0)}
          </div>
          <div>
            <h5 className={styles.reviewerName}>{reviewer.name}</h5>
            <span className={styles.date}>{formatDate(createdAt)}</span>
          </div>
        </div>
        <StarRating rating={rating} size={14} />
      </div>

      <div className={styles.body}>
        {projectTitle && <h6 className={styles.projectTitle}>Project: {projectTitle}</h6>}
        <p className={styles.comment}>{comment}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
