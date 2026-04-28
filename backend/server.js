require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('RMCS Backend is running!');
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => callback(null, true), // Allow all origins safely
    methods: ["GET", "POST"]
  }
});

const rooms = {};

const ROLES = [
  { name: 'Raja', points: 1000 },
  { name: 'Mantri', points: 800 },
  { name: 'Chor', points: 0 },
  { name: 'Sipahi', points: 500 }
];

const processMantriGuess = (roomCode, guessedPlayerId) => {
  const room = rooms[roomCode];
  if (!room) return;

  const mantri = room.players.find(p => p.role?.name === 'Mantri');
  const chor = room.players.find(p => p.role?.name === 'Chor');
  const guessedPlayer = room.players.find(p => p.id === guessedPlayerId);

  if (!mantri || !chor || !guessedPlayer) return;

  let correctGuess = false;

  if (guessedPlayer.role.name === 'Chor') {
    mantri.score += 800;
    correctGuess = true;
  } else {
    chor.score += 800;
  }

  const raja = room.players.find(p => p.role?.name === 'Raja');
  const sipahi = room.players.find(p => p.role?.name === 'Sipahi');
  
  if (raja) raja.score += 1000;
  if (sipahi) sipahi.score += 500;

  room.currentRound = (room.currentRound || 0) + 1;
  room.state = 'waiting';
  
  let isGameOver = false;
  if (room.endCondition && room.endCondition.type === 'rounds') {
    isGameOver = room.currentRound >= room.endCondition.value;
  } else {
    const targetPoints = room.endCondition ? room.endCondition.value : 20000;
    isGameOver = room.players.some(p => p.score >= targetPoints);
  }

  let winner = null;
  if (isGameOver) {
    winner = room.players.reduce((prev, current) => (prev.score > current.score) ? prev : current);
  }

  io.to(roomCode).emit('round_ended', { 
    players: room.players, 
    correctGuess,
    guessedPlayerName: guessedPlayer.name,
    isGameOver,
    winner
  });
};

const handleBotMantri = (roomCode) => {
  const room = rooms[roomCode];
  if (!room) return;

  const mantri = room.players.find(p => p.role?.name === 'Mantri');
  if (mantri && mantri.isBot) {
    setTimeout(() => {
      const currentRoom = rooms[roomCode];
      if (!currentRoom || currentRoom.state !== 'playing' || !currentRoom.rajaRevealed) return;

      const validTargets = currentRoom.players.filter(p => p.role?.name !== 'Raja' && p.role?.name !== 'Mantri');
      if (validTargets.length > 0) {
        const randomTarget = validTargets[Math.floor(Math.random() * validTargets.length)];
        processMantriGuess(roomCode, randomTarget.id);
      }
    }, 3000);
  }
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create_room', ({ playerName, botCount = 0, endCondition }, callback) => {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const players = [{
      id: socket.id,
      name: playerName,
      score: 0,
      role: null,
      isReady: false,
      isBot: false
    }];

    for (let i = 0; i < botCount; i++) {
      players.push({
        id: `bot_${roomCode}_${i}`,
        name: `Bot ${i + 1}`,
        score: 0,
        role: null,
        isReady: true,
        isBot: true
      });
    }

    rooms[roomCode] = {
      players,
      state: 'waiting',
      rajaRevealed: false,
      endCondition: endCondition || { type: 'points', value: 20000 },
      currentRound: 0
    };

    socket.join(roomCode);
    callback({ success: true, roomCode, players: rooms[roomCode].players });
  });

  socket.on('join_room', ({ playerName, roomCode }, callback) => {
    roomCode = roomCode.toUpperCase();
    const room = rooms[roomCode];

    if (!room) {
      return callback({ success: false, message: 'Room not found' });
    }
    
    if (room.players.length >= 4) {
      return callback({ success: false, message: 'Room is full' });
    }

    if (room.state !== 'waiting') {
      return callback({ success: false, message: 'Game already in progress' });
    }

    room.players.push({
      id: socket.id,
      name: playerName,
      score: 0,
      role: null,
      isReady: false,
      isBot: false
    });

    socket.join(roomCode);
    io.to(roomCode).emit('room_update', { players: room.players });
    callback({ success: true, roomCode, players: room.players });
  });

  socket.on('player_ready', ({ roomCode }) => {
    const room = rooms[roomCode];
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.isReady = true;
      io.to(roomCode).emit('room_update', { players: room.players });

      if (room.players.length === 4 && room.players.every(p => p.isReady)) {
        room.state = 'playing';
        room.rajaRevealed = false;

        const shuffledRoles = [...ROLES].sort(() => Math.random() - 0.5);
        room.players.forEach((p, index) => {
          p.role = shuffledRoles[index];
          p.isReady = p.isBot ? true : false; // Reset for next round, bots always ready
        });

        io.to(roomCode).emit('game_started', { players: room.players, endCondition: room.endCondition });

        // Handle bot Raja auto-reveal
        const raja = room.players.find(p => p.role?.name === 'Raja');
        if (raja && raja.isBot) {
          setTimeout(() => {
            const currentRoom = rooms[roomCode];
            if (currentRoom && currentRoom.state === 'playing' && !currentRoom.rajaRevealed) {
              currentRoom.rajaRevealed = true;
              io.to(roomCode).emit('raja_revealed');
              handleBotMantri(roomCode);
            }
          }, 2000);
        }
      }
    }
  });

  socket.on('reveal_raja', ({ roomCode }) => {
    const room = rooms[roomCode];
    if (!room) return;

    room.rajaRevealed = true;
    io.to(roomCode).emit('raja_revealed');
    
    handleBotMantri(roomCode);
  });

  socket.on('mantri_guess', ({ roomCode, guessedPlayerId }) => {
    processMantriGuess(roomCode, guessedPlayerId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (const roomCode in rooms) {
      const room = rooms[roomCode];
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        
        if (room.players.length === 0 || room.players.every(p => p.isBot)) {
          delete rooms[roomCode];
        } else {
          room.state = 'waiting'; // Reset game state if someone leaves
          room.players.forEach(p => {
             p.role = null;
             p.isReady = p.isBot ? true : false;
          });
          io.to(roomCode).emit('room_update', { players: room.players });
          io.to(roomCode).emit('player_disconnected', { message: 'A player disconnected. Game reset.' });
        }
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
