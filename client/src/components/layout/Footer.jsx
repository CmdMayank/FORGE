import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Cpu, Layers, Mail } from 'lucide-react';
import clsx from 'clsx';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.info}>
            <Link to="/" className={styles.logo}>
              FORGE<span className={styles.dot}>.</span>
            </Link>
            <p className={styles.description}>
              Freelance Opportunities Ranked by Growth & Expertise. The premium marketplace for elite developers.
            </p>
            <div className={styles.socials}>
              <a href="#" className={styles.socialLink}><Globe size={20} /></a>
              <a href="#" className={styles.socialLink}><Cpu size={20} /></a>
              <a href="#" className={styles.socialLink}><Layers size={20} /></a>
              <a href="#" className={styles.socialLink}><Mail size={20} /></a>
            </div>
          </div>

          <div className={styles.linksColumn}>
            <h4 className={styles.columnTitle}>Platform</h4>
            <Link to="/projects" className={styles.footerLink}>Browse Projects</Link>
            <Link to="/leaderboard" className={styles.footerLink}>Leaderboard</Link>
            <Link to="/dashboard" className={styles.footerLink}>Developer Dashboard</Link>
          </div>

          <div className={styles.linksColumn}>
            <h4 className={styles.columnTitle}>Resources</h4>
            <a href="#" className={styles.footerLink}>Documentation</a>
            <a href="#" className={styles.footerLink}>Rank System</a>
            <a href="#" className={styles.footerLink}>Success Stories</a>
          </div>

          <div className={styles.linksColumn}>
            <h4 className={styles.columnTitle}>Legal</h4>
            <a href="#" className={styles.footerLink}>Privacy Policy</a>
            <a href="#" className={styles.footerLink}>Terms of Service</a>
            <a href="#" className={styles.footerLink}>Cookie Policy</a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} FORGE. Built for the elite.
          </p>
          <div className={styles.status}>
            <span className={styles.statusDot}></span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
