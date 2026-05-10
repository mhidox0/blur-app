# 🟣 PROMPT DE DÉVELOPPEMENT — BLUR (PWA Jeux d'Alcool)

## 🎯 CONTEXTE & OBJECTIF

Tu vas développer une **Progressive Web App (PWA)** de jeux d'alcool en groupe, moderne, premium et entièrement gratuite. L'app est pensée pour être installée sur mobile via le navigateur (sans App Store ni Google Play). Elle doit rivaliser en finition avec des apps commerciales comme Toz ou Picolo, mais sans aucun paywall.

**Nom de l'app : BLUR**
**Tagline : "La soirée commence ici."**

Le contenu s'adapte selon le mode choisi par le groupe avant chaque jeu :
- **SOFT** 🌙 : ambiance détendue, questions sympa, défis légers
- **HOT** 🔥 : questions intimes, défis osés, contenu adulte trash sans filtre
- **MIX** 🎲 : mélange aléatoire entre Soft et Hot

Ce sélecteur Soft / Hot / Mix est **présent sur TOUS les jeux** qui ont du contenu textuel (questions, défis, cartes). Il apparaît systématiquement avant le lancement d'un jeu.

---

## 🛠️ STACK TECHNIQUE

| Élément | Choix |
|---|---|
| Frontend | **React** (Vite + React 18) |
| Backend / Temps réel | **Supabase** (Realtime, PostgreSQL) |
| Style | **Tailwind CSS** + Framer Motion |
| PWA | Service Worker + manifest.json (installable iOS & Android) |
| Langues | **Français** (défaut) + **Anglais** (switch dans settings) |
| Hébergement suggéré | Vercel (gratuit) |

---

## 🎨 DESIGN & UI/UX

### Direction artistique
- **Thème** : Sombre & néon — fond noir profond (`#0A0A0F`), accents violet électrique (`#9B30FF`), rose néon (`#FF2D78`), cyan (`#00F5FF`)
- **Typographie** : Police display agressive (ex: `Bebas Neue` ou `Clash Display` pour les titres) + corps lisible (`DM Sans` ou `Outfit`)
- **Ambiance** : Glassmorphism sombre sur les cartes, glow effects sur les boutons, grain subtil en background
- **Animations** : Transitions fluides entre écrans, flip animé sur les cartes, roulette de sélection joueur, micro-interactions sur chaque bouton — tout à 60fps
- **Mobile-first** : UI conçue pour écran vertical 390px. Aucun scroll inutile sur les écrans de jeu
- **Pas de sons** : Uniquement des animations visuelles

### Composants UI réutilisables
- `NeonButton` — bouton avec glow pulsé
- `GlassCard` — carte avec effet verre dépoli sombre
- `PlayerChip` — badge joueur avec avatar emoji aléatoire
- `CountdownRing` — compte à rebours circulaire animé
- `ToastNotification` — notification flash
- `ModeSelector` — sélecteur Soft / Hot / Mix avec animation (affiché avant chaque jeu)
- `CardDeck` — deck de cartes virtuel animé (flip, pioche, shuffle)
- `LanguageToggle` — switch FR/EN dans le header

### Sélecteur de mode (ModeSelector)
Avant chaque jeu avec contenu textuel, un écran interstitiel s'affiche :
```
[ 🌙 SOFT ]   [ 🎲 MIX ]   [ 🔥 HOT ]
```
Boutons larges, animés, avec couleur distincte. Le choix est mémorisé pour toute la session mais modifiable depuis le menu du jeu.

---

## 👥 SYSTÈME DE SESSION (SANS COMPTES)

### Création de session
1. L'hôte ouvre BLUR → "Nouvelle soirée"
2. Il entre les **pseudos des joueurs** (jusqu'à 12 joueurs)
3. L'app génère automatiquement :
   - Un **QR Code** plein écran à scanner
   - Un **code à 6 chiffres** (ex: `482-917`) à entrer manuellement
4. Les autres joueurs ouvrent BLUR → "Rejoindre" → entrent le code ou scannent

### Mémoire des pseudos
- Pseudos de la dernière session sauvegardés en **localStorage**
- Au redémarrage : "Reprendre avec les mêmes joueurs ?" avec checkboxes
- Option "Nouvelle session" pour repartir de zéro

### Modes de jeu
- **Pass & Play** : un seul téléphone qui tourne — 100% offline via Service Worker
- **Multi-device** : chaque joueur sur son téléphone, sync temps réel via **Supabase Realtime**

### Supabase Schema
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(6) UNIQUE NOT NULL,
  host_id TEXT NOT NULL,
  players JSONB NOT NULL DEFAULT '[]',
  current_game TEXT,
  game_state JSONB DEFAULT '{}',
  mode TEXT CHECK (mode IN ('soft', 'hot', 'mix')) DEFAULT 'mix',
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '6 hours'
);

CREATE TABLE game_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id),
  player_id TEXT,
  event_type TEXT,
  payload JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎮 LISTE COMPLÈTE DES JEUX

### ━━━ FAMILLE 1 : JEUX DE CARTES ━━━

#### 🃏 1. Le Palmier
- Cartes disposées en éventail face cachée
- Chaque carte retournée révèle une règle progressive (plus on avance, plus c'est intense)
- Mode Soft / Hot / Mix détermine le contenu des règles sur les cartes
- Animation : carte qui se retourne avec effet flip 3D

#### 🃏 2. Blackjack Drink
- Règles classiques du Blackjack (21)
- Chaque joueur joue contre le "dealer" (le jeu)
- Perdant(s) boivent autant de gorgées que leur écart avec 21 (max 5)
- Option : si bust, shot direct
- Animation : distribution de cartes glissées depuis le deck

#### 🃏 3. PMU *(Parie-Mange-Untertrink)*
- Avant chaque carte retournée, les joueurs parient des gorgées sur rouge/noir ou la valeur
- Si correct → le pari est redistribué aux perdants
- Si incorrect → tu bois ce que t'as misé
- Système de jetons de gorgées visuel (chips animées)

#### 🃏 4. Bus Driver *(Survive le Bus)*
- Une rangée de 10 cartes face cachée = "le bus"
- Le joueur doit traverser sans se tromper en devinant : Rouge/Noir → Haut/Bas → Dedans/Dehors → Couleur
- Chaque erreur = retour à la case départ + boire le nombre de cartes traversées
- Dernier bus de la soirée : celui qui échoue le plus souvent devient "le chauffeur"

#### 🃏 5. Higher or Lower
- Une carte est retournée
- Chaque joueur à son tour prédit : la prochaine est plus haute ou plus basse ?
- Faux → boit 2 gorgées
- Juste → passe au suivant
- Si la carte est identique → tout le monde boit

#### 🃏 6. Snap Drink
- Les joueurs retournent des cartes en chaîne rapidement
- Dès que deux cartes consécutives de même valeur apparaissent → le premier à crier "SNAP" désigne quelqu'un qui boit
- Si personne ne réagit dans les 3 secondes → tout le monde boit
- Mode multi-device : bouton "SNAP!" sur chaque téléphone, le plus rapide gagne

---

### ━━━ FAMILLE 2 : JEUX DE QUESTIONS ━━━

#### ❓ 7. Vérité ou Shot
- Roulette animée désigne un joueur
- Choix : **Vérité** ou **Shot**
- Vérité → carte question (selon mode), le groupe vote si la réponse est honnête, sinon boit
- Shot → carte défi à accomplir sinon boit
- **Banque** : 200+ questions vérité + 100+ défis (Soft / Hot)

#### ❓ 8. Picolo *(Style appli)*
- Cartes qui défilent une par une, chacune avec une règle/défi surprise
- Le joueur désigné doit s'exécuter ou boire
- Mode Soft / Hot / Mix change l'intensité des cartes
- **Banque** : 300+ cartes Picolo (FR + EN)
- Certaines cartes installent des règles permanentes pour le reste de la partie
- Animation : slide horizontal façon Tinder pour passer les cartes

#### ❓ 9. Je n'ai jamais *(Never Have I Ever)*
- Une phrase "Je n'ai jamais..." est affichée
- Ceux qui l'ont fait boivent (tap sur leur écran en multi-device)
- Mode Soft / Hot / Mix sur le contenu
- **Banque** : 200+ phrases (FR + EN)

#### ❓ 10. Most Likely To *(Qui est le plus susceptible de...)*
- "Qui dans ce groupe est le plus susceptible de..." est affiché
- Vote simultané (doigt pointé ou bouton multi-device)
- Révélation dramatique → la personne la plus citée boit autant de gorgées que de votes
- **Banque** : 150+ questions (FR + EN)

#### ❓ 11. Tu préfères *(Would You Rather)*
- Dilemme posé au groupe : "Tu préfères A ou B ?"
- Vote → la minorité boit, égalité = tout le monde boit
- **Banque** : 150+ dilemmes (FR + EN)

---

### ━━━ FAMILLE 3 : JEUX DE SKILL & ACTION ━━━

#### ⚡ 12. Speed Tap *(Pass & Play)*
- Une cible apparaît à une position aléatoire sur l'écran
- Le joueur dont c'est le tour doit tapper le plus vite possible
- Son temps (en ms) est enregistré
- Chaque joueur passe à son tour — le plus lent boit
- Variante "Élimination" : le plus lent à chaque round est éliminé, le dernier distribue des shots
- Difficulté progressive : cible plus petite, fausses cibles, zone réduite

#### 🎲 13. Dé à boire
- Un ou plusieurs dés virtuels animés à lancer (animation 3D)
- Chaque face a une règle (modifiable selon mode Soft/Hot/Mix)
- Mode "Dé personnalisé" : l'hôte assigne ses propres règles aux 6 faces
- Variante "Double dé" : 36 combinaisons possibles

#### 🎰 14. Roulette Russe à Shots
- X verres affichés à l'écran, un seul est "chargé" en secret
- Chaque joueur choisit un verre
- Révélation dramatique avec compte à rebours + flash
- Celui sur le verre chargé boit un shot

---

### ━━━ FAMILLE 4 : JEUX DE GROUPE ━━━

#### 🗣️ 15. Catégories *(Categories)*
- Le jeu annonce une catégorie
- Les joueurs citent en chaîne — le premier qui bloque ou répète boit
- Timer visible qui s'accélère
- **Banque** : 100+ catégories (FR + EN), classées par difficulté

#### 🎤 16. Rime Battle
- Un joueur dit un mot, le suivant doit rimer dans les 5 secondes
- Le premier qui bloque, répète ou dépasse le timer boit
- Variante "Rap Battle" : phrase entière qui rime avec la précédente

---

## 📱 STRUCTURE DE L'APP (NAVIGATION)

```
/ (Home — écran BLUR avec logo animé)
├── /lobby              → Créer ou rejoindre une session
├── /session/:code      → Salle d'attente (liste joueurs connectés)
├── /games              → Menu de sélection (grille 4 familles)
│   ├── Jeux de cartes  (Palmier, Blackjack, PMU, Bus Driver, Higher or Lower, Snap)
│   ├── Questions       (Vérité ou Shot, Picolo, Je n'ai jamais, Most Likely To, Would You Rather)
│   ├── Skill & Action  (Speed Tap, Dé à boire, Roulette Russe)
│   └── Jeux de groupe  (Categories, Rime Battle)
└── /settings           → Langue (FR/EN), reset données
```

---

## 🔧 ARCHITECTURE REACT

```
src/
├── components/
│   ├── ui/             (NeonButton, GlassCard, PlayerChip, CountdownRing, ModeSelector, CardDeck, Toast)
│   ├── games/
│   │   ├── cards/      (Palmier, Blackjack, PMU, BusDriver, HigherLower, Snap)
│   │   ├── questions/  (TruthShot, Picolo, NeverHaveI, MostLikely, WouldYouRather)
│   │   ├── skill/      (SpeedTap, Dice, RussianRoulette)
│   │   └── group/      (Categories, RimeBattle)
│   └── session/        (QRCodeDisplay, JoinForm, PlayerList)
├── hooks/
│   ├── useSession.js
│   ├── useGameState.js
│   ├── usePlayers.js
│   ├── useGameMode.js          ← gère Soft / Hot / Mix
│   └── useLocalStorage.js
├── lib/
│   ├── supabase.js
│   ├── gameLogic/
│   └── content/
│       ├── fr/                 (JSON par jeu et par mode)
│       └── en/
└── styles/
    └── globals.css             (variables CSS néon, animations globales)
```

---

## 📦 BANQUES DE CONTENU (fichiers JSON)

```
content/
├── fr/
│   ├── truth-or-shot.json       { questions: {soft:[], hot:[]}, defis: {soft:[], hot:[]} }
│   ├── picolo.json              { cards: {soft:[], hot:[]} }
│   ├── never-have-i-ever.json   { phrases: {soft:[], hot:[]} }
│   ├── most-likely-to.json      { questions: {soft:[], hot:[]} }
│   ├── would-you-rather.json    { dilemmes: {soft:[], hot:[]} }
│   ├── categories.json          { categories: [] }
│   └── palmier.json             { rules: {soft:[], hot:[]} }
└── en/
    └── (mêmes fichiers en anglais)
```

Volumes minimum :
- Vérité ou Shot : 200 questions + 100 défis par mode
- Picolo : 300 cartes par mode
- Je n'ai jamais : 200 phrases par mode
- Most Likely To : 150 questions par mode
- Would You Rather : 150 dilemmes par mode
- Catégories : 100 catégories
- Palmier : 60 règles par mode

---

## ✅ ORDRE DE DÉVELOPPEMENT

1. Setup : Vite + React + Tailwind + Supabase + manifest PWA
2. Design system : composants UI + thème néon + ModeSelector
3. Système de session : pseudos, localStorage, QR + code 6 chiffres
4. Picolo (le plus emblématique, logique simple)
5. Vérité ou Shot
6. Je n'ai jamais + Most Likely To + Would You Rather
7. Jeux de cartes : Palmier → Higher or Lower → Snap → Blackjack → PMU → Bus Driver
8. Skill games : Speed Tap → Dé → Roulette Russe
9. Jeux de groupe : Categories → Rime Battle
10. Multi-device : Supabase Realtime
11. Polish : animations, transitions, PWA install prompt, langue EN

---

## ⚠️ CONTRAINTES IMPORTANTES

- Aucun compte utilisateur — jamais d'auth obligatoire
- Pass & Play = 100% offline (service worker)
- Pseudos persistants en localStorage entre les sessions
- QR code encode l'URL de session (`https://blur.app/session/482917`)
- Code 6 chiffres et QR mènent au même endroit
- Toutes les animations à 60fps, aucun lag
- Le sélecteur **Soft / Hot / Mix est obligatoire** avant tout jeu avec contenu textuel
- App en Français par défaut, switch EN dans les settings
- Aucun message d'avertissement au lancement — on rentre direct dans l'ambiance BLUR

---

## 🚀 INSTRUCTION DE DÉMARRAGE

Commence par :
1. Créer la structure complète du projet Vite + React + Tailwind
2. Implémenter le design system néon complet (tous les composants UI)
3. Coder le système de session (lobby + pseudos + QR + code 6 chiffres)
4. Puis attaque les jeux dans l'ordre donné ci-dessus

À chaque étape, le code doit être propre, commenté, modulaire et prêt pour une mise en production sur Vercel.
