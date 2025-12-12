// ---- SCORE STORAGE PAR NIVEAU ----

// Retourne la clé de stockage pour un niveau donné
const getStorageKey = (level) => `labyrinth_scores_level_${level}`;
const PERFECT_SCORES = {
  1: 11, // Niveau 1: 11 clics minimum
  2: 15, // Niveau 2: 15 clics minimu
  3: 20, // Niveau 3: 20 clics minimum
};

// Marge autorisée pour être dans les meilleurs scores
const MAX_EXTRA_CLICKS = 3;

export const isScoreEligible = (score, level) => {
  const perfectScore = PERFECT_SCORES[level] || 999;
  const maxAllowed = perfectScore + MAX_EXTRA_CLICKS;

  console.log("Vérification éligibilité:");
  console.log(`Niveau ${level} - Parfait: ${perfectScore} | Max autorisé: ${maxAllowed} | Score: ${score}`);
  
  return score <= maxAllowed;
}

// Calcule le score
export const calculateScore = (tilesRevealed) => {
  return tilesRevealed;
};

// Sauvegarde d'un score pour un niveau donné
export const saveScore = (pseudo, score, level) => {
  console.log("SAUVEGARDE SCORE:", { pseudo, score, level });

  if (!isScoreEligible(score, level)) {
    console.log("Score non éligible, non sauvegardé.");
    return null;
  }
  
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
  
  console.log("Score sauvegardé dans", key);
  console.log("Tous les scores de ce niveau:", updated);

  return newScore;
};

// Récupère tous les scores d'un niveau
export const getHighScores = (level) => {
  const key = getStorageKey(level);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      console.log("Aucun score trouvé pour le niveau", level);
      return [];
    }
    const scores = JSON.parse(raw).sort((a, b) => a.score - b.score);
    console.log("Scores récupérés pour niveau", level, ":", scores);
    return scores;
  } catch (e) {
    console.error("Erreur lecture scores:", e);
    return [];
  }
};

// Récupère les X meilleurs scores d'un niveau
export const getTopScores = (level, limit = 3) => {
  console.log("Top des joueurs", limit, "scores du niveau", level);
  const scores = getHighScores(level);
  const top = scores.slice(0, limit);
  console.log("Top", limit, "scores:", top);
  return top;
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
  console.log("Scores supprimés pour le niveau", level);
};

// Obtenir le parcours parfait d'un niveau (pour affichage)
export const getMaxAllowedScore = (level) => {
  const perfectScore = PERFECT_SCORES[level] || 999;
  return perfectScore + MAX_EXTRA_CLICKS;
}

// Obtenir le parcours parfait d'un niveau (pour affichage)
export const getPerfectScore = (level) => {
  return PERFECT_SCORES[level] || null;
};