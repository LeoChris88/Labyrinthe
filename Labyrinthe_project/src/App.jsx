import { useState, useEffect } from "react";
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

  // Rejouer avec le même pseudo et niveau
  const replay = () => {
    setCurrentPage("game");
  };

  const goToHome = () => {
    setCurrentPage("home");
    setGameData({ level: 1, pseudo: "" });
  };
  
  const gridSize = 10;

  useEffect(() => {
    function handleKey(e) {
      if (currentPage !== "game") return; // N'écouter les touches que pendant le jeu
      
      setPlayerPos(prev => {
        let { x, y } = prev;

        if (e.key === "ArrowUp" || e.key === "z") y = Math.max(0, y - 1);
        if (e.key === "ArrowDown" || e.key === "s") y = Math.min(gridSize - 1, y + 1);
        if (e.key === "ArrowLeft" || e.key === "q") x = Math.max(0, x - 1);
        if (e.key === "ArrowRight" || e.key === "d") x = Math.min(gridSize - 1, x + 1);

        return { x, y };
      });
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentPage]);

  // RENDU CONDITIONNEL ICI
  return (
    <div className="App">
      {currentPage === "home" && (
        <Home onStartGame={startGame} />
      )}

      {currentPage === "game" && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "80px" }}>
          <Grid PlayerPosition={PlayerPosition} gridSize={gridSize} />
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