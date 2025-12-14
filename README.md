Modification du Grid.jsx afin de le rendre plus propre/lisible car avant le fichier faisait beaucoup trop de choses en même temps comme la gestion de l'état du jeu, chargement d'API etc...
Je l'ai donc allégé, désormais il affiche la grille, les clics du joeur et appels de fonctions existantes

- Ajout fichier grid.css

Vendredi : Correction de bug niveau classement de score + ajout de classement pour chaque level


----------------------------------------------------------------------------------------------------------------------------
Samedi 13/12/2025 :

00:04 : Commencement de la partie 13/20 avec l'ajout du sytème d'inventaire et récupération des items qui va stocker dans l'inventaire

00:48 : Réglage du système de combat, maintenant fonctionnel 

01:01 : Transformation d'une tuile spéciale à tuile classique

01:15 : Ajout du système d'hp

02:33 : Ajout du système de combat un peu plus réaliste avec une quantité d'hp de départ ( 75 ) et perte d'hp si on tombe sur une tuile monstre si on ne possède pas d'arme ( -25 ) et emmener le joueur directement au tableau des scores en annonçant la défaite

03:49 : Commencement du refacto du fichier Grid.jsx

08:21 : SUite à un renseignement j'ai remarqué que j'avais une mauvaise pratique sur cette ligne "level.grid[row][col] = "C";" qui en fait est mal en React dans le sens où ça peut creer des bugs invisibles car je transforme directe du state. 

10:50 : Suppression des states et du useEffect du Grid.jsx, nettoyage du fichier Grid.jsx afin de séparer l’affichage et la logique du jeu, ajout du hook useGame pour gérer la logique du jeu. 
En fin de compte le refacto/la relecture du code, m'a permi de séparer la logique du jeu de l'affichage, j'ai appris l'utilité d'un hook qui sert à regrouper une logique.

Ajout des fichiers TileTypes.jsx, TileUtils.jsx, et UseGame.jsx.


14:09 : Commencement 16/20 
Ajout des armes dans l'API

18:16 : Finition de la partie 16/20, ajout des stats des monstres + armes dans le fichier CombatConfig, ajout gestion de combat dans Grid.jsx.

23:15 : Refacto dans les fichiers suivants : Grid.jsx, UseGame.jsx et App.jsx.
Le test du jeu est approuvé, son fonctionnement est conforme à la consigne.

----------------------------------------------------------------------------------------------------------------------------
Dimanche 14/12/2025 :
16:16 : Ajout de transition de niveau dans scoreboard.jsx, et App.jsx. 
Fonctionnement : Quand le joueur à réussi le niveau le bouton "Niveau suivant" apparaît si ce dernier perd, le bouton n'apparait pas à la fin dans le résumé de la partie.  
Modification de Scoreboard.css avec l'ajout du style du bouton "Niveau suivant" 