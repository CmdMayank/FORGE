import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import styles from './Login.module.css';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import RankBadge from '../components/ui/RankBadge';
import { RANKS } from '../utils/rankUtils';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.splitLayout}>
        {/* Left Panel */}
        <div className={styles.visualPanel}>
          <div className={styles.visualContent}>
            <Link to="/" className={styles.logo}>FORGE<span className={styles.dot}>.</span></Link>
            <h2 className={styles.visualTitle}>Welcome Back to the Elite.</h2>
            <p className={styles.visualText}>Access your contracts, track your rank, and continue your evolution.</p>
            
            <div className={styles.badgeCloud}>
              {RANKS.slice(3).map((rank, i) => (
                <motion.div
                  key={rank}
                  animate={{ 
                    y: [0, -10, 0],
                    x: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 4 + i, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className={styles.floatingBadge}
                >
                  <RankBadge rank={rank} size="md" />
                </motion.div>
              ))}
            </div>
          </div>
          <div className={styles.gradientOverlay}></div>
        </div>

        {/* Right Panel */}
        <div className={styles.formPanel}>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={styles.formContainer}
          >
            <div className={styles.formHeader}>
              <h1 className={styles.title}>Sign In</h1>
              <p className={styles.subtitle}>Enter your credentials to access the forge.</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                label="Email Address"
                name="email"
                type="email"
                icon={Mail}
                placeholder="architect@forge.com"
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
                autoComplete="current-password"
              />

              <div className={styles.forgotPass}>
                <a href="#">Forgot password?</a>
              </div>

              <Button type="submit" loading={loading} size="lg" className={styles.submitBtn}>
                Login to Account <ArrowRight size={18} />
              </Button>
            </form>

            <p className={styles.footerText}>
              Don't have an account? <Link to="/register">Create one for free</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
