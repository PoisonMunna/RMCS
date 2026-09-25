import { useState, useEffect } from 'react';

export default function Game({ 
  socket, 
  roomCode, 
  players, 
  currentPlayerId, 
  gameState, 
  onRevealRaja, 
  onSipahiGuess, 
  onNextRound 
}) {
  const currentPlayer = players.find(p => p.id === currentPlayerId);
  const myRole = currentPlayer?.role?.name;
  
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (gameState.phase === 'assigning_roles') {
      setIsRevealed(false);
    }
  }, [gameState.phase]);

  // Audio effects
  useEffect(() => {
    if (isRevealed) {
      new Audio('/sounds/reveal.mp3').play().catch(e => console.log('Audio play failed:', e));
    }
  }, [isRevealed]);

  useEffect(() => {
    if (gameState.phase === 'round_end') {
      const correct = gameState.lastRoundResult?.correctGuess;
      
      if (myRole === 'Sipahi') {
        const sound = correct ? '/sounds/win.mp3' : '/sounds/lose.mp3';
        new Audio(sound).play().catch(e => console.log('Audio play failed:', e));
      } else if (myRole === 'Chor') {
        const sound = correct ? '/sounds/lose.mp3' : '/sounds/win.mp3';
        new Audio(sound).play().catch(e => console.log('Audio play failed:', e));
      }
      
      if (gameState.isGameOver) {
        setTimeout(() => {
          new Audio('/sounds/end.mp3').play().catch(e => console.log('Audio play failed:', e));
        }, 800);
      }
    }
  }, [gameState.phase, gameState.isGameOver, gameState.lastRoundResult, myRole]);
  
  const raja = players.find(p => p.role?.name === 'Raja');
  const sipahi = players.find(p => p.role?.name === 'Sipahi');

  // Sorted players for leaderboard
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const getRoleColor = (role) => {
    switch (role) {
      case 'Raja': return 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10 shadow-[0_0_15px_rgba(250,204,21,0.3)]';
      case 'Mantri': return 'text-teal-400 border-teal-400/50 bg-teal-400/10 shadow-[0_0_15px_rgba(45,212,191,0.3)]';
      case 'Sipahi': return 'text-blue-400 border-blue-400/50 bg-blue-400/10 shadow-[0_0_15px_rgba(96,165,250,0.3)]';
      case 'Chor': return 'text-rose-500 border-rose-500/50 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.3)]';
      default: return 'text-white border-white/20 bg-white/5';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Raja': return <div className="text-5xl mb-2 mx-auto">👑</div>;
      case 'Mantri': return <div className="text-5xl mb-2 mx-auto">🧠</div>;
      case 'Sipahi': return <div className="text-5xl mb-2 mx-auto">🛡️</div>;
      case 'Chor': return <div className="text-5xl mb-2 mx-auto">☠️</div>;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      
      {/* Main Game Area */}
      <div className="lg:col-span-2 space-y-6">
        {/* My Role Card */}
        <div className="perspective-1000 max-w-sm mx-auto w-full">
          <div className={`relative w-full transition-transform duration-1000 transform-style-3d ${isRevealed ? 'rotate-y-180' : ''}`}>
            
            {/* Front of Card (Unrevealed State) */}
            <div 
              onClick={() => setIsRevealed(true)}
              className={`absolute inset-0 w-full h-full backface-hidden glass-card rounded-3xl p-8 flex flex-col items-center justify-center border-2 border-white/10 z-10 cursor-pointer hover:border-yellow-400/30 hover:shadow-[0_0_20px_rgba(250,204,21,0.2)] transition-all group ${isRevealed ? 'pointer-events-none' : ''}`}
            >
              <div className="text-7xl mb-6 animate-pulse group-hover:scale-110 transition-transform duration-300">❓</div>
              <h2 className="text-2xl font-black text-white tracking-widest uppercase group-hover:text-yellow-400 transition-colors">Secret Card</h2>
              <p className="text-slate-400 mt-2 text-sm font-medium">Click to reveal...</p>
            </div>

            {/* Back of Card (Revealed Role) */}
            <div className={`backface-hidden rotate-y-180 bg-white/10 backdrop-blur-md shadow-xl rounded-3xl p-8 text-center border-2 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center min-h-[420px] ${gameState.phase !== 'round_end' ? getRoleColor(myRole).split(' ')[1] : 'border-white/10'}`}>
              <h2 className="text-xl text-slate-300 mb-2 font-medium">You Are</h2> 
              <div className={`inline-block p-6 rounded-2xl ${getRoleColor(myRole)} mb-4`}>
                {getRoleIcon(myRole)}
                <h1 className="text-4xl font-black uppercase tracking-widest">{myRole}</h1>
              </div>
              <p className="text-slate-400 text-sm">
                {myRole === 'Raja' && "You are the King. Reveal yourself to start the investigation."}
                {myRole === 'Mantri' && "You are the Minister. You get 800 points for your wisdom."}
                {myRole === 'Sipahi' && "You are the Soldier. Find the Thief between the remaining hidden players!"}
                {myRole === 'Chor' && "You are the Thief. Try to trick the Soldier into guessing wrong!"}
              </p>
            </div>
            
          </div>
        </div>

        {/* Action Area */}
        <div className="glass-card rounded-3xl p-6 min-h-[250px] flex flex-col items-center justify-center relative overflow-hidden">
          
          {!isRevealed ? (
            <div className="text-center animate-pulse">
              <div className="text-5xl mb-4">👆</div>
              <h3 className="text-2xl font-bold text-slate-300 mb-2">Reveal your role!</h3>
              <p className="text-slate-500 text-lg">Click the card above to see who you are</p>
            </div>
          ) : (
            <>
              {gameState.phase === 'assigning_roles' && (
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 border-4 border-t-amber-500 border-amber-500/30 rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-white mb-2">Roles Assigned!</h3>
              {myRole === 'Raja' ? (
                <button 
                  onClick={onRevealRaja}
                  className="mt-4 bg-gradient-to-r from-yellow-400 to-amber-600 hover:from-yellow-300 hover:to-amber-500 text-black font-bold py-4 px-8 rounded-full text-xl shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all transform hover:scale-105 animate-pulse-glow"
                >
                  I am the Raja 👑 (Reveal)
                </button>
              ) : (
                <p className="text-slate-400 text-lg">Waiting for Raja 👑 to reveal...</p>
              )}
            </div>
          )}

          {gameState.phase === 'guessing' && (
            <div className="w-full animate-fade-in text-center">
              <div className="mb-6">
                <span className="inline-block px-4 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-sm font-bold border border-yellow-400/30 mb-2">
                  <span className="inline-block mr-1">👑</span> Raja Revealed
                </span>
                <p className="text-white text-lg">
                  <span className="font-bold text-yellow-400">{raja?.name}</span> is the Raja 👑!
                </p>
              </div>

              {myRole === 'Sipahi' ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-blue-400 flex items-center justify-center gap-2">
                    <span className="text-2xl">🛡️</span> Who is the Chor?
                  </h3>
                  <div className="flex flex-wrap justify-center gap-4">
                    {players
                      .filter(p => p.id !== currentPlayerId && p.id !== raja?.id)
                      .map(p => (
                        <button
                          key={p.id}
                          onClick={() => onSipahiGuess(p.id)}
                          className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-4 rounded-xl text-lg font-medium transition-all hover:scale-105"
                        >
                          Is <span className="font-bold text-white">{p.name}</span> the Chor?
                        </button>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-slate-300 text-lg flex items-center justify-center gap-2">
                    <span className="text-xl">⏳</span>
                    Waiting for Sipahi (<span className="text-blue-400 font-bold">{sipahi?.name}</span>) to guess...
                  </p>
                </div>
              )}
            </div>
          )}

          {gameState.phase === 'round_end' && (
            <div className="text-center animate-fade-in w-full">
              {gameState.isGameOver ? (
                <div className="mb-8">
                  <div className="text-6xl mx-auto mb-4">🏆</div>
                  <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600 mb-2">
                    GAME OVER!
                  </h2>
                  <p className="text-2xl text-white">
                    Winner: <span className="font-bold text-yellow-400">{gameState.winner.name}</span>
                  </p>
                </div>
              ) : (
                <>
                  <div className={`inline-block p-4 rounded-2xl mb-6 border ${gameState.lastRoundResult.correctGuess ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                    <h3 className={`text-2xl font-bold ${gameState.lastRoundResult.correctGuess ? 'text-green-400' : 'text-red-400'}`}>
                      {gameState.lastRoundResult.correctGuess ? "Sipahi Guessed Correctly! 🛡️" : "Sipahi Guessed Wrong! ☠️"}
                    </h3>
                    <p className="text-slate-300 mt-2">
                      Sipahi chose {gameState.lastRoundResult.guessedPlayerName}. {gameState.lastRoundResult.correctGuess ? "Chor pakra gaya !" : "Chor bach gaya !"}
                    </p>
                  </div>
                </>
              )}

              <button 
                onClick={onNextRound}
                className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-xl border border-white/20 transition-all shadow-lg mx-auto block"
              >
                {gameState.isGameOver ? 'Back to Lobby (New Game)' : 'Next Round'}
              </button>
            </div>
          )}

            </>
          )}

        </div>
      </div>

      {/* Leaderboard Sidebar */}
      <div className="lg:col-span-1">
        <div className="glass-card rounded-3xl p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <span className="text-2xl">🪙</span>
            <h3 className="text-2xl font-bold text-white">Leaderboard</h3>
          </div>
          
          <div className="space-y-3 flex-1 overflow-y-auto pr-2">
            {sortedPlayers.map((p, index) => (
              <div 
                key={p.id} 
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  p.id === currentPlayerId 
                    ? 'bg-blue-500/20 border-blue-500/30' 
                    : 'bg-black/20 border-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-yellow-400 text-yellow-900 shadow-[0_0_10px_rgba(250,204,21,0.5)]' :
                    index === 1 ? 'bg-slate-300 text-slate-800' :
                    index === 2 ? 'bg-amber-600 text-amber-100' :
                    'bg-white/10 text-slate-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <span className={`block font-semibold ${p.id === currentPlayerId ? 'text-white' : 'text-slate-300'}`}>
                      {p.name}
                    </span>
                    {gameState.phase === 'round_end' && p.role && (
                      <span className={`text-xs ${getRoleColor(p.role.name).split(' ')[0]}`}>
                        {p.role.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-amber-400 text-lg">
                    {p.score}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Points</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <p className="text-xs text-slate-500">
              {gameState.endCondition?.type === 'rounds' 
                ? `Game ends after ${gameState.endCondition.value} rounds!`
                : `First to ${gameState.endCondition?.value?.toLocaleString() || '20,000'} points wins!`}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
