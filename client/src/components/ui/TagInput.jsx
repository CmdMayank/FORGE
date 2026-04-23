import React, { useState } from 'react';
import { X } from 'lucide-react';
import styles from './TagInput.module.css';
import clsx from 'clsx';

const TagInput = ({ tags, onAdd, onRemove, placeholder, label, error }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) {
        onAdd(input.trim());
      }
      setInput('');
    }
  };

  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={clsx(styles.inputWrapper, error && styles.error)}>
        <div className={styles.tagsArea}>
          {tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
              <button type="button" onClick={() => onRemove(tag)} className={styles.removeBtn}>
                <X size={12} />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ''}
            className={styles.input}
          />
        </div>
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default TagInput;
