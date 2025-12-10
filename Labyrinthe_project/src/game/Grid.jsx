import { useState, useEffect } from "react";
import { saveScore } from "../utils/score";

function Grid({ levelId, goToScoreboard }) {
  const [level, setLevel] = useState(null);
  const [player, setPlayer] = useState(null);
  const [revealed, setRevealed] = useState([]);

  // Charger le niveau depuis l’API
  useEffect(() => {
    const loadLevel = async () => {
      const res = await fetch(`http://localhost:4000/api/levels/${levelId}`);
      const data = await res.json();

      setLevel(data);

      // Position initiale
      setPlayer({ row: data.start.row, col: data.start.col });

      // On révèle déjà la case de départ
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

  /** Détecter si une case est traversable */
  const isWalkable = (value) => {
    if (value === "W") return false; // mur

    if (value.startsWith("M:")) return false; // monstre
    if (value.startsWith("O:")) return false; // obstacle
    if (value.startsWith("D:")) return false; // porte fermée

    return true;
  };

  /** Clic sur une tuile */
  const handleClick = (r, c) => {
    if (!isAdjacent(r, c)) return; // pas adjacent → interdit

    const tile = level.grid[r][c];

    setRevealed(prev => {
      const exists = prev.some(([rr, cc]) => rr === r && cc === c);
      if (exists) return prev;
      return [...prev, [r, c]];
    });

    // Bloquer si non marchable
    if (!isWalkable(tile)) return;

    // Déplacement
  setPlayer({ row: r, col: c });

  if (tile === "E") {
    setRevealed(prev => {
      const finalScore = prev.length + 1;

      saveScore("PLAYER", finalScore, levelId);

      goToScoreboard(
      true,
      revealed.length,
      Math.floor((Date.now() - level.startTime) / 1000)
      );

      return prev;
    });

    return;
  }
  };

  /** Couleurs selon la tuile révélée */
  const getTileColor = (val, isPlayer) => {
    if (isPlayer) return "#ffe600";

    if (val === "S") return "#4da6ff";
    if (val === "E") return "#50c878";
    if (val === "W") return "#111";

    if (val.startsWith("M:")) return "#cc4444"; // monstre
    if (val.startsWith("O:")) return "#e08a00"; // obstacle feu/rocher/eau
    if (val.startsWith("D:")) return "#8855cc"; // porte colorée
    if (val.startsWith("K:")) return "#ffdd55"; // clé
    if (val.startsWith("I:")) return "#55e1e1"; // item utile

    return "#dcdcdc"; // case neutre
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
                background: rev
                  ? getTileColor(cell, isPlayerTile)
                  : "#2b2b2b",
                fontSize: "14px",
                fontWeight: "bold",
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