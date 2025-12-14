import { useState } from "react";

function Home({ onStartGame, onShowTutorial }) {
  const [pseudo, setPseudo] = useState("");
  const [level, setLevel] = useState(1);

  const handleStart = () => {
    if (pseudo.trim() === "") return;
    onStartGame(pseudo, level);
  };

  return (
    <div className="home-container" style={{ textAlign: "center", marginTop: "80px" }}>
      <h1>Labyrinthe</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Entrez votre pseudo"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          style={{
            padding: "8px",
            fontSize: "16px",
            width: "220px",
            borderRadius: "5px"
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>Niveau :</label>
        <select
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
          style={{ padding: "6px", fontSize: "16px" }}
        >
          <option value={1}>Niveau 1</option>
          <option value={2}>Niveau 2</option>
          <option value={3}>Niveau 3</option>
          <option value={4}>Niveau 4</option>
        </select>
      </div>
        
      <button
        onClick={handleStart}
        style={{
          padding: "10px 20px",
          fontSize: "18px",
          cursor: "pointer",
          borderRadius: "6px",
          background : "667eea",
          color: "white",
          border: "none"
        }}
      >
        Jouer
      </button>

      <button
        onClick={onShowTutorial}
        style={{
          padding: "10px 20px",
          frontSize: "18px",  
          cursor: "pointer",  
          borderRadius: "6px",
          background : "#48bb78",
          color: "white",
          border: "none",
        }}
      >
        Comment jouer à Labyrinthe ?
      </button>
    </div>
  );
}

export default Home;