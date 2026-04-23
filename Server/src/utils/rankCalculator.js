const RANKS = ['Apprentice', 'Junior', 'Mid', 'Senior', 'Lead', 'Architect', 'Principal'];
const THRESHOLDS = [0, 50, 200, 500, 1200, 2500, 5000];

const COMPLEXITY_BONUS = { Low: 0, Medium: 25, High: 75, Expert: 150 };
const RATING_BONUS = { 5: 30, 4: 15, 3: 0, 2: 0, 1: 0 };

const getRankFromScore = (score) => {
  for (let i = THRESHOLDS.length - 1; i >= 0; i--) {
    if (score >= THRESHOLDS[i]) return RANKS[i];
  }
  return 'Apprentice';
};

const getRankIndex = (rank) => RANKS.indexOf(rank);

const canApply = (userRank, requiredRank) => {
  return getRankIndex(userRank) >= getRankIndex(requiredRank);
};

const calcProjectScore = (complexity, rating) => {
  const base = 50;
  const complexBonus = COMPLEXITY_BONUS[complexity] || 0;
  const ratingBonus = RATING_BONUS[Math.round(rating)] || 0;
  return base + complexBonus + ratingBonus;
};

const getRankProgress = (score) => {
  const rank = getRankFromScore(score);
  const idx = RANKS.indexOf(rank);
  const low = THRESHOLDS[idx];
  const high = THRESHOLDS[idx + 1] || 9999;
  return {
    rank,
    nextRank: RANKS[idx + 1] || null,
    progress: Math.min(((score - low) / (high - low)) * 100, 100).toFixed(1),
    scoreToNext: Math.max(0, high - score),
  };
};

module.exports = { RANKS, getRankFromScore, getRankIndex, canApply, calcProjectScore, getRankProgress };