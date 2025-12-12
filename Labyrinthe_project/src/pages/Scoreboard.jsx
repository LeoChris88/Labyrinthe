import { useState, useEffect } from 'react';
import { getTopScores, getPerfectScore, getMaxAllowedScore } from '../utils/score';
import Header from '../components/Header';
import './Scoreboard.css';

const Scoreboard = ({ 
  isVictory, 
  score, 
  pseudo, 
  level, 
  isEligible, 
  onReplay, 
  onBackHome 
}) => {

  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    console.log("=== SCOREBOARD CHARGÉ ===");
    console.log("Props reçues:", { isVictory, score, pseudo, level, isEligible });

    const scores = getTopScores(level, 3);
    console.log("Scores à afficher dans le jeu:", scores);

    setHighScores(scores);
  }, [level]);

  const perfectScore = getPerfectScore(level);
  const maxAllowed = getMaxAllowedScore(level);

  return (
    <div className="scoreboard-page">
      <Header title="Résultats" />

      <div className="scoreboard-container">
        <div className={`result-card ${isVictory ? 'victory' : 'defeat'}`}>
          <h2 className="result-title">
            {isEligible ? 'Niveau terminé !' : 'Défaite'}
          </h2>
          <div className="player-info">
            <p className="player-pseudo">{pseudo}</p>
            <p className="player-score">Score : {score} clics</p>

            {!isEligible && (
              <p className="eligibility-warning">
                Score non éligible !<br />
                Votre score doit être ≤ {maxAllowed} clics.<br />
                (Parcours parfait : {perfectScore} clics + 3 bonus)
              </p>
            )}

            {isEligible && perfectScore && (
              <p className="eligibility-info">
                Score enregistré ! <br/>
                Parcours parfait pour ce niveau : {perfectScore} clics
              </p>
            )}
          </div>
        </div>

        <div className="highscores-section">
          <h3>🏆 Top 3 - Niveau {level}</h3>

          {highScores.length === 0 ? (
            <p className="no-scores">Aucun score enregistré pour ce niveau</p>
          ) : (
            <table className="highscores-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Pseudo</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {highScores.map((entry, index) => (
                  <tr
                    key={`${entry.pseudo}-${entry.score}-${index}`}
                    className={
                      entry.pseudo === pseudo && entry.score === score && isEligible
                        ? 'current-player'
                        : ''
                    }
                  >
                    <td>#{index + 1}</td>
                    <td>{entry.pseudo}</td>
                    <td>{entry.score} clics</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="action-buttons">
          <button onClick={onReplay} className="btn btn-primary">
            Rejouer
          </button>

          {onBackHome && (
            <button onClick={onBackHome} className="btn btn-secondary">
              Accueil
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
