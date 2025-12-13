import { useState } from "react";
import Grid from "./game/Grid";
import Home from "./pages/Home";
import Scoreboard from "./pages/Scoreboard";
import { saveScore, isScoreEligible } from "./utils/score"; // ← Ajouter isScoreEligible
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
    isEligible: true,
  });

  const startGame = (pseudo, level) => {
    setGameData({ pseudo, level });
    setCurrentPage("game");
  };

  const goToScoreboard = ({ score, result }) => {

    const isEligible =
      result === "victory" && isScoreEligible(score, gameData.level);

    if (isEligible) {
      saveScore(gameData.pseudo, score, gameData.level);
    }

    setScoreData({
      score,
      pseudo: gameData.pseudo,
      level: gameData.level,
      isEligible,
      result,
    });

    setCurrentPage("scoreboard");
  };

  const replay = () => {
    setCurrentPage("game");
  };

  const goToHome = () => {
    setCurrentPage("home");
    setGameData({ level: 1, pseudo: "" });
  };

  const gridSize = 10;

  const handleTileClick = (x, y) => {
    setPlayerPos({ x, y });
  };

  return (
    <div className="App">

      {currentPage === "home" && (
        <Home onStartGame={startGame} />
      )}

      {currentPage === "game" && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "80px" }}>
          <Grid
            levelId={gameData.level}
            pseudo={gameData.pseudo}
            goToScoreboard={goToScoreboard}
          />
        </div>
      )}

      {currentPage === "scoreboard" && (
        <Scoreboard
          score={scoreData.score}
          pseudo={scoreData.pseudo}
          level={gameData.level}
          isEligible={scoreData.isEligible}
          onReplay={replay}
          onBackHome={goToHome}
        />
      )}

    </div>
  );
}

export default App;