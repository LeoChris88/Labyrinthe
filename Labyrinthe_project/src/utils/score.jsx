export const calculateScore = (tilesRevealed, timeInSeconds) => {
  const baseScore = tilesRevealed * 10;
  const timeBonus = Math.max(0, 1000 - timeInSeconds * 2);
  return Math.floor(baseScore + timeBonus);
};

export const saveScore = (pseudo, score, isVictory, level) => {
  const scores = getHighScores();

  const newScore = {
    pseudo,
    score,
    isVictory,
    level,
    date: new Date().toISOString(),
  };

  scores.push(newScore);
  localStorage.setItem('labyrinth_scores', JSON.stringify(scores));
  return newScore;
};
export const getHighScores = () => {
  try {
    const rawData = localStorage.getItem('labyrinth_scores');
    return rawData ? JSON.parse(rawData) : [];
  } catch (error) {
    console.error('lecture des scores échouée :', error);
    return [];
  }
};
export const getTopScores = (limit = 10) => {
  const scores = getHighScores();

  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

export const isHighScore = (score, limit = 10) => {
  const topScores = getTopScores(limit);
  if (topScores.length < limit) return true;
  return score > topScores[topScores.length - 1].score;
};