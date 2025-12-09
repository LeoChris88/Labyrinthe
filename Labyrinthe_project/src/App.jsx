import { useState, useEffect } from "react";
import Grid from "./game/Grid";

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
      <Grid PlayerPosition={PlayerPosition} gridSize={gridSize} />
    </div>
  );
}

export default App