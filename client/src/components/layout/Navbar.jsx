import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User, LayoutDashboard, Briefcase, Trophy } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import styles from './Navbar.module.css';
import Button from '../ui/Button';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Projects', path: '/projects', icon: Briefcase },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  ];

  if (currentUser) {
    navLinks.unshift({ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard });
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          FORGE<span className={styles.dot}>.</span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          {navLinks.map((link) => (
            <NavLink 
              key={link.path} 
              to={link.path} 
              className={({ isActive }) => isActive ? styles.activeLink : styles.link}
            >
              {link.name}
            </NavLink>
          ))}
          
          {currentUser ? (
            <div className={styles.userSection}>
              <Link to={`/profile/${currentUser._id}`} className={styles.profileLink}>
                <div className={styles.avatar}>
                  {currentUser.name.charAt(0)}
                </div>
              </Link>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className={styles.authBtns}>
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Join Forge</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={styles.mobileMenu}
          >
            {navLinks.map((link) => (
              <NavLink 
                key={link.path} 
                to={link.path} 
                onClick={() => setIsOpen(false)}
                className={styles.mobileNavLink}
              >
                <link.icon size={18} />
                {link.name}
              </NavLink>
            ))}
            
            {currentUser ? (
              <>
                <Link 
                  to={`/profile/${currentUser._id}`} 
                  className={styles.mobileNavLink}
                  onClick={() => setIsOpen(false)}
                >
                  <User size={18} />
                  Profile
                </Link>
                <button onClick={handleLogout} className={styles.mobileLogoutBtn}>
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <div className={styles.mobileAuthBtns}>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className={styles.fullWidth}>Login</Button>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <Button variant="primary" className={styles.fullWidth}>Join Forge</Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
