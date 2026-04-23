import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './ProgressRing.module.css';

const ProgressRing = ({ 
  progress = 0, 
  size = 120, 
  strokeWidth = 8, 
  color = 'var(--accent)',
  label
}) => {
  const circleRef = useRef(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    const offset = circumference - (progress / 100) * circumference;
    gsap.to(circleRef.current, {
      strokeDashoffset: offset,
      duration: 1.5,
      ease: 'power3.out'
    });
  }, [progress, circumference]);

  return (
    <div className={styles.container} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={styles.svg} style={{ overflow: 'visible' }}>
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--bg-deep)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Circle */}
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className={styles.labelContainer}>
        <span className={styles.progressText}>{Math.round(progress)}%</span>
        {label && <span className={styles.label}>{label}</span>}
      </div>
    </div>
  );
};

export default ProgressRing;
