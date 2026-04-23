import React from 'react';
import styles from './FilterPanel.module.css';
import { RANKS } from '../../utils/rankUtils';
import Input from '../ui/Input';
import Button from '../ui/Button';

const CATEGORIES = ['Web Development', 'Mobile Development', 'Backend / API', 'DevOps / Cloud', 'Machine Learning / AI', 'Blockchain', 'Game Development', 'Open Source', 'Other'];
const COMPLEXITIES = ['Low', 'Medium', 'High', 'Expert'];

const FilterPanel = ({ filters, onFilterChange, onReset }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <h4 className={styles.title}>Filters</h4>
        <button onClick={onReset} className={styles.resetBtn}>Reset</button>
      </div>

      <div className={styles.section}>
        <h5 className={styles.sectionLabel}>Category</h5>
        <div className={styles.selectWrapper}>
          <select 
            name="category" 
            value={filters.category} 
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.section}>
        <h5 className={styles.sectionLabel}>Required Rank</h5>
        <div className={styles.selectWrapper}>
          <select 
            name="requiredRank" 
            value={filters.requiredRank} 
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">Any Rank</option>
            {RANKS.map(rank => (
              <option key={rank} value={rank}>{rank}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.section}>
        <h5 className={styles.sectionLabel}>Budget Range</h5>
        <div className={styles.budgetInputs}>
          <Input 
            type="number" 
            name="minBudget" 
            placeholder="Min" 
            value={filters.minBudget}
            onChange={handleChange}
            className={styles.budgetInput}
            compact
          />
          <span className={styles.separator}>-</span>
          <Input 
            type="number" 
            name="maxBudget" 
            placeholder="Max" 
            value={filters.maxBudget}
            onChange={handleChange}
            className={styles.budgetInput}
            compact
          />
        </div>
      </div>

      <div className={styles.section}>
        <h5 className={styles.sectionLabel}>Complexity</h5>
        <div className={styles.checkboxGroup}>
          {COMPLEXITIES.map(comp => (
            <label key={comp} className={styles.checkboxLabel}>
              <input 
                type="radio" 
                name="complexity" 
                value={comp}
                checked={filters.complexity === comp}
                onChange={handleChange}
              />
              <span className={styles.labelText}>{comp}</span>
            </label>
          ))}
          <label className={styles.checkboxLabel}>
            <input 
              type="radio" 
              name="complexity" 
              value=""
              checked={filters.complexity === ''}
              onChange={handleChange}
            />
            <span className={styles.labelText}>Any</span>
          </label>
        </div>
      </div>
    </aside>
  );
};

export default FilterPanel;
