import React, { useState } from 'react';
import styles from './ProposalForm.module.css';
import Input from '../ui/Input';
import Button from '../ui/Button';
import toast from 'react-hot-toast';
import { projectService } from '../../services/projectService';

const ProposalForm = ({ projectId, onSubmited }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    coverLetter: '',
    bidAmount: '',
    estimatedDays: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await projectService.submitProposal(projectId, formData);
      toast.success('Proposal submitted successfully!');
      setFormData({ coverLetter: '', bidAmount: '', estimatedDays: '' });
      if (onSubmited) onSubmited();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit proposal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Submit a Proposal</h4>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <Input
            label="Bid Amount ($)"
            name="bidAmount"
            type="number"
            value={formData.bidAmount}
            onChange={handleChange}
            required
            placeholder="0.00"
          />
          <Input
            label="Estimated Days"
            name="estimatedDays"
            type="number"
            value={formData.estimatedDays}
            onChange={handleChange}
            required
            placeholder="e.g. 7"
          />
        </div>
        
        <div className={styles.field}>
          <label className={styles.label}>Cover Letter</label>
          <textarea
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            required
            className={styles.textarea}
            placeholder="Describe why you're a good fit for this project..."
            rows={5}
          />
        </div>

        <Button type="submit" loading={loading} className={styles.submitBtn}>
          Submit Proposal
        </Button>
      </form>
    </div>
  );
};

export default ProposalForm;
