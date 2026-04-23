import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Plus, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { projectService } from '../services/projectService';
import styles from './Dashboard.module.css';
import StatsCard from '../components/dashboard/StatsCard';
import RankTracker from '../components/dashboard/RankTracker';
import ProjectCard from '../components/projects/ProjectCard';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, you'd have a specific dashboard endpoint
        // For now, let's fetch projects based on role
        if (currentUser.role === 'developer') {
          const recProjects = await projectService.getAll({ limit: 3 });
          setData({ recommended: recProjects.projects });
        } else {
          const myProjects = await projectService.getAll({ limit: 10 }); // Should be user's projects
          setData({ myProjects: myProjects.projects });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  if (loading) return <Loader fullPage />;

  const isDev = currentUser.role === 'developer';

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Welcome Section */}
        <header className={styles.header}>
          <div className={styles.welcome}>
            <h1 className={styles.title}>
              Welcome back, <span className={styles.name}>{currentUser.name}</span>
            </h1>
            <p className={styles.subtitle}>
              {isDev ? "Here's what's happening in your forge today." : "Manage your projects and elite talent."}
            </p>
          </div>
          {!isDev && (
            <Link to="/post-project">
              <Button>
                <Plus size={18} /> Post New Project
              </Button>
            </Link>
          )}
        </header>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          {isDev ? (
            <>
              <StatsCard label="Projects Completed" value="12" icon={CheckCircle} trend="up" trendValue="+2 this month" />
              <StatsCard label="Active Proposals" value="4" icon={Clock} />
              <StatsCard label="Total Earnings" value="$4,250" icon={DollarSign} trend="up" trendValue="+15%" />
              <StatsCard label="Rank Points" value="850" icon={TrendingUp} />
            </>
          ) : (
            <>
              <StatsCard label="Active Projects" value="3" icon={Briefcase} />
              <StatsCard label="Proposals Received" value="28" icon={TrendingUp} trend="up" trendValue="+8 new" />
              <StatsCard label="Total Spent" value="$12,400" icon={DollarSign} />
              <StatsCard label="Avg. Dev Rank" value="Senior" icon={CheckCircle} />
            </>
          )}
        </div>

        <div className={styles.mainGrid}>
          {/* Left Column */}
          <div className={styles.leftCol}>
            {isDev ? (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Recommended for You</h2>
                  <Link to="/projects" className={styles.viewAll}>
                    Explore All <ArrowRight size={14} />
                  </Link>
                </div>
                <div className={styles.projectList}>
                  {data?.recommended?.length > 0 ? (
                    data.recommended.map(project => (
                      <ProjectCard key={project._id} project={project} />
                    ))
                  ) : (
                    <div className={styles.emptyState}>
                      <AlertCircle size={40} className={styles.emptyIcon} />
                      <p>No recommended projects found for your rank.</p>
                    </div>
                  )}
                </div>
              </section>
            ) : (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Your Active Projects</h2>
                </div>
                <div className={styles.projectList}>
                  {data?.myProjects?.length > 0 ? (
                    data.myProjects.map(project => (
                      <ProjectCard key={project._id} project={project} />
                    ))
                  ) : (
                    <div className={styles.emptyState}>
                      <Plus size={40} className={styles.emptyIcon} />
                      <p>You haven't posted any projects yet.</p>
                      <Link to="/post-project">
                        <Button variant="outline" size="sm">Create One Now</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Right Column */}
          <aside className={styles.rightCol}>
            {isDev && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Your Progress</h2>
                <RankTracker 
                  currentRank={currentUser.rank || 'Junior'} 
                  points={850} 
                  nextRankPoints={1000} 
                />
              </section>
            )}

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Recent Activity</h2>
              <div className={styles.activityFeed}>
                <div className={styles.activityItem}>
                  <div className={styles.activityDot} />
                  <div className={styles.activityContent}>
                    <p className={styles.activityText}>Your proposal for <strong>E-commerce API</strong> was viewed.</p>
                    <span className={styles.activityTime}>2 hours ago</span>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <div className={styles.activityDot} />
                  <div className={styles.activityContent}>
                    <p className={styles.activityText}>You earned <strong>50 Rank Points</strong> for completion.</p>
                    <span className={styles.activityTime}>Yesterday</span>
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
