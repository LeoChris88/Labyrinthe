function PlayerPosition({ row, col }) {
    return (
        <div
            style={{
                gridRow: row + 1,
                gridColumn: col + 1,
                background: "blue",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
            }}
        >
            🧍
        </div>
    );
}

export default PlayerPosition;