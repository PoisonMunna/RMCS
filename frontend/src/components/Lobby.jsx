import { Users, Copy, CheckCircle2, Check } from 'lucide-react';
import { useState } from 'react';

export default function Lobby({ roomCode, players, currentPlayerId, onReady }) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentPlayer = players.find(p => p.id === currentPlayerId);
  const isReady = currentPlayer?.isReady;
  const readyCount = players.filter(p => p.isReady).length;

  return (
    <div className="glass-card rounded-3xl p-8 w-full max-w-2xl animate-fade-in relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Waiting Room 👀</h2> 
          <p className="text-slate-300">Share this code with your friends 👥</p>
        </div>
        
        <div className="bg-black/30 rounded-2xl p-4 flex items-center gap-4 border border-white/10">
          <div className="text-center">
            <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Room Code 🔐</span>
            <span className="text-2xl font-mono font-bold tracking-[0.2em] text-white">{roomCode}</span>
          </div>
          <button 
            onClick={handleCopyCode}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-white/5"
            title="Copy Code"
          >
            {copied ? <CheckCircle2 className="w-6 h-6 text-green-400" /> : <Copy className="w-6 h-6 text-white" />}
          </button>
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Players Joined 
          </h3>
          <span className="px-3 py-1 bg-black/40 rounded-full text-sm font-medium">
            <span className={players.length === 4 ? "text-green-400" : "text-amber-400"}>{players.length}</span> / 4
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((index) => {
            const player = players[index];
            return (
              <div 
                key={index} 
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  player 
                    ? player.id === currentPlayerId 
                      ? 'bg-blue-500/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                      : 'bg-white/10 border-white/20'
                    : 'bg-black/20 border-white/5 border-dashed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                    player ? 'bg-gradient-to-br from-blue-400 to-indigo-600 shadow-inner text-white' : 'bg-white/5 text-slate-600'
                  }`}>
                    {player ? player.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div>
                    <span className={`block font-medium ${player ? 'text-white' : 'text-slate-500'}`}>
                      {player ? player.name : 'Waiting...'}
                    </span>
                    {player && player.id === currentPlayerId && (
                      <span className="text-xs text-blue-300">You</span>
                    )}
                  </div>
                </div>
                {player && (
                  <div className="flex items-center">
                    {player.isReady ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-1 rounded">
                        <Check className="w-3 h-3" /> Ready 
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400">Not Ready ⏳</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onReady}
          disabled={players.length !== 4 || isReady}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all ${
            isReady
              ? 'bg-green-500/20 text-green-400 cursor-not-allowed border border-green-500/30'
              : players.length === 4
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-lg hover:shadow-blue-500/30'
                : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
          }`}
        >
          {isReady 
            ? `Waiting for others (${readyCount}/4 Ready)` 
            : players.length === 4 
              ? 'I am Ready! 🎮' 
              : 'Waiting for 4 players to join... ⏳'}
        </button>
      </div>
    </div>
  );
}
