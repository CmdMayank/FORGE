export const RANK_COLORS = {
  Apprentice: '#6B7280',
  Junior: '#34D399',
  Mid: '#60A5FA',
  Senior: '#A78BFA',
  Lead: '#FBBF24',
  Architect: '#F87171',
  Principal: '#FCD34D'
};

export const RANKS = Object.keys(RANK_COLORS);

export const getRankColor = (rank) => {
  return RANK_COLORS[rank] || RANK_COLORS.Apprentice;
};

export const getNextRank = (currentRank) => {
  const index = RANKS.indexOf(currentRank);
  if (index === -1 || index === RANKS.length - 1) return null;
  return RANKS[index + 1];
};
