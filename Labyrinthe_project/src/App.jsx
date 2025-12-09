import { useState } from "react";
import Grid from "./game/Grid";
import Home from "./pages/Home";
import Scoreboard from "./pages/Scoreboard";
import { saveScore } from "./utils/score";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [gameData, setGameData] = useState({
    level: 1,
    pseudo: "",
  });
  const [PlayerPosition, setPlayerPos] = useState({ x: 0, y: 0 });
  const [scoreData, setScoreData] = useState({
    isVictory: false,
    score: 0,
    pseudo: "",
  });

  // Navigation vers le jeu 
  const startGame = (pseudo, level = 1) => {
    setGameData({ pseudo, level });
    setCurrentPage("game");
  };

  // Navigation vers le scoreboard
  const goToScoreboard = (isVictory, score) => {
    saveScore(gameData.pseudo, score, isVictory, gameData.level);

    setScoreData({
      isVictory,
      score,
      pseudo: gameData.pseudo,
    });
    setCurrentPage("scoreboard");
  };

  // Rejouer
  const replay = () => {
    setCurrentPage("game");
  };

  const goToHome = () => {
    setCurrentPage("home");
    setGameData({ level: 1, pseudo: "" });
  };

  const gridSize = 10;

  // --- NOUVEAU : Déplacement via clic ---
  const handleTileClick = (x, y) => {
    setPlayerPos({ x, y });
  };

  // --- FIN : plus de useEffect clavier ---

  return (
    <div className="App">

      {currentPage === "home" && (
        <Home onStartGame={startGame} />
      )}

      {currentPage === "game" && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "80px" }}>
          <Grid
            PlayerPosition={PlayerPosition}
            gridSize={gridSize}
            onTileClick={handleTileClick}   // ← ajouté
            goToScoreboard={goToScoreboard} // si ton Grid l'utilise
          />
        </div>
      )}

      {currentPage === "scoreboard" && (
        <Scoreboard
          isVictory={scoreData.isVictory}
          score={scoreData.score}
          pseudo={scoreData.pseudo}
          onReplay={replay}
          onBackHome={goToHome}
        />
      )}

    </div>
  );
}

export default App;