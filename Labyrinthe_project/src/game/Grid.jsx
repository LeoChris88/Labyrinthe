import "./Grid.css";
import { TILE_TYPES } from "./TileTypes";
import { getTileClass } from "./TileUtils";
import { useGame } from "./UseGame";

function Grid({ levelId, pseudo, goToScoreboard }) {
  const {
    level,
    player,
    setPlayer,
    revealedTiles,
    setRevealedTiles,
    inventory,
    setInventory,
    message,
    setMessage,
    hp,
    setHp,
    parseTile,
    updateTile,
    endGame,
    gameEnded,
  } = useGame(levelId, goToScoreboard);

  if (!level) return <p>Chargement...</p>;

  const isTileRevealed = (row, col) =>
    revealedTiles.some(([r, c]) => r === row && c === col);

  const isAdjacentTile = (row, col) =>
    (row === player.row && Math.abs(col - player.col) === 1) ||
    (col === player.col && Math.abs(row - player.row) === 1);

  const playerHasItem = (item) => inventory.includes(item);

  const canMoveOnTile = (tile) => {
    const parsed = parseTile(tile);

    if (parsed.type === TILE_TYPES.WALL) return false;

    if (parsed.type === TILE_TYPES.DOOR) {
      return playerHasItem(`key_${parsed.data}`);
    }

    if (parsed.type === TILE_TYPES.OBSTACLE) {
      if (parsed.data === "fire") return playerHasItem("water_bucket");
      if (parsed.data === "rock") return playerHasItem("pickaxe");
      if (parsed.data === "water") return playerHasItem("swim_boots");
      return false;
    }

    return true;
  };

  const interactWithTile = (row, col, tile) => {
    const parsed = parseTile(tile);

    if (parsed.type === TILE_TYPES.ITEM) {
      setInventory((prev) => [...prev, parsed.data]);
      setMessage(`📦 Objet obtenu : ${parsed.data}`);
      updateTile(row, col, TILE_TYPES.CLEAR);
    }

    if (parsed.type === TILE_TYPES.KEY) {
      setInventory((prev) => [...prev, `key_${parsed.data}`]);
      setMessage(`🗝️ Clé obtenue : ${parsed.data}`);
      updateTile(row, col, TILE_TYPES.CLEAR);
    }

    if (parsed.type === TILE_TYPES.MONSTER) {
      if (playerHasItem("pickaxe")) {
        setMessage("⚔️ Vous battez le monstre !");
        updateTile(row, col, TILE_TYPES.CLEAR);
      } else {
        const newHp = hp - 25;
        setHp(newHp);
        setMessage("👹 Le monstre vous attaque ! -25 HP");

        if (newHp <= 0) {
          setMessage("☠️ Vous êtes mort…");
          endGame("defeat", revealedTiles.length);
        }
      }
    }
  };

  const handleTileClick = (row, col) => {
    if (!isAdjacentTile(row, col)) return;

    const tile = level.grid[row][col];

    if (!isTileRevealed(row, col)) {
      setRevealedTiles((prev) => [...prev, [row, col]]);
    }

    if (!canMoveOnTile(tile)) {
      setMessage("⛔ Vous n’avez pas l’objet requis !");
      return;
    }

    setPlayer({ row, col });
    interactWithTile(row, col, tile);

    const parsed = parseTile(tile);

    if (
      parsed.type === TILE_TYPES.DOOR &&
      playerHasItem(`key_${parsed.data}`)
    ) {
      endGame("victory", revealedTiles.length + 1);
    }

    if (tile === TILE_TYPES.END) {
      endGame("victory", revealedTiles.length + 1);
    }
  };

  return (
    <div>
      <div className="inventory">
        <h3>🎒 Inventaire</h3>
        {inventory.length === 0 ? (
          <p>Aucun objet</p>
        ) : (
          <ul>
            {inventory.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>

      {message && <p className="message-box">{message}</p>}
      <div className="player-stats">❤️ HP : {hp}</div>

      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${level.cols}, 40px)`,
          gridTemplateRows: `repeat(${level.rows}, 40px)`,
        }}
      >
        {level.grid.map((row, r) =>
          row.map((cell, c) => {
            const isPlayerHere = player.row === r && player.col === c;
            const revealed = isTileRevealed(r, c);

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => handleTileClick(r, c)}
                className={`tile ${
                  revealed
                    ? getTileClass(cell, isPlayerHere)
                    : "tile-hidden"
                } ${isAdjacentTile(r, c) ? "tile-clickable" : ""}`}
              >
                {revealed ? cell : ""}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Grid;