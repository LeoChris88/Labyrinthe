export const calculateScore = (tilesRevealed, timeInSeconds) => {
  const baseScore = tilesRevealed * 10;
  const timeBonus = Math.max(0, 1000 - timeInSeconds * 2);
  return Math.floor(baseScore + timeBonus);
};

export const saveScore = (pseudo, score, isVictory, level) => {
  const scores = getHighScores();

  const newEntry = {
    pseudo,
    score,
    level,
    date: Date.now()
  };

  scores.push(newEntry);
  localStorage.setItem('scores', JSON.stringify(scores));
  return newEntry;
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
  const scores = JSON.parse(localStorage.getItem("scores") || "[]");

  const sorted = scores.sort((a, b) => a.score - b.score);

  return sorted.slice(0, limit);
};

export const isHighScore = (score, limit = 10) => {
  const topScores = getTopScores(limit);
  if (topScores.length < limit) return true;
  return score > topScores[topScores.length - 1].score;
};

export const resetScores = () => {
  localStorage.setItem("scores", "[]");
};