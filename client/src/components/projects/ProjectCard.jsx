import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, DollarSign, Briefcase, Zap } from 'lucide-react';
import styles from './ProjectCard.module.css';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';
import RankBadge from '../ui/RankBadge';
import SkillTag from '../ui/SkillTag';
import StatusChip from '../ui/StatusChip';

const ProjectCard = ({ project }) => {
  const {
    _id,
    title,
    description,
    budget,
    requiredRank,
    skills,
    category,
    status,
    createdAt,
    complexity
  } = project;

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 8px 32px rgba(133, 79, 108, 0.25)' }}
      whileTap={{ scale: 0.98 }}
      className={styles.card}
    >
      <Link to={`/projects/${_id}`} className={styles.link}>
        <div className={styles.header}>
          <div className={styles.categoryInfo}>
            <span className={styles.category}>{category}</span>
            <StatusChip status={status} />
          </div>
          <h3 className={styles.title}>{title}</h3>
        </div>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <DollarSign size={14} />
            <span>{formatCurrency(budget.min)} - {formatCurrency(budget.max)}</span>
          </div>
          <div className={styles.metaItem}>
            <Clock size={14} />
            <span>{formatRelativeTime(createdAt)}</span>
          </div>
          <div className={styles.metaItem}>
            <Zap size={14} />
            <span className={styles.complexity}>{complexity}</span>
          </div>
        </div>

        <p className={styles.description}>
          {description.length > 120 ? `${description.substring(0, 120)}...` : description}
        </p>

        <div className={styles.footer}>
          <div className={styles.skills}>
            {skills.slice(0, 3).map((skill, index) => (
              <SkillTag key={index} skill={skill} />
            ))}
            {skills.length > 3 && (
              <span className={styles.moreSkills}>+{skills.length - 3}</span>
            )}
          </div>
          <RankBadge rank={requiredRank} size="sm" />
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
