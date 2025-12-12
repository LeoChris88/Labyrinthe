import "./Tile.css";

function Tile({ value }) {
    const getType = () => {
        if (value === "W") return "wall";
        if (value === "S") return "start";
        if (value === "E") return "end";
        if (value.startsWith("M:")) return "monster";
        if (value.startsWith("K:")) return "key";
        if (value.startsWith("D:")) return "door";
        if (value.startsWith("O:")) return "obstacle";
        if (value.startsWith("I:")) return "item";
        return "default";
    };

    const type = getType();

    const icons = {
        monster: "👾",
        key: "🔑",
        door: "🚪",
        obstacle: "⚠️",
        item: "📦",
    };

    return (
        <div className={`tile tile-${type}`}>
            {icons[type] || ""}
        </div>
    );
}

export default Tile;