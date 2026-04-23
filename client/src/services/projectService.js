import api from './api';

export const projectService = {
  getAll: async (params) => {
    const response = await api.get('/projects', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data.project;
  },

  create: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data.project;
  },

  update: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data.project;
  },

  delete: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  submitProposal: async (projectId, proposalData) => {
    const response = await api.post(`/projects/${projectId}/proposals`, proposalData);
    return response.data;
  },

  handleProposal: async (projectId, proposalId, status) => {
    // status: 'accepted' or 'rejected'
    const response = await api.put(`/projects/${projectId}/proposals/${proposalId}`, { status });
    return response.data;
  },

  completeProject: async (projectId, rating, comment) => {
    const response = await api.put(`/projects/${projectId}/complete`, { rating, comment });
    return response.data;
  },
};
