import api from './api';

export const userService = {
  getLeaderboard: async () => {
    const response = await api.get('/users/leaderboard');
    return response.data.leaderboard;
  },

  getProfile: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data.user;
  },

  updateProfile: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data.user;
  },
};
