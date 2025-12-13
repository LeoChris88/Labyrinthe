import { useState, useEffect, useRef } from "react";
import "./Grid.css";

function Grid({ levelId, pseudo, goToScoreboard }) {
  const [level, setLevel] = useState(null);
  const [player, setPlayer] = useState(null);
  const [revealed, setRevealed] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [message, setMessage] = useState("");

  const endedRef = useRef(false);

  useEffect(() => {
    const loadLevel = async () => {
      endedRef.current = false;

      const res = await fetch(`http://localhost:4000/api/levels/${levelId}`);
      const data = await res.json();

      setLevel(data);
      setPlayer({ row: data.start.row, col: data.start.col });
      setRevealed([[data.start.row, data.start.col]]);
      setInventory([]);
      setMessage("");
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

  const hasItem = (id) => inventory.includes(id);

  const parseTile = (val) => {
    if (val === "W" || val === "S" || val === "E" || val === "C") return { type: val };

    const [prefix, data] = val.split(":");

    return {
      type: prefix,
      data
    };
  };

  const canPass = (tile) => {
    const parsed = parseTile(tile);

    if (parsed.type === "W") return false;

    if (parsed.type === "D") {
      return hasItem(`key_${parsed.data}`);
    }

    if (parsed.type === "O") {
      if (parsed.data === "fire") return hasItem("water_bucket");
      if (parsed.data === "rock") return hasItem("pickaxe");
      if (parsed.data === "water") return hasItem("swim_boots");
      return false;
    }

    if (parsed.type === "M") {
      return hasItem("pickaxe");
    }

    return true;
  };

  const interact = (r, c, tile) => {
    const parsed = parseTile(tile);

    if (parsed.type === "I") {
      setInventory((inv) => [...inv, parsed.data]);
      setMessage(`📦 Objet obtenu : ${parsed.data}`);

      level.grid[r][c] = "C";
      return;
    }

    if (parsed.type === "K") {
      const keyId = `key_${parsed.data}`;
      setInventory((inv) => [...inv, keyId]);
      setMessage(`🗝️ Clé obtenue : ${parsed.data}`);

      level.grid[r][c] = "C";
      return;
    }

    if (parsed.type === "M") {
      setMessage("⚔️ Combat ! Le monstre est vaincu.");

      level.grid[r][c] = "C";
      return;
    }

    if (parsed.type === "D") {
      setMessage(`🚪 Porte ${parsed.data} ouverte`);
    }

    if (parsed.type === "O") {
      setMessage(`🛠️ Obstacle franchi : ${parsed.data}`);

      level.grid[r][c] = "C";
      return;
    }
  };

  const handleClick = (r, c) => {
    if (!isAdjacent(r, c)) return;

    const tile = level.grid[r][c];
    const newRevealed = isRevealed(r, c)
      ? revealed
      : [...revealed, [r, c]];

    setRevealed(newRevealed);

    if (!canPass(tile)) {
      setMessage("⛔ Vous n’avez pas l’objet requis !");
      return;
    }

    setPlayer({ row: r, col: c });
    interact(r, c, tile);

  const parsed = parseTile(tile);
  if (parsed.type === "D" && hasItem(`key_${parsed.data}`) && !endedRef.current) {
    endedRef.current = true;
    const finalScore = newRevealed.length;
    setTimeout(() => goToScoreboard(finalScore), 300);
    return;
  }

    if (tile === "E" && !endedRef.current) {
      endedRef.current = true;

      const finalScore = newRevealed.length;

      setTimeout(() => {
        goToScoreboard(finalScore);
      }, 300);
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
    <div>
      <div className="inventory">
        <h3>🎒 Inventaire</h3>
        {inventory.length === 0 ? (
          <p>Aucun objet</p>
        ) : (
          <ul>
            {inventory.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
      </div>
      {message && <p className="message-box">{message}</p>}
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
    </div>
  );
}

export default Grid;