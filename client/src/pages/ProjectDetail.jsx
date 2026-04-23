import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Clock, 
  DollarSign, 
  Briefcase, 
  Zap, 
  ChevronLeft, 
  User, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { projectService } from '../services/projectService';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency, formatDate } from '../utils/formatters';
import styles from './ProjectDetail.module.css';
import Button from '../components/ui/Button';
import RankBadge from '../components/ui/RankBadge';
import SkillTag from '../components/ui/SkillTag';
import StatusChip from '../components/ui/StatusChip';
import Loader from '../components/ui/Loader';
import ProposalForm from '../components/projects/ProposalForm';
import ProposalItem from '../components/projects/ProposalItem';

const ProjectDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProposalForm, setShowProposalForm] = useState(false);

  const fetchProject = async () => {
    try {
      const data = await projectService.getById(id);
      setProject(data);
    } catch (error) {
      console.error('Failed to fetch project', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  if (loading) return <Loader fullPage />;
  if (!project) return <div>Project not found</div>;

  const isOwner = currentUser?._id === project.client._id;
  const isDev = currentUser?.role === 'developer';
  const hasSubmitted = project.proposals?.some(p => p.developer._id === currentUser?._id);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <Link to="/projects" className={styles.backBtn}>
          <ChevronLeft size={16} /> Back to Projects
        </Link>

        <div className={styles.layout}>
          {/* Main Info */}
          <main className={styles.main}>
            <div className={styles.header}>
              <div className={styles.badges}>
                <StatusChip status={project.status} />
                <span className={styles.category}>{project.category}</span>
              </div>
              <h1 className={styles.title}>{project.title}</h1>
              
              <div className={styles.clientInfo}>
                <div className={styles.avatar}>
                  {project.client.name.charAt(0)}
                </div>
                <div>
                  <span className={styles.postedBy}>Posted by</span>
                  <Link to={`/profile/${project.client._id}`} className={styles.clientName}>
                    {project.client.name}
                  </Link>
                </div>
                <div className={styles.dot} />
                <span className={styles.postedDate}>{formatDate(project.createdAt)}</span>
              </div>
            </div>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Project Description</h2>
              <div className={styles.description}>
                {project.description}
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Required Expertise</h2>
              <div className={styles.skillsGrid}>
                {project.skills.map((skill, index) => (
                  <SkillTag key={index} skill={skill} variant="outline" />
                ))}
              </div>
            </section>

            {isOwner && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Proposals ({project.proposals?.length || 0})</h2>
                <div className={styles.proposalsList}>
                  {project.proposals?.length > 0 ? (
                    project.proposals.map(proposal => (
                      <ProposalItem 
                        key={proposal._id} 
                        proposal={proposal} 
                        isClient={true}
                        onAction={async (pid, action) => {
                          const status = action === 'accept' ? 'accepted' : 'rejected';
                          await projectService.handleProposal(project._id, pid, status);
                          fetchProject();
                        }}
                      />
                    ))
                  ) : (
                    <p className={styles.emptyText}>No proposals received yet.</p>
                  )}
                </div>
              </section>
            )}
          </main>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.stickySide}>
              <div className={styles.card}>
                <div className={styles.cardItem}>
                  <div className={styles.cardIcon}><DollarSign size={20} /></div>
                  <div className={styles.cardContent}>
                    <span className={styles.cardLabel}>Budget Range</span>
                    <span className={styles.cardValue}>
                      {formatCurrency(project.budget.min)} - {formatCurrency(project.budget.max)}
                    </span>
                  </div>
                </div>

                <div className={styles.cardItem}>
                  <div className={styles.cardIcon}><Calendar size={20} /></div>
                  <div className={styles.cardContent}>
                    <span className={styles.cardLabel}>Timeline</span>
                    <span className={styles.cardValue}>{project.timeline}</span>
                  </div>
                </div>

                <div className={styles.cardItem}>
                  <div className={styles.cardIcon}><Zap size={20} /></div>
                  <div className={styles.cardContent}>
                    <span className={styles.cardLabel}>Complexity</span>
                    <span className={styles.cardValue}>{project.complexity}</span>
                  </div>
                </div>

                <div className={styles.cardItem}>
                  <div className={styles.cardIcon}><Briefcase size={20} /></div>
                  <div className={styles.cardContent}>
                    <span className={styles.cardLabel}>Required Rank</span>
                    <div className={styles.rankBadge}>
                      <RankBadge rank={project.requiredRank} size="sm" />
                    </div>
                  </div>
                </div>

                {isDev && project.status === 'open' && (
                  <div className={styles.ctaArea}>
                    {hasSubmitted ? (
                      <div className={styles.submittedMsg}>
                        <AlertCircle size={18} />
                        <span>You have already applied</span>
                      </div>
                    ) : (
                      <Button 
                        size="lg" 
                        className={styles.applyBtn}
                        onClick={() => setShowProposalForm(true)}
                      >
                        Submit Proposal
                      </Button>
                    )}
                  </div>
                )}

                {isOwner && project.status === 'in_progress' && (
                  <div className={styles.ctaArea}>
                    <Button 
                      size="lg" 
                      variant="primary" 
                      className={styles.applyBtn}
                      onClick={async () => {
                        const rating = prompt('Rate the developer (1-5):', '5');
                        const comment = prompt('Leave a review:', 'Excellent work!');
                        if (rating) {
                          await projectService.completeProject(project._id, parseInt(rating), comment);
                          fetchProject();
                        }
                      }}
                    >
                      Mark as Completed
                    </Button>
                  </div>
                )}
              </div>

              {showProposalForm && (
                <div className={styles.formContainer}>
                  <ProposalForm 
                    projectId={project._id} 
                    onSubmited={() => {
                      setShowProposalForm(false);
                      fetchProject();
                    }} 
                  />
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
