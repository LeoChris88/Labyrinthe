import './Tutorial.css';
import Header from '../components/Header';

/* Données */
const controls = [
  ['👆', 'Cliquez sur une tuile adjacente pour vous déplacer'],
  ['🔍', 'Les tuiles se révèlent au fur et à mesure'],
  ['🎯', 'Seules les tuiles adjacentes sont cliquables']
];

const tiles = [
  ['S', 'start', 'Départ', 'Votre position initiale'],
  ['E', 'end', 'Sortie', 'Objectif à atteindre'],
  ['W', 'wall', 'Mur', 'Infranchissable'],
  ['C', 'clear', 'Chemin', 'Tuile praticable'],
  ['🔑', 'key', 'Clé', 'Ouvre les portes'],
  ['🚪', 'door', 'Porte', 'Nécessite une clé'],
  ['📦', 'item', 'Objet', 'Arme ou outil'],
  ['👾', 'monster', 'Monstre', 'Nécessite une arme'],
  ['⚠️', 'obstacle', 'Obstacle', 'Nécessite un outil']
];

const combat = [
  ['❤️', '75 HP au départ'],
  ['🗡️', 'Arme nécessaire pour combattre'],
  ['👹', 'Sans arme : 25 dégâts'],
  ['⚔️', 'Avec arme : échange de dégâts'],
  ['💀', '0 HP = partie terminée']
];

const inventory = [
  ['🔑', 'Clés', 'Ouvrent les portes'],
  ['🗡️', 'Armes', 'Épée (30) / Hache (45)'],
  ['🪣', 'Seau', "Éteint les flammes"],
  ['⛏️', 'Pioche', 'Casse les rochers'],
  ['🥾', 'Bottes', "Traverse l'eau"]
];

const score = [
  ['🎯', 'Score = tuiles révélées'],
  ['⭐', 'Parcours parfait par niveau'],
  ['📊', 'Parfait + 3 clics max'],
  ['🥇', 'Meilleurs scores sauvegardés']
];

/* Composants utilitaires */
const Section = ({ title, children, className = '' }) => (
  <section className={`tutorial-section ${className}`}>
    <h2>{title}</h2>
    {children}
  </section>
);

const List = ({ data }) => (
  <ul className="tutorial-list">
    {data.map(([icon, text], i) => (
      <li key={i}>
        <span className="icon">{icon}</span>
        {text}
      </li>
    ))}
  </ul>
);

/* Composant principal */
const Tutorial = ({ onClose }) => {
  return (
    <div className="tutorial-page">
      <Header title="📖 Comment jouer ?" />

      <div className="tutorial-container">
        <Section title="🎯 Objectif du jeu">
          <p>
            Aller du <span className="highlight start">S</span> à la
            <span className="highlight end"> E</span>.
          </p>
          <p>Cliquez sur les tuiles adjacentes pour avancer.</p>
        </Section>

        <Section title="🎮 Contrôles">
          <List data={controls} />
        </Section>

        <Section title="🗺️ Types de tuiles">
          <div className="tiles-grid">
            {tiles.map(([icon, cls, name, desc]) => (
              <div key={name} className="tile-example">
                <div className={`tile-icon ${cls}`}>{icon}</div>
                <p>
                  <strong>{name}</strong><br />{desc}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="⚔️ Système de combat">
          <List data={combat} />
        </Section>

        <Section title="🎒 Inventaire">
          <ul className="tutorial-list">
            {inventory.map(([icon, name, desc]) => (
              <li key={name}>
                <span className="icon">{icon}</span>
                <strong>{name}</strong> : {desc}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="🏆 Système de score">
          <List data={score} />
        </Section>

        <Section title="💡 Conseils" className="tips">
          <div className="tips-box">
            {[
              'Explorez méthodiquement',
              'Prenez une arme avant les combats',
              'Récupérez les clés avant les portes',
              'Surveillez vos HP',
              'Optimisez vos clics'
            ].map(tip => <p key={tip}>✅ {tip}</p>)}
          </div>
        </Section>

        <div className="tutorial-actions">
          <button onClick={onClose} className="btn btn-primary btn-large">
            J’ai compris 🎮
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
