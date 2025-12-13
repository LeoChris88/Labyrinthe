import { useEffect, useRef, useState } from "react";
import { parseTile } from "./TileUtils";
import { MONSTERS } from "./CombatConfig";

const MONSTER_DAMAGE = 25;
const INITIAL_HP = 75;

export function useGame(levelId, goToScoreboard) {
  const [level, setLevel] = useState(null);
  const [player, setPlayer] = useState(null);
  const [revealedTiles, setRevealedTiles] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState(INITIAL_HP);
  const [monstersHp, setMonstersHp] = useState({});

  const gameEnded = useRef(false);

  useEffect(() => {
    async function loadLevel() {
      gameEnded.current = false;

      const response = await fetch(
        `http://localhost:4000/api/levels/${levelId}`
      );
      const data = await response.json();

      setLevel(data);
      setPlayer({
        row: data.start.row,
        col: data.start.col,
      });

      // Révèle uniquement la tuile de départ
      setRevealedTiles([[data.start.row, data.start.col]]);
      setInventory([]);
      setMessage("");
      setHp(INITIAL_HP);

      //HP de tous les monstres sur la grille
      const initialMonstersHp = {};

      data.grid.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell.startsWith("M:")) {
            const type = cell.split(":")[1];
            initialMonstersHp[`${r}-${c}`] = MONSTERS[type].hp;
          }
        });
      });

      setMonstersHp(initialMonstersHp);
    }

    loadLevel();
  }, [levelId]);

  // Modifie une tuile précise de la grille (exemple : la suppression d’un monstre après combat)
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

  // Termine la partie et affiche le scoreboard, protège contre les appels multiples
  const endGame = (result, score) => {
    if (gameEnded.current) return;

    gameEnded.current = true;

    setTimeout(() => {
      goToScoreboard({ result, score });
    }, 300);
  };

  // Retourne les données et fonctions nécessaires au jeu
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
    monstersHp,
    setMonstersHp,
  };
}
