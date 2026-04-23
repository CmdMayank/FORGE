import React from 'react';
import styles from './SkillTag.module.css';
import clsx from 'clsx';

const SkillTag = ({ skill, variant = 'default', className }) => {
  return (
    <span className={clsx(styles.tag, styles[variant], className)}>
      {skill}
    </span>
  );
};

export default SkillTag;
