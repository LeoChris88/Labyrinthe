import { useEffect, useRef, useState } from "react";
import { parseTile } from "./TileUtils";

const MONSTER_DAMAGE = 25;
const INITIAL_HP = 75;

export function useGame(levelId, goToScoreboard) {
  const [level, setLevel] = useState(null);
  const [player, setPlayer] = useState(null);
  const [revealedTiles, setRevealedTiles] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState(INITIAL_HP);

  const gameEnded = useRef(false);

  useEffect(() => {
    async function loadLevel() {
      gameEnded.current = false;

      const response = await fetch(
        `http://localhost:4000/api/levels/${levelId}`
      );
      const data = await response.json();

      setLevel(data);
      setPlayer({ row: data.start.row, col: data.start.col });
      setRevealedTiles([[data.start.row, data.start.col]]);
      setInventory([]);
      setMessage("");
      setHp(INITIAL_HP);
    }

    loadLevel();
  }, [levelId]);

  const updateTile = (row, col, value) => {
    setLevel((prev) => ({
      ...prev,
      grid: prev.grid.map((r, ri) =>
        r.map((cell, ci) =>
          ri === row && ci === col ? value : cell
        )
      ),
    }));
  };

  const endGame = (result, score) => {
    if (gameEnded.current) return;
    gameEnded.current = true;

    setTimeout(() => {
      goToScoreboard({ result, score });
    }, 300);
  };

  return {
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
  };
}