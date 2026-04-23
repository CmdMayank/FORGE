import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import clsx from 'clsx';
import { projectService } from '../services/projectService';
import { useDebounce } from '../hooks/useDebounce';
import styles from './Projects.module.css';
import ProjectCard from '../components/projects/ProjectCard';
import FilterPanel from '../components/projects/FilterPanel';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    requiredRank: '',
    minBudget: '',
    maxBudget: '',
    complexity: '',
    sort: '-createdAt',
    page: 1,
    limit: 10
  });

  const debouncedSearch = useDebounce(searchTerm, 300);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await projectService.getAll({
        ...filters,
        search: debouncedSearch
      });
      setProjects(data.projects);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: '',
      requiredRank: '',
      minBudget: '',
      maxBudget: '',
      complexity: '',
      sort: '-createdAt',
      page: 1,
      limit: 10
    });
    setSearchTerm('');
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header Section */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Explore Opportunities</h1>
            <p className={styles.subtitle}>Find your next high-impact project based on your rank.</p>
          </div>
          
          <div className={styles.searchBar}>
            <div className={styles.searchInputWrapper}>
              <Search className={styles.searchIcon} size={20} />
              <input
                type="text"
                placeholder="Search projects by title, skills, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <button 
              className={clsx(styles.filterToggle, showFilters && styles.filterActive)}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={20} />
              <span>Filters</span>
            </button>
          </div>
        </header>

        <div className={styles.layout}>
          {/* Sidebar / Filters */}
          <div className={clsx(styles.sidebar, showFilters && styles.sidebarVisible)}>
            <FilterPanel 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              onReset={handleResetFilters}
            />
          </div>

          {/* Main Content */}
          <main className={styles.main}>
            <div className={styles.resultsHeader}>
              <div className={styles.count}>
                Showing <strong>{projects.length}</strong> of <strong>{total}</strong> projects
              </div>
              <div className={styles.sort}>
                <label className={styles.sortLabel}>Sort by:</label>
                <select 
                  className={styles.sortSelect}
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                >
                  <option value="-createdAt">Newest First</option>
                  <option value="budget.max">Highest Budget</option>
                  <option value="requiredRank">Rank Required</option>
                </select>
              </div>
            </div>

            <div className={styles.grid}>
              <AnimatePresence mode="popLayout">
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <div key={i} className={styles.skeleton} />
                  ))
                ) : projects.length > 0 ? (
                  projects.map(project => (
                    <motion.div
                      key={project._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                    >
                      <ProjectCard project={project} />
                    </motion.div>
                  ))
                ) : (
                  <div className={styles.noResults}>
                    <Search size={64} className={styles.noResultsIcon} />
                    <h3>No projects found</h3>
                    <p>Try adjusting your filters or search terms.</p>
                    <Button variant="outline" onClick={handleResetFilters}>Clear All Filters</Button>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Pagination placeholder */}
            {total > filters.limit && (
              <div className={styles.pagination}>
                <Button 
                  variant="secondary" 
                  disabled={filters.page === 1}
                  onClick={() => handleFilterChange('page', filters.page - 1)}
                >
                  Previous
                </Button>
                <span className={styles.pageInfo}>Page {filters.page} of {Math.ceil(total / filters.limit)}</span>
                <Button 
                  variant="secondary"
                  disabled={filters.page >= Math.ceil(total / filters.limit)}
                  onClick={() => handleFilterChange('page', filters.page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Projects;
