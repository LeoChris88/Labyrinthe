import { useEffect, useState } from "react";

function Grid({ PlayerPosition, gridSize, onTileClick, goToScoreboard }) {
  const [grid, setGrid] = useState([]);
  const [revealed, setRevealed] = useState([]);

  useEffect(() => {
    const newGrid = [];

    for (let x = 0; x < gridSize; x++) {
      newGrid[x] = [];
      for (let y = 0; y < gridSize; y++) {
        newGrid[x][y] = Math.random() < 0.15 ? "#" : ".";
      }
    }

    newGrid[gridSize - 1][gridSize - 1] = "E";

    setGrid(newGrid);

    setRevealed([[PlayerPosition.x, PlayerPosition.y]]);

  }, [gridSize]);

  const isAdjacent = (x, y) => {
    const px = PlayerPosition.x;
    const py = PlayerPosition.y;

    return (
      (x === px + 1 && y === py) ||
      (x === px - 1 && y === py) ||
      (x === px && y === py + 1) ||
      (x === px && y === py - 1)
    );
  };

  const handleClick = (x, y) => {
    if (!isAdjacent(x, y)) return;

    const cell = grid[x][y];

    setRevealed(prev => [...prev, [x, y]]);

    if (cell === "#") {
      console.log("Mur !");
      return;
    }

    onTileClick(x, y);

    if (cell === "E") {
      goToScoreboard(true, 100);
    }
  };

  const renderTile = (x, y) => {
    const isPlayer = PlayerPosition.x === x && PlayerPosition.y === y;
    const isRevealed = revealed.some(([rx, ry]) => rx === x && ry === y);
    const cell = grid[x]?.[y];

    const displayContent = () => {
      if (isPlayer) return "🧍";
      if (!isRevealed) return "■";
      if (cell === "#") return "⬛";
      if (cell === "E") return "🏁";
      return "⬜";
    };

    return (
      <div
        key={`${x}-${y}`}
        onClick={() => handleClick(x, y)}
        style={{
          width: "40px",
          height: "40px",
          backgroundColor: "lightgray",
          border: "1px solid black",
          fontSize: "25px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: isAdjacent(x, y) ? "pointer" : "not-allowed",
          opacity: isAdjacent(x, y) ? 1 : 0.4
        }}
      >
        {displayContent()}
      </div>
    );
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${gridSize}, 40px)`,
        gridTemplateRows: `repeat(${gridSize}, 40px)`
      }}
    >
      {grid.map((row, x) =>
        row.map((_, y) => renderTile(x, y))
      )}
    </div>
  );
}

export default Grid;