import { useState, useEffect, useRef } from "react";
import { saveScore } from "../utils/score";

function Grid({ levelId, pseudo, goToScoreboard }) {
  const [level, setLevel] = useState(null);
  const [player, setPlayer] = useState(null);
  const [revealed, setRevealed] = useState([]);
  
  // Empêche score multiple
  const endedRef = useRef(false);

  useEffect(() => {
    const loadLevel = async () => {
      endedRef.current = false; // reset fin de partie
      const res = await fetch(`http://localhost:4000/api/levels/${levelId}`);
      const data = await res.json();

      setLevel(data);
      setPlayer({ row: data.start.row, col: data.start.col });
      setRevealed([[data.start.row, data.start.col]]);
    };

    loadLevel();
  }, [levelId]);

  if (!level) return <p>Chargement...</p>;

  const rows = level.rows;
  const cols = level.cols;

  const isRevealed = (r, c) =>
    revealed.some(([rr, cc]) => rr === r && cc === c);

  const isAdjacent = (r, c) =>
    (r === player.row && Math.abs(c - player.col) === 1) ||
    (c === player.col && Math.abs(r - player.row) === 1);

  const isWalkable = (value) => {
    if (value === "W") return false;
    if (value.startsWith("M:")) return false;
    if (value.startsWith("O:")) return false;
    if (value.startsWith("D:")) return false;
    return true;
  };

  const handleClick = (r, c) => {
    if (!isAdjacent(r, c)) return;

    const tile = level.grid[r][c];

    setRevealed((prev) => {
      const exists = prev.some(([rr, cc]) => rr === r && cc === c);
      if (exists) return prev;
      return [...prev, [r, c]];
    });

    if (!isWalkable(tile)) return;

    setPlayer({ row: r, col: c });

    if (tile === "E" && !endedRef.current) {
      endedRef.current = true;

      const finalScore = revealed.length + 1;

      saveScore(pseudo, finalScore, level);

      setTimeout(() => {
        goToScoreboard(levelId, finalScore);
      }, 0);
    }
  };

  const getTileColor = (val, isPlayer) => {
    if (isPlayer) return "#ffe600";
    if (val === "S") return "#4da6ff";
    if (val === "E") return "#50c878";
    if (val === "W") return "#111";

    if (val.startsWith("M:")) return "#cc4444";
    if (val.startsWith("O:")) return "#e08a00";
    if (val.startsWith("D:")) return "#8855cc";
    if (val.startsWith("K:")) return "#ffdd55";
    if (val.startsWith("I:")) return "#55e1e1";

    return "#dcdcdc";
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 40px)`,
        gridTemplateRows: `repeat(${rows}, 40px)`,
        gap: "3px",
      }}
    >
      {level.grid.map((row, r) =>
        row.map((cell, c) => {
          const isPlayerTile = player.row === r && player.col === c;
          const rev = isRevealed(r, c);

          return (
            <div
              key={`${r}-${c}`}
              onClick={() => handleClick(r, c)}
              style={{
                width: "40px",
                height: "40px",
                border: "1px solid #222",
                background: rev ? getTileColor(cell, isPlayerTile) : "#2b2b2b",
                color: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: isAdjacent(r, c) ? "pointer" : "default",
              }}
            >
              {rev ? cell : ""}
            </div>
          );
        })
      )}
    </div>
  );
}

export default Grid;