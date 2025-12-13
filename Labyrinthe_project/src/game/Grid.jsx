import "./Grid.css";
import { TILE_TYPES } from "./TileTypes";
import { getTileClass } from "./TileUtils";
import { useGame } from "./UseGame";
import { WEAPONS, MONSTERS } from "./CombatConfig";

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
    monstersHp,
    setMonstersHp,
    parseTile,
    updateTile,
    endGame,
  } = useGame(levelId, goToScoreboard);

  if (!level) return <p>Chargement...</p>;

  //Helpers – visibilité / déplacement

  const isTileRevealed = (row, col) =>
    revealedTiles.some(([r, c]) => r === row && c === col);

  const isAdjacentTile = (row, col) =>
    (row === player.row && Math.abs(col - player.col) === 1) ||
    (col === player.col && Math.abs(row - player.row) === 1);

  const playerHasItem = (item) => inventory.includes(item);

  // Déplacement / accès aux tuiles

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

    if (parsed.type === TILE_TYPES.OBSTACLE) {
      if (parsed.data === "rock" && playerHasItem("pickaxe")) {
        setMessage("🪨 Vous cassez la roche avec la pioche !");
        updateTile(row, col, TILE_TYPES.CLEAR);
        return;
      }

      if (parsed.data === "fire" && playerHasItem("water_bucket")) {
        setMessgae("🔥 Vous éteignez le feu !");
        updateTile(row, col, TILE_TYPES.CLEAR);
        return;
      }

      if (parsed.data === "water" && playerHasItem("swim_boots")) {
        setMessage("🌊 Vous traversez l’eau.");
        updateTile(row, col, TILE_TYPES.CLEAR);
        return;
      }
    }

    return true;
  };

  // Combat – armes / dégâts
  const getPlayerWeapon = () =>
    inventory.find((item) => WEAPONS[item]);

  const getPlayerDamage = () => {
    const weapon = getPlayerWeapon();
    return weapon ? WEAPONS[weapon].damage : 0;
  };


  // Interaction avec une tuile
  const interactWithTile = (row, col, tile) => {
    const parsed = parseTile(tile);

    if (parsed.type === TILE_TYPES.ITEM) {
      setInventory((prev) => {
        if (prev.includes(parsed.data)) return prev;
        return [...prev, parsed.data];
      });

      setMessage(`📦 Objet obtenu : ${parsed.data}`);
      updateTile(row, col, TILE_TYPES.CLEAR);
    }

    if (parsed.type === TILE_TYPES.KEY) {
      setInventory((prev) => [...prev, `key_${parsed.data}`]);
      setMessage(`🗝️ Clé obtenue : ${parsed.data}`);
      updateTile(row, col, TILE_TYPES.CLEAR);
    }

    if (parsed.type === TILE_TYPES.MONSTER) {
      const monsterType = parsed.data;
      const monsterKey = `${row}-${col}`;
      const monster = MONSTERS[monsterType];

      const playerDamage = getPlayerDamage();
      const monsterDamage = monster.attack;

      if (playerDamage === 0) {
        const newHp = hp - monsterDamage;
        setHp(newHp);
        setMessage(`👹 Le ${monster.name} vous attaque ! -${monsterDamage} HP`);

        if (newHp <= 0) {
          setMessage("☠️ Vous êtes mort…");
          endGame("defeat", revealedTiles.length);
        }
        return;
      }

      const remainingHp = monstersHp[monsterKey] - playerDamage;

      if (remainingHp <= 0) {
        setMessage(`⚔️ Vous avez vaincu le ${monster.name} !`);
        updateTile(row, col, TILE_TYPES.CLEAR);

        setMonstersHp((prev) => {
          const copy = { ...prev };
          delete copy[monsterKey];
          return copy;
        });
      } else {
        setMonstersHp((prev) => ({
          ...prev,
          [monsterKey]: remainingHp,
        }));

        const newHp = hp - monsterDamage;
        setHp(newHp);

        setMessage(
          `⚔️ Vous infligez ${playerDamage} dégâts au ${monster.name} (-${monsterDamage} HP pour vous)`
        );

        if (newHp <= 0) {
          setMessage("☠️ Vous êtes mort…");
          endGame("defeat", revealedTiles.length);
        }
      }
    }
  };

  // Click sur une tuile
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


  // Render

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
