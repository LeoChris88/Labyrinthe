const STORAGE_KEY = "labyrinth_scores";

export const calculateScore = (tilesRevealed) => {
  return tilesRevealed;
};

export const saveScore = (pseudo, score, level) => {
  const scores = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  const newScore = {
    pseudo,
    score,
    level,
    date: new Date().toISOString(),
  };

  scores.push(newScore);

  scores.sort((a, b) => a.score - b.score);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));

  return newScore;
};

export const getHighScores = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw).sort((a, b) => a.score - b.score);
  } catch (e) {
    console.error("Erreur lecture scores :", e);
    return [];
  }
};

export const getTopScores = (limit = 3) => {
  const scores = getHighScores();
  return scores.slice(0, limit);
};

export const isHighScore = (score, limit = 10) => {
  const top = getTopScores(limit);
  if (top.length < limit) return true;
  return score < top[top.length - 1].score;
};

export const resetScores = () => {
  localStorage.setItem(STORAGE_KEY, "[]");
};