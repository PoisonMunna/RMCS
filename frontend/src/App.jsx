import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Landing from './components/Landing';
import Lobby from './components/Lobby';
import Game from './components/Game';

// Change this in production or use .env file
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [socket, setSocket] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [players, setPlayers] = useState([]);
  const [view, setView] = useState('landing'); // 'landing', 'lobby', 'game'
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('room_update', ({ players }) => {
      setPlayers(players);
    });

    socket.on('game_started', ({ players, endCondition }) => {
      setPlayers(players);
      setView('game');
      setGameState({ phase: 'assigning_roles', rajaRevealed: false, endCondition });
    });

    socket.on('raja_revealed', () => {
      setGameState(prev => ({ ...prev, rajaRevealed: true, phase: 'guessing' }));
    });

    socket.on('round_ended', ({ players, correctGuess, guessedPlayerName, isGameOver, winner }) => {
      setPlayers(players);
      setGameState(prev => ({ 
        ...prev, 
        phase: 'round_end',
        lastRoundResult: { correctGuess, guessedPlayerName },
        isGameOver,
        winner
      }));
    });

    socket.on('player_disconnected', ({ message }) => {
      alert(message);
      // Depending on the exact scenario, might want to kick everyone to lobby
      if (view === 'game') {
        setView('lobby');
        setGameState(null);
      }
    });

    return () => {
      socket.off('room_update');
      socket.off('game_started');
      socket.off('raja_revealed');
      socket.off('round_ended');
      socket.off('player_disconnected');
    };
  }, [socket, view]);

  const handleCreateRoom = (name, botCount, endCondition) => {
    setPlayerName(name);
    socket.emit('create_room', { playerName: name, botCount, endCondition }, (response) => {
      if (response.success) {
        setRoomCode(response.roomCode);
        setPlayers(response.players);
        setView('lobby');
      } else {
        alert(response.message || 'Error creating room');
      }
    });
  };

  const handleJoinRoom = (name, code) => {
    setPlayerName(name);
    socket.emit('join_room', { playerName: name, roomCode: code }, (response) => {
      if (response.success) {
        setRoomCode(response.roomCode);
        setPlayers(response.players);
        setView('lobby');
      } else {
        alert(response.message || 'Error joining room');
      }
    });
  };

  const handleReady = () => {
    socket.emit('player_ready', { roomCode });
  };

  const handleRevealRaja = () => {
    socket.emit('reveal_raja', { roomCode });
  };

  const handleMantriGuess = (guessedPlayerId) => {
    socket.emit('mantri_guess', { roomCode, guessedPlayerId });
  };

  const handleNextRound = () => {
    setView('lobby');
    setGameState(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {view === 'landing' && (
        <Landing 
          onCreateRoom={handleCreateRoom} 
          onJoinRoom={handleJoinRoom} 
        />
      )}
      
      {view === 'lobby' && (
        <Lobby 
          roomCode={roomCode} 
          players={players} 
          currentPlayerId={socket?.id}
          onReady={handleReady} 
        />
      )}
      
      {view === 'game' && gameState && (
        <Game 
          socket={socket}
          roomCode={roomCode}
          players={players}
          currentPlayerId={socket?.id}
          gameState={gameState}
          onRevealRaja={handleRevealRaja}
          onMantriGuess={handleMantriGuess}
          onNextRound={handleNextRound}
        />
      )}
    </div>
  );
}

export default App;
