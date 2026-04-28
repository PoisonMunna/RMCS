# 👑 Raja Mantri Chor Sipahi ☠️

A real-time multiplayer web adaptation of the classic Indian childhood guessing game **Raja, Mantri, Chor, Sipahi** (King, Minister, Thief, Soldier). Built with a modern **MERN stack** (React + Node.js) and powered by **Socket.io** for seamless, real-time multiplayer gameplay.

---

## 🎮 How to Play

The game requires 4 players (you can add AI bots if you don't have enough human players). Each round, roles are secretly distributed among the players:

- **👑 Raja (King):** Gets 1000 points. The Raja must reveal themselves to start the round.
- **🧠 Mantri (Minister):** Gets 800 points *if* they guess correctly. Their job is to find the Chor.
- **🛡️ Sipahi (Soldier):** Gets 500 points. A loyal protector.
- **☠️ Chor (Thief):** Gets 0 points. Tries to evade being caught by the Mantri.

**The Flow:**
1. Roles are secretly assigned.
2. Players click their cards to reveal their secret role (with a cool 3D flip animation).
3. The **Raja** reveals themselves to the lobby.
4. The **Mantri** must then guess who the **Chor** is from the remaining hidden players.
5. If the Mantri is correct, they get 800 points. If wrong, the Chor gets the 800 points!
6. Play continues until the custom win condition (target points or max rounds) is reached.

---

## ✨ Features

- **⚡ Real-Time Multiplayer:** Instant synchronization across all connected players using Socket.io for a seamless, lag-free experience.
- **🤖 Smart AI Bots:** Want to play solo or missing a friend? Fill empty spots with AI bots that automatically reveal and make logical guesses!
- **🎨 Premium UI/UX:** A visually stunning, dark-neon royal theme packed with glassmorphism effects, a custom floating 👑🛡️🧠☠️ emoji background, and cinematic transitions.
- **🃏 3D Card Flips:** Suspenseful, interactive, and physics-based 3D card flip animations when revealing your secret role.
- **⚙️ Custom Game Settings:** Room hosts hold the power! Choose between "Target Score" (e.g., first to 20,000 points) or "Fixed Rounds" (e.g., play exactly 10 rounds) win conditions.
- **🔊 Immersive Audio:** Dynamic sound effects that react to gameplay—suspenseful card reveals, victorious cheers for correct guesses, and dramatic game-over sounds.
- **🏆 Live Leaderboard:** Real-time tracking of scores across all rounds, keeping the competitive spirit alive.
- **🔄 Instant Game Reset:** When the game ends, the lobby automatically resets, clearing scores and rounds so you can jump right back into the action!

---

## 📁 File Structure

```text
RMCS/
├── backend/                  # Node.js + Socket.io Server
│   ├── .env                  # Environment Variables
│   ├── package.json          # Backend Dependencies
│   └── server.js             # Core Game Logic & Socket Handlers
│
├── frontend/                 # React + Vite Client
│   ├── public/               # Static Assets
│   │   ├── sounds/           # Audio effects (reveal, win, lose, end)
│   │   └── ptree.png         # Favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── EmojiBackground.jsx  # Floating animated background
│   │   │   ├── Game.jsx             # Main game interface & logic
│   │   │   ├── Landing.jsx          # Room creation/joining screen
│   │   │   └── Lobby.jsx            # Waiting room & player status
│   │   ├── App.jsx           # Main state management & view routing
│   │   ├── index.css         # Tailwind & Custom CSS (Glassmorphism, animations)
│   │   └── main.jsx          # React Entry Point
│   ├── index.html            # HTML Template
│   ├── package.json          # Frontend Dependencies
│   └── vite.config.js        # Vite Configuration
└── README.md                 # Project Documentation
```

---

## 💻 Tech Stack

- **Frontend:** React, Vite, TailwindCSS, Socket.io-client
- **Backend:** Node.js, Express, Socket.io
- **Styling:** Custom CSS animations, 3D CSS transforms, Glassmorphism design

---

## 🚀 Running Locally

### Prerequisites
- Node.js installed on your machine

### 1. Start the Backend
Navigate to the backend directory, install dependencies, and start the server:
```bash
cd backend
npm install
node server.js
```
The backend runs on `http://localhost:3001` by default.

### 2. Start the Frontend
Open a new terminal, navigate to the frontend directory, install dependencies, and start the Vite development server:
```bash
cd frontend
npm install
npm run dev
```
The frontend will usually be accessible at `http://localhost:5173`.

---

## 🛠️ Environment Variables

### Frontend (`frontend/.env`)
Create a `.env` file in the `frontend` folder if you want to connect to a deployed backend:
```env
VITE_API_URL=http://localhost:3001
```

### Backend (`backend/.env`)
Create a `.env` file in the `backend` folder to configure the port or CORS origins:
```env
PORT=3001
```

---

## 👨‍💻 Developer

Made with ❤️ by **[PoisonMunna](https://github.com/PoisonMunna)**
