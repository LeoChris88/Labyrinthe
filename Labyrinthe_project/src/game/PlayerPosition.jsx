import "./PlayerPosition.css";

function PlayerPosition({ row, col }) {
    return (
        <div
            className="player-position"
            style={{
                gridRow: row + 1,
                gridColumn: col + 1,
            }}
        ></div>
    );
}

export default PlayerPosition;