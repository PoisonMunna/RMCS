import { Eye, UserX, Trophy, Shield, Coins, AlertCircle } from 'lucide-react';

export default function Game({ 
  socket, 
  roomCode, 
  players, 
  currentPlayerId, 
  gameState, 
  onRevealRaja, 
  onMantriGuess, 
  onNextRound 
}) {
  const currentPlayer = players.find(p => p.id === currentPlayerId);
  const myRole = currentPlayer?.role?.name;
  
  const raja = players.find(p => p.role?.name === 'Raja');
  const mantri = players.find(p => p.role?.name === 'Mantri');

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
      case 'Raja': return <Trophy className="w-8 h-8 mb-2 mx-auto" />;
      case 'Mantri': return <Eye className="w-8 h-8 mb-2 mx-auto" />;
      case 'Sipahi': return <Shield className="w-8 h-8 mb-2 mx-auto" />;
      case 'Chor': return <UserX className="w-8 h-8 mb-2 mx-auto" />;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      
      {/* Main Game Area */}
      <div className="lg:col-span-2 space-y-6">
        {/* My Role Card */}
        <div className={`glass-card rounded-3xl p-8 text-center border-2 transition-all duration-500 ${gameState.phase !== 'round_end' ? getRoleColor(myRole).split(' ')[1] : 'border-white/10'}`}>
          <h2 className="text-xl text-slate-300 mb-2 font-medium">Your Role</h2>
          <div className={`inline-block p-6 rounded-2xl ${getRoleColor(myRole)} mb-4`}>
            {getRoleIcon(myRole)}
            <h1 className="text-4xl font-black uppercase tracking-widest">{myRole}</h1>
          </div>
          <p className="text-slate-400 text-sm">
            {myRole === 'Raja' && "You are the King. Reveal yourself to start the investigation."}
            {myRole === 'Mantri' && "You are the Minister. Find the thief once the King reveals."}
            {myRole === 'Sipahi' && "You are the Soldier. Stand by and protect the kingdom."}
            {myRole === 'Chor' && "You are the Thief. Don't get caught by the Minister!"}
          </p>
        </div>

        {/* Action Area */}
        <div className="glass-card rounded-3xl p-6 min-h-[250px] flex flex-col items-center justify-center relative overflow-hidden">
          
          {gameState.phase === 'assigning_roles' && (
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 border-4 border-t-amber-500 border-amber-500/30 rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-white mb-2">Roles Assigned!</h3>
              {myRole === 'Raja' ? (
                <button 
                  onClick={onRevealRaja}
                  className="mt-4 bg-gradient-to-r from-yellow-400 to-amber-600 hover:from-yellow-300 hover:to-amber-500 text-black font-bold py-4 px-8 rounded-full text-xl shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all transform hover:scale-105 animate-pulse-glow"
                >
                  I am the Raja (Reveal)
                </button>
              ) : (
                <p className="text-slate-400 text-lg">Waiting for Raja to reveal...</p>
              )}
            </div>
          )}

          {gameState.phase === 'guessing' && (
            <div className="w-full animate-fade-in text-center">
              <div className="mb-6">
                <span className="inline-block px-4 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-sm font-bold border border-yellow-400/30 mb-2">
                  <Trophy className="w-4 h-4 inline mr-1 -mt-1" /> Raja Revealed
                </span>
                <p className="text-white text-lg">
                  <span className="font-bold text-yellow-400">{raja?.name}</span> is the Raja!
                </p>
              </div>

              {myRole === 'Mantri' ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-teal-400 flex items-center justify-center gap-2">
                    <Eye className="w-6 h-6" /> Who is the Chor?
                  </h3>
                  <div className="flex flex-wrap justify-center gap-4">
                    {players
                      .filter(p => p.id !== currentPlayerId && p.id !== raja?.id)
                      .map(p => (
                        <button
                          key={p.id}
                          onClick={() => onMantriGuess(p.id)}
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
                    <AlertCircle className="w-5 h-5 text-teal-400" />
                    Waiting for Mantri (<span className="text-teal-400 font-bold">{mantri?.name}</span>) to guess...
                  </p>
                </div>
              )}
            </div>
          )}

          {gameState.phase === 'round_end' && (
            <div className="text-center animate-fade-in w-full">
              {gameState.isGameOver ? (
                <div className="mb-8">
                  <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
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
                      {gameState.lastRoundResult.correctGuess ? "Mantri Guessed Correctly!" : "Mantri Guessed Wrong!"}
                    </h3>
                    <p className="text-slate-300 mt-2">
                      Mantri chose {gameState.lastRoundResult.guessedPlayerName}.
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

        </div>
      </div>

      {/* Leaderboard Sidebar */}
      <div className="lg:col-span-1">
        <div className="glass-card rounded-3xl p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <Coins className="w-6 h-6 text-amber-400" />
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
