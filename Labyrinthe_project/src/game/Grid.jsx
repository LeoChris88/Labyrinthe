import { useState, useEffect, useRef } from "react";
import { saveScore } from "../utils/score";
import "./Grid.css";

function Grid({ levelId, pseudo, goToScoreboard }) {
  const [level, setLevel] = useState(null);
  const [player, setPlayer] = useState(null);
  const [revealed, setRevealed] = useState([]);

  const endedRef = useRef(false);

  useEffect(() => {
    const loadLevel = async () => {
      endedRef.current = false;
      const res = await fetch(`http://localhost:4000/api/levels/${levelId}`);
      const data = await res.json();

      setLevel(data);
      setPlayer({ row: data.start.row, col: data.start.col });
      setRevealed([[data.start.row, data.start.col]]);
    };

    loadLevel();
  }, [levelId]);

  if (!level) return <p>Chargement...</p>;

  const { rows, cols } = level;

  const isRevealed = (r, c) =>
    revealed.some(([rr, cc]) => rr === r && cc === c);

  const isAdjacent = (r, c) =>
    (r === player.row && Math.abs(c - player.col) === 1) ||
    (c === player.col && Math.abs(r - player.row) === 1);

  const isWalkable = (value) =>
    !["W", "M:", "O:", "D:"].some((prefix) => value.startsWith(prefix));

  const handleClick = (r, c) => {
    if (!isAdjacent(r, c)) return;

    const tile = level.grid[r][c];

    const newRevealed = revealed.some(([rr, cc]) => rr === r && cc === c)
    ? revealed
    : [...revealed, [r, c]];

    setRevealed(newRevealed);

    if (!isWalkable(tile)) return;

    setPlayer({ row: r, col: c });

    if (tile === "E" && !endedRef.current) {
      endedRef.current = true;

      const finalScore = newRevealed.length;

      setTimeout(() => {
        goToScoreboard(finalScore);
      }, 0);
    }
  };

  const getTileColor = (val, isPlayer) => {
    if (isPlayer) return "tile-player";
    if (val === "S") return "tile-start";
    if (val === "E") return "tile-end";
    if (val === "W") return "tile-wall";
    if (val.startsWith("M:")) return "tile-monster";
    if (val.startsWith("O:")) return "tile-obstacle";
    if (val.startsWith("D:")) return "tile-door";
    if (val.startsWith("K:")) return "tile-key";
    if (val.startsWith("I:")) return "tile-item";
    return "tile-default";
  };

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, 40px)`,
        gridTemplateRows: `repeat(${rows}, 40px)`,
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
              className={`tile ${
                rev ? getTileColor(cell, isPlayerTile) : "tile-hidden"
              } ${isAdjacent(r, c) ? "tile-clickable" : ""}`}
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