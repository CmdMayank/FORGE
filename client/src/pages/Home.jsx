import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, TrendingUp, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import styles from './Home.module.css';
import { projectService } from '../services/projectService';
import Button from '../components/ui/Button';
import ProjectCard from '../components/projects/ProjectCard';
import RankBadge from '../components/ui/RankBadge';
import { RANKS } from '../utils/rankUtils';

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const heroRef = useRef(null);
  const tickerRef = useRef(null);
  const howRef = useRef(null);
  const rankRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    // Fetch featured projects
    const fetchProjects = async () => {
      try {
        const data = await projectService.getAll({ limit: 3, status: 'open' });
        setFeaturedProjects(data.projects || []);
      } catch (error) {
        console.error('Failed to fetch featured projects', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();

    // GSAP Animations
    const ctx = gsap.context(() => {
      // Hero Animation
      const heroTl = gsap.timeline();
      heroTl.from(`.${styles.heroHeading} span`, {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power4.out'
      })
        .from(`.${styles.heroEyebrow}`, { opacity: 0, x: -20, duration: 0.5 }, '-=0.5')
        .from(`.${styles.heroBtns} button`, { opacity: 0, y: 20, duration: 0.5, stagger: 0.2 }, '-=0.3')
        .from(`.${styles.floatingCard}`, {
          opacity: 0,
          scale: 0.8,
          duration: 0.8,
          stagger: 0.1,
          ease: 'back.out(1.7)'
        }, '-=0.8');

      // Floating Cards Loop
      gsap.to(`.${styles.floatingCard}`, {
        y: 'random(-20, 20)',
        x: 'random(-10, 10)',
        rotation: 'random(-5, 5)',
        duration: 'random(2, 4)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          each: 0.2,
          from: 'random'
        }
      });

      // How It Works Stagger
      gsap.from(`.${styles.howCard}`, {
        scrollTrigger: {
          trigger: howRef.current,
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      });

      // Rank Track Animation
      gsap.from(`.${styles.rankNode}`, {
        scrollTrigger: {
          trigger: rankRef.current,
          start: 'top 70%',
        },
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: 'back.out(2)'
      });

      // Stats Count Up
      const counters = document.querySelectorAll(`.${styles.statValue}`);
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        gsap.to(counter, {
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
          },
          innerText: target,
          duration: 2,
          snap: { innerText: 1 },
          ease: 'power2.out'
        });
      });
    });

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const { left, top, width, height } = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const categories = ['Frontend', 'Backend', 'DevOps', 'AI/ML', 'Blockchain', 'UI/UX', 'Mobile'];

  return (
    <div className={styles.home}>
      {/* Background Decorative Elements */}
      <div className={styles.bgElements}>
        <div className={styles.gridOverlay}></div>
        <div className={clsx(styles.blob, styles.blob1)}></div>
        <div className={clsx(styles.blob, styles.blob2)}></div>
        <div className={clsx(styles.blob, styles.blob3)}></div>
        <div className={styles.codeParticle} style={{ top: '15%', left: '5%' }}>{'<section />'}</div>
        <div className={styles.codeParticle} style={{ top: '45%', left: '85%' }}>{'const forge = "legacy"'}</div>
        <div className={styles.codeParticle} style={{ top: '75%', left: '12%' }}>{'npm run deploy'}</div>
        <div className={styles.codeParticle} style={{ top: '25%', left: '70%' }}>{'import { growth } from "forge"'}</div>
      </div>

      {/* 1. Hero Section */}
      <section 
        ref={heroRef} 
        className={styles.hero}
        onMouseMove={handleMouseMove}
      >
        <div 
          className={styles.heroGlow} 
          style={{ 
            background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(170, 59, 255, 0.15) 0%, transparent 50%)` 
          }}
        ></div>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <span className={styles.heroEyebrow}>Redefining the Freelance Hierarchy</span>
              <h1 className={styles.heroHeading}>
                {"FORGE YOUR LEGACY IN CODE".split(" ").map((word, i) => (
                  <span key={i} className={styles.word}>
                    {word}
                  </span>
                ))}
              </h1>
              <p className={styles.heroSubtext}>
                The only marketplace where your rank dictates your opportunities.
                Climb from Apprentice to Architect through proven expertise.
              </p>
              <div className={styles.heroBtns}>
                <Link to="/register">
                  <Button size="lg" fullWidth>Start Building</Button>
                </Link>
                <Link to="/projects">
                  <Button variant="secondary" size="lg" fullWidth>Browse Projects</Button>
                </Link>
              </div>
            </div>
            <div className={styles.heroVisual}>
              {RANKS.map((rank, i) => (
                <div key={rank} className={clsx(styles.floatingCard, styles[`card${i}`])}>
                  <RankBadge rank={rank} size="md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Ticker */}
      <div className={styles.tickerContainer}>
        <div className={styles.ticker}>
          {[...categories, ...categories].map((cat, i) => (
            <span key={i} className={styles.tickerItem}>{cat}</span>
          ))}
        </div>
      </div>

      {/* 3. How It Works */}
      <section ref={howRef} className={styles.howItWorks}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>The Forge Protocol</h2>
            <p className={styles.sectionSubtitle}>A systematic approach to career evolution.</p>
          </div>
          <div className={styles.howGrid}>
            {[
              { id: '01', title: 'Submit Proposals', icon: Target, text: 'Apply for projects matching your current rank level.' },
              { id: '02', title: 'Ship Excellence', icon: ShieldCheck, text: 'Deliver high-quality code and earn verified endorsements.' },
              { id: '03', title: 'Rank Up', icon: TrendingUp, text: 'Accumulate Rank Points to unlock higher-tier, higher-pay contracts.' }
            ].map((step) => (
              <div key={step.id} className={styles.howCard}>
                <span className={styles.stepId}>{step.id}</span>
                <step.icon className={styles.howIcon} size={40} />
                <h3 className={styles.howTitle}>{step.title}</h3>
                <p className={styles.howText}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Rank System */}
      <section ref={rankRef} className={styles.rankSystem}>
        <div className={styles.container}>
          <div className={styles.rankTrackContainer}>
            <div className={styles.rankLine}></div>
            <div className={styles.rankNodes}>
              {RANKS.map((rank) => (
                <div key={rank} className={styles.rankNode}>
                  <div className={styles.nodeDot}></div>
                  <span className={styles.nodeLabel}>{rank}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Projects */}
      <section className={styles.featured}>
        <div className={styles.container}>
          <div className={styles.sectionHeaderFlex}>
            <div>
              <h2 className={styles.sectionTitle}>High-Yield Contracts</h2>
              <p className={styles.sectionSubtitle}>Available for immediate deployment.</p>
            </div>
            <Link to="/projects" className={styles.viewAll}>
              View All Projects <ChevronRight size={16} />
            </Link>
          </div>

          <div className={styles.projectGrid}>
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className={styles.skeletonCard} />)
            ) : (
              featuredProjects.map(project => (
                <ProjectCard key={project._id} project={project} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* 6. Stats */}
      <section ref={statsRef} className={styles.stats}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            {[
              { label: 'Verified Developers', target: 500, suffix: '+' },
              { label: 'Projects Completed', target: 1200, suffix: '+' },
              { label: 'Total Paid', target: 2, suffix: 'M+' },
              { label: 'Rank Tiers', target: 7, suffix: '' }
            ].map((stat, i) => (
              <div key={i} className={styles.statItem}>
                <div className={styles.statValueContainer}>
                  <h2 className={styles.statValue} data-target={stat.target}>0</h2>
                  <span className={styles.statSuffix}>{stat.suffix}</span>
                </div>
                <p className={styles.statLabel}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA Block */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaTitle}>Ready to Forge Your Future?</h2>
            <p className={styles.ctaText}>Join the elite network of developers and clients who value expertise over noise.</p>
            <Link to="/register">
              <Button size="lg" className={styles.ctaBtn}>Create Your Account</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
