import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Briefcase, ChevronRight, ArrowLeft, Code } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import styles from './Register.module.css';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import TagInput from '../components/ui/TagInput';
import clsx from 'clsx';

const Register = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    skills: [],
    bio: ''
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      await register(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !formData.role) return;
    setStep(2);
  };

  const prevStep = () => setStep(1);

  return (
    <div className={styles.page}>
      <div className={styles.splitLayout}>
        {/* Left Panel */}
        <div className={styles.visualPanel}>
          <div className={styles.visualContent}>
            <Link to="/" className={styles.logo}>FORGE<span className={styles.dot}>.</span></Link>
            <h2 className={styles.visualTitle}>The Next Level Awaits.</h2>
            <p className={styles.visualText}>Join the elite marketplace. Set your role, showcase your skills, and start your evolution.</p>
          </div>
          <div className={styles.gradientOverlay}></div>
        </div>

        {/* Right Panel */}
        <div className={styles.formPanel}>
          <div className={styles.formContainer}>
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={styles.stepContent}
                >
                  <div className={styles.formHeader}>
                    <h1 className={styles.title}>Choose Your Path</h1>
                    <p className={styles.subtitle}>How do you intend to use the Forge?</p>
                  </div>

                  <div className={styles.roleGrid}>
                    <button 
                      className={clsx(styles.roleCard, formData.role === 'developer' && styles.activeRole)}
                      onClick={() => setFormData({ ...formData, role: 'developer' })}
                    >
                      <Code size={32} className={styles.roleIcon} />
                      <h3 className={styles.roleTitle}>Developer</h3>
                      <p className={styles.roleDesc}>Complete projects, earn RP, and level up your career.</p>
                    </button>
                    <button 
                      className={clsx(styles.roleCard, formData.role === 'client' && styles.activeRole)}
                      onClick={() => setFormData({ ...formData, role: 'client' })}
                    >
                      <Briefcase size={32} className={styles.roleIcon} />
                      <h3 className={styles.roleTitle}>Client</h3>
                      <p className={styles.roleDesc}>Post contracts, find elite talent, and ship products.</p>
                    </button>
                  </div>

                  <Button 
                    onClick={nextStep} 
                    disabled={!formData.role} 
                    size="lg" 
                    className={styles.nextBtn}
                  >
                    Continue <ChevronRight size={18} />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={styles.stepContent}
                >
                  <button onClick={prevStep} className={styles.backBtn}>
                    <ArrowLeft size={16} /> Back
                  </button>

                  <div className={styles.formHeader}>
                    <h1 className={styles.title}>Account Details</h1>
                    <p className={styles.subtitle}>Enter your information to finalize your registration.</p>
                  </div>

                  <form onSubmit={handleSubmit} className={styles.form}>
                    <Input
                      label="Full Name"
                      name="name"
                      icon={User}
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                    />
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      icon={Mail}
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                    />
                    <Input
                      label="Password"
                      name="password"
                      type="password"
                      icon={Lock}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />

                    {formData.role === 'developer' && (
                      <TagInput
                        label="Skills"
                        placeholder="Type skill and press Enter"
                        tags={formData.skills}
                        onAdd={handleAddSkill}
                        onRemove={handleRemoveSkill}
                      />
                    )}

                    <div className={styles.field}>
                      <label className={styles.label}>Bio</label>
                      <textarea
                        name="bio"
                        className={styles.textarea}
                        placeholder={formData.role === 'developer' ? "Tell clients about your expertise..." : "Describe your company or project needs..."}
                        value={formData.bio}
                        onChange={handleChange}
                        rows={3}
                      />
                    </div>

                    <Button type="submit" loading={loading} size="lg" className={styles.submitBtn}>
                      Create Account
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <p className={styles.footerText}>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
