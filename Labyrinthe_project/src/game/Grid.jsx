import { useState, useEffect } from "react";
import Tile from "./Tile";
import PlayerPosition from "./PlayerPosition";

function Grid({ levelId = 1 }) {
    const [level, setLevel] = useState(null);

    useEffect(() => {
        const loadLevel = async () => {
            const response = await fetch(`http://localhost:4000/api/levels/${levelId}`);
            const data = await response.json();
            setLevel(data);
        };
        loadLevel();
    }, [levelId]);

    if (!level) return <p>Chargement du niveau...</p>;

    const player = { row: level.start.row, col: level.start.col };

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${level.cols}, 40px)`,
                gridTemplateRows: `repeat(${level.rows}, 40px)`,
                gap: "2px",
            }}
        >
            {level.grid.map((row, r) =>
                row.map((cell, c) => (
                    <Tile key={`${r}-${c}`} value={cell} />
                ))
            )}

            <PlayerPosition row={player.row} col={player.col} />
        </div>
    );
}

export default Grid