import { useState, useEffect } from 'react';
import { getTopScores, resetScores } from '../utils/score';
import Header from '../components/Header';
import './Scoreboard.css';

const Scoreboard = ({ isVictory, score, pseudo, level, onReplay, onBackHome }) => {
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    setHighScores(getTopScores(10));
  }, [level]);

  

  return (
    <div className="scoreboard-page">
      <Header title="Résultats" />

      <div className="scoreboard-container">

        {/* Résultat : Toujours victoire */}
        <div className="result-card victory">
          <h2 className="result-title"> Victoire !</h2>
          <div className="player-info">
            <p className="player-pseudo">{pseudo}</p>
            <p className="player-score">Score : {score}</p>
          </div>
        </div>

        <div className="highscores-section">
          <h3>Meilleurs Scores</h3>

          {highScores.length === 0 ? (
            <p>Aucun score enregistré</p>
          ) : (
            <table className="highscores-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Pseudo</th>
                  <th>Score</th>
                  <th>Niveau</th>
                </tr>
              </thead>

              <tbody>
                {highScores.map((entry, i) => (
                  <tr
                    key={i}
                    className={
                      entry.pseudo === pseudo && entry.score === score
                        ? 'current-player'
                        : ''
                    }
                  >
                    <td>{i + 1}</td>
                    <td>{entry.pseudo}</td>
                    <td>{entry.score}</td>
                    <td>{entry.level}</td>
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
