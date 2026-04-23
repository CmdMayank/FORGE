import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Info, 
  Briefcase, 
  Code, 
  Settings,
  Eye
} from 'lucide-react';
import styles from './PostProject.module.css';
import { projectService } from '../services/projectService';
import { RANKS } from '../utils/rankUtils';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import TagInput from '../components/ui/TagInput';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const PostProject = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (currentUser && currentUser.role !== 'client') {
      toast.error('Only clients can forge new projects');
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    requiredRank: 'Junior',
    skills: [],
    budget: { min: '', max: '' },
    timeline: '',
    complexity: 'Medium'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('budget.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        budget: { ...prev.budget, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSkill = (skill) => {
    setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
  };

  const handleRemoveSkill = (skill) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        timeline: parseInt(formData.timeline) || 0
      };
      const project = await projectService.create(payload);
      toast.success('Project forged successfully!');
      navigate(`/projects/${project._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const categories = ['Web Development', 'Mobile Development', 'Backend / API', 'DevOps / Cloud', 'Machine Learning / AI', 'Blockchain', 'Game Development', 'Open Source', 'Other'];
  const complexities = ['Low', 'Medium', 'High', 'Expert'];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Forge a New Project</h1>
          <p className={styles.subtitle}>Define your requirements and find elite developers.</p>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${(step / 3) * 100}%` }} />
          </div>
          <div className={styles.steps}>
            <div className={clsx(styles.step, step >= 1 && styles.stepActive)}>1. Basics</div>
            <div className={clsx(styles.step, step >= 2 && styles.stepActive)}>2. Requirements</div>
            <div className={clsx(styles.step, step >= 3 && styles.stepActive)}>3. Review</div>
          </div>
        </div>

        <div className={styles.formBox}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={styles.stepContent}
              >
                <h2 className={styles.stepTitle}><Briefcase /> Core Details</h2>
                <div className={styles.formGroup}>
                  <Input
                    label="Project Title"
                    name="title"
                    placeholder="e.g. Build a High-Throughput Matching Engine"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                  <div className={styles.field}>
                    <label className={styles.label}>Description</label>
                    <textarea
                      name="description"
                      className={styles.textarea}
                      placeholder="Detail the technical requirements, goals, and deliverables..."
                      value={formData.description}
                      onChange={handleChange}
                      rows={6}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Category</label>
                    <select 
                      name="category" 
                      value={formData.category} 
                      onChange={handleChange}
                      className={styles.select}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>
                <div className={styles.actions}>
                  <Button onClick={nextStep} className={styles.nextBtn}>
                    Next: Requirements <ChevronRight size={18} />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={styles.stepContent}
              >
                <h2 className={styles.stepTitle}><Settings /> Technical Scope</h2>
                <div className={styles.formGroup}>
                  <div className={styles.field}>
                    <label className={styles.label}>Required Developer Rank</label>
                    <div className={styles.rankPicker}>
                      {RANKS.map(rank => (
                        <button
                          key={rank}
                          type="button"
                          className={clsx(styles.rankOption, formData.requiredRank === rank && styles.activeRank)}
                          onClick={() => setFormData({ ...formData, requiredRank: rank })}
                        >
                          {rank}
                        </button>
                      ))}
                    </div>
                  </div>

                  <TagInput
                    label="Necessary Skills"
                    placeholder="e.g. React, Node.js, AWS"
                    tags={formData.skills}
                    onAdd={handleAddSkill}
                    onRemove={handleRemoveSkill}
                  />

                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label className={styles.label}>Budget (Min $)</label>
                      <Input
                        name="budget.min"
                        type="number"
                        placeholder="1000"
                        value={formData.budget.min}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Budget (Max $)</label>
                      <Input
                        name="budget.max"
                        type="number"
                        placeholder="5000"
                        value={formData.budget.max}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.row}>
                    <Input
                      label="Timeline (Days)"
                      name="timeline"
                      type="number"
                      placeholder="e.g. 21"
                      value={formData.timeline}
                      onChange={handleChange}
                      required
                    />
                    <div className={styles.field}>
                      <label className={styles.label}>Complexity</label>
                      <select 
                        name="complexity" 
                        value={formData.complexity} 
                        onChange={handleChange}
                        className={styles.select}
                      >
                        {complexities.map(comp => <option key={comp} value={comp}>{comp}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div className={styles.actions}>
                  <Button variant="secondary" onClick={prevStep}><ChevronLeft size={18} /> Back</Button>
                  <Button onClick={nextStep} className={styles.nextBtn}>
                    Final Review <ChevronRight size={18} />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={styles.stepContent}
              >
                <h2 className={styles.stepTitle}><Eye /> Project Preview</h2>
                <div className={styles.previewBox}>
                  <div className={styles.previewHeader}>
                    <h3 className={styles.previewTitle}>{formData.title || 'Untitled Project'}</h3>
                    <span className={styles.previewCategory}>{formData.category}</span>
                  </div>
                  <p className={styles.previewDesc}>{formData.description}</p>
                  <div className={styles.previewMeta}>
                    <div className={styles.metaItem}><strong>Rank:</strong> {formData.requiredRank}</div>
                    <div className={styles.metaItem}><strong>Budget:</strong> ${formData.budget.min} - ${formData.budget.max}</div>
                    <div className={styles.metaItem}><strong>Timeline:</strong> {formData.timeline}</div>
                  </div>
                  <div className={styles.previewSkills}>
                    {formData.skills.map(skill => <span key={skill} className={styles.previewSkill}>{skill}</span>)}
                  </div>
                </div>
                <div className={styles.actions}>
                  <Button variant="secondary" onClick={prevStep}><ChevronLeft size={18} /> Edit</Button>
                  <Button onClick={handleSubmit} loading={loading} className={styles.nextBtn}>
                    Forge Project <Check size={18} />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PostProject;
