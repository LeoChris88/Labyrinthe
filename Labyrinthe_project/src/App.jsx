import { useState, useEffect } from "react";
import Grid from "./game/Grid";
import Home from "./pages/Home";
import Scoreboard from "./pages/Scoreboard";
import { saveScore } from "./utils/score";
import "./App.css" ;

function App() {
  const [PlayerPosition, setPlayerPos] = useState({ x: 0, y: 0 });
  const gridSize = 10;

  useEffect(() => {
    function handleKey(e) {
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
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "80px" }}>
      <Grid playerPosition={playerPosition} gridSize={gridSize} />
    </div>
  );
}

return (
    <div className= "App">
      {currentPage === "home" && (
        <Home startGame={startGame} />
        )}

        {currentPage === 'game' && (
        <Game 
          level={gameData.level}
          pseudo={gameData.pseudo}
          onGameEnd={goToScoreboard}
        />
      )}

      {currentPage === 'scoreboard' && (
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
export default App