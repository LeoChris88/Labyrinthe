function Tile({ value }) {
    const isWall = value === "W";
    const isStart = value === "S";
    const isEnd = value === "E";

    return (
        <div
            style={{
                width: "40px",
                height: "40px",
                border: "1px solid #ccc",
                background: isWall
                    ? "#333"
                    : isStart
                    ? "green"
                    : isEnd
                    ? "red"
                    : "#eee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px"
            }}
        >
            {value.startsWith("M:") && "👾"}
            {value.startsWith("K:") && "🔑"}
            {value.startsWith("D:") && "🚪"}
            {value.startsWith("O:") && "⚠️"}
            {value.startsWith("I:") && "📦"}
        </div>
    );
}

export default Tile;