// ---- SCORE STORAGE PAR NIVEAU ----

// Retourne la clé de stockage pour un niveau donné
const getStorageKey = (level) => `labyrinth_scores_level_${level}`;

// Calcule le score (optionnel, à adapter si tu veux)
export const calculateScore = (tilesRevealed) => {
  return tilesRevealed;
};

// Sauvegarde d'un score pour un niveau donné
export const saveScore = (pseudo, score, level) => {
  const key = getStorageKey(level);

  const existing = JSON.parse(localStorage.getItem(key) || "[]");

  const newScore = {
    pseudo,
    score,
    level,
    date: new Date().toISOString(),
  };

  const updated = [...existing, newScore].sort((a, b) => a.score - b.score);

  localStorage.setItem(key, JSON.stringify(updated));

  return newScore;
};

// Récupère tous les scores d'un niveau
export const getHighScores = (level) => {
  const key = getStorageKey(level);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw).sort((a, b) => a.score - b.score);
  } catch (e) {
    console.error("Erreur lecture scores :", e);
    return [];
  }
};

// Récupère les X meilleurs scores d'un niveau
export const getTopScores = (level, limit = 3) => {
  const scores = getHighScores(level);
  return scores.slice(0, limit);
};

// Vérifie si un score entre dans le top du niveau
export const isHighScore = (score, level, limit = 10) => {
  const top = getTopScores(level, limit);
  if (top.length < limit) return true;
  return score < top[top.length - 1].score;
};

// Reset seulement un niveau
export const resetScores = (level) => {
  const key = getStorageKey(level);
  localStorage.removeItem(key);
};