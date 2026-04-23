import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Globe, 
  Cpu, 
  Layers, 
  Mail, 
  MapPin, 
  Calendar,
  Edit2,
  CheckCircle,
  Star,
  Zap,
  Award
} from 'lucide-react';
import { userService } from '../services/userService';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../hooks/useAuth';
import styles from './Profile.module.css';
import Button from '../components/ui/Button';
import RankBadge from '../components/ui/RankBadge';
import SkillTag from '../components/ui/SkillTag';
import ProgressRing from '../components/ui/ProgressRing';
import ReviewCard from '../components/profile/ReviewCard';
import Loader from '../components/ui/Loader';

const Profile = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userData = await userService.getProfile(id);
        const userReviews = await reviewService.getByUser(id);
        setUser(userData);
        setReviews(userReviews);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  if (loading) return <Loader fullPage />;
  if (!user) return <div>User not found</div>;

  const isOwnProfile = currentUser?._id === user._id;
  const isDev = user.role === 'developer';

  return (
    <div className={styles.page}>
      {/* Profile Hero */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.mainInfo}>
              <div className={styles.avatarContainer}>
                <div className={styles.avatar}>
                  {user.name.charAt(0)}
                </div>
                {isDev && (
                  <div className={styles.rankBadgeFloating}>
                    <RankBadge rank={user.rank} size="lg" />
                  </div>
                )}
              </div>
              
              <div className={styles.userHead}>
                <h1 className={styles.userName}>{user.name}</h1>
                <div className={styles.userMeta}>
                  <div className={styles.metaItem}><MapPin size={16} /> New York, USA</div>
                  <div className={styles.metaItem}><Calendar size={16} /> Joined March 2024</div>
                </div>
              </div>

              <div className={styles.socialLinks}>
                <a href="#"><Globe size={20} /></a>
                <a href="#"><Cpu size={20} /></a>
                <a href="#"><Layers size={20} /></a>
                <a href="#"><Mail size={20} /></a>
              </div>
            </div>

            <div className={styles.heroActions}>
              {isOwnProfile ? (
                <Button variant="secondary">
                  <Edit2 size={16} /> Edit Profile
                </Button>
              ) : (
                <Button>
                  <Mail size={16} /> Message {user.name.split(' ')[0]}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <ProgressRing 
              progress={isDev ? 85 : 100} 
              size={100} 
              color="var(--accent)" 
              label="Trust Score"
            />
          </div>
          <div className={styles.statCard}>
            <CheckCircle className={styles.statIcon} size={24} />
            <div className={styles.statContent}>
              <span className={styles.statValue}>{isDev ? '24' : '12'}</span>
              <span className={styles.statLabel}>Projects {isDev ? 'Done' : 'Posted'}</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <Star className={styles.statIcon} size={24} />
            <div className={styles.statContent}>
              <span className={styles.statValue}>4.9</span>
              <span className={styles.statLabel}>Avg. Rating</span>
            </div>
          </div>
          <div className={styles.statCard}>
            {isDev ? <Zap className={styles.statIcon} size={24} /> : <Award className={styles.statIcon} size={24} />}
            <div className={styles.statContent}>
              <span className={styles.statValue}>{isDev ? '1,240' : '98%'}</span>
              <span className={styles.statLabel}>{isDev ? 'Rank Points' : 'Satisfaction'}</span>
            </div>
          </div>
        </div>

        <div className={styles.mainLayout}>
          {/* Left Column */}
          <div className={styles.leftCol}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>About</h2>
              <p className={styles.bio}>
                {user.bio || "No bio provided yet. This user is focused on forging excellence in silence."}
              </p>
            </section>

            {isDev && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Expertise</h2>
                <div className={styles.skillsGrid}>
                  {user.skills?.map(skill => (
                    <SkillTag key={skill} skill={skill} variant="outline" />
                  ))}
                </div>
              </section>
            )}

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Reviews ({reviews.length})</h2>
              <div className={styles.reviewsList}>
                {reviews.length > 0 ? (
                  reviews.map(review => (
                    <ReviewCard key={review._id} review={review} />
                  ))
                ) : (
                  <p className={styles.emptyText}>No reviews yet.</p>
                )}
              </div>
            </section>
          </div>

          {/* Right Column - Certifications or Sidebar info */}
          <aside className={styles.rightCol}>
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Verification</h3>
              <div className={styles.verificationList}>
                <div className={styles.verifItem}>
                  <CheckCircle size={16} className={styles.verifIcon} />
                  <span>Email Verified</span>
                </div>
                <div className={styles.verifItem}>
                  <CheckCircle size={16} className={styles.verifIcon} />
                  <span>Identity Verified</span>
                </div>
                {isDev && (
                  <div className={styles.verifItem}>
                    <CheckCircle size={16} className={styles.verifIcon} />
                    <span>Skills Authenticated</span>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Profile;
