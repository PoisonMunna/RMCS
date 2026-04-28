import { useState } from 'react';
import { Crown, Swords, UserPlus } from 'lucide-react';

export default function Landing({ onCreateRoom, onJoinRoom }) {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [botCount, setBotCount] = useState(0);
  const [endConditionType, setEndConditionType] = useState('points');
  const [endConditionValue, setEndConditionValue] = useState(20000);
  const [mode, setMode] = useState('initial'); // 'initial', 'create', 'join'

  const handleCreate = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onCreateRoom(name.trim(), botCount, { type: endConditionType, value: endConditionValue });
    }
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (name.trim() && roomCode.trim().length === 6) {
      onJoinRoom(name.trim(), roomCode.trim());
    }
  };

  return (
    <div className="glass-card rounded-3xl p-8 w-full max-w-md animate-fade-in relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500"></div>
      
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 tracking-tight">
          <span className="text-gradient-gold">Raja </span> 👑 Mantri 🧠<br/>Chor ☠️ <span className="text-gradient">Sipahi </span>🛡️
        </h1>
        <p className="text-slate-300 text-sm">The classic game of trust, betrayal, and strategy 👀</p>
      </div>

      {mode === 'initial' && (
        <div className="space-y-4">
          <button 
            onClick={() => setMode('create')}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-orange-500/30"
          >
            <Crown className="w-6 h-6" />
            Create New Room
          </button>
          
          <button 
            onClick={() => setMode('join')}
            className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 rounded-xl transition-all border border-white/10"
          >
            <UserPlus className="w-6 h-6" />
            Join Existing Room
          </button>
        </div>
      )}

      {mode === 'create' && (
        <form onSubmit={handleCreate} className="space-y-4 animate-fade-in">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4"
              placeholder="Enter your name"
              required
              maxLength={15}
            />
            
            <label className="block text-sm font-medium text-slate-300 mb-2">Number of Bots</label>
            <select
              value={botCount}
              onChange={(e) => setBotCount(parseInt(e.target.value))}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4"
            >
              <option value={0} className="bg-slate-800">0 Bots (Play with 3 friends)</option>
              <option value={1} className="bg-slate-800">1 Bot (Play with 2 friends)</option>
              <option value={2} className="bg-slate-800">2 Bots (Play with 1 friend)</option>
              <option value={3} className="bg-slate-800">3 Bots (Play Solo)</option>
            </select>

            <label className="block text-sm font-medium text-slate-300 mb-2">Game End Condition</label>
            <div className="flex gap-2">
              <select
                value={endConditionType}
                onChange={(e) => {
                  setEndConditionType(e.target.value);
                  setEndConditionValue(e.target.value === 'points' ? 20000 : 5);
                }}
                className="w-1/2 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="points" className="bg-slate-800">Points</option>
                <option value="rounds" className="bg-slate-800">Rounds</option>
              </select>
              <select
                value={endConditionValue}
                onChange={(e) => setEndConditionValue(parseInt(e.target.value))}
                className="w-1/2 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {endConditionType === 'points' ? (
                  Array.from({ length: 10 }, (_, i) => (i + 1) * 5000).map(val => (
                    <option key={val} value={val} className="bg-slate-800">{val.toLocaleString()} Pts</option>
                  ))
                ) : (
                  Array.from({ length: 10 }, (_, i) => (i + 1) * 5).map(val => (
                    <option key={val} value={val} className="bg-slate-800">{val} Rounds</option>
                  ))
                )}
              </select>
            </div>
          </div>
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all"
          >
            Create Game 🎮
          </button>
          <button 
            type="button"
            onClick={() => setMode('initial')}
            className="w-full text-slate-400 hover:text-white text-sm py-2 transition-colors"
          >
            Back 🔙
          </button>
        </form>
      )}

      {mode === 'join' && (
        <form onSubmit={handleJoin} className="space-y-4 animate-fade-in">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
              placeholder="Enter your name"
              required
              maxLength={15}
            />
            
            <label className="block text-sm font-medium text-slate-300 mb-2">Room Code</label>
            <input 
              type="text" 
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-center tracking-[0.2em] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 uppercase"
              placeholder="6-DIGIT-CODE"
              required
              maxLength={6}
              minLength={6}
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            Join Game 🤝
          </button>
          <button 
            type="button"
            onClick={() => setMode('initial')}
            className="w-full text-slate-400 hover:text-white text-sm py-2 transition-colors"
          >
            Back 🔙
          </button>
        </form>
      )}

      {/* Footer */}
      <div className="mt-8 text-center text-slate-400 text-sm border-t border-white/10 pt-6">
        <p>Made by <span className="text-white font-semibold">PoisonMunna</span> ⭐</p>
        <div className="flex justify-center gap-4 mt-3">
          <a href="https://github.com/PoisonMunna" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors font-medium">GitHub</a>
          <span className="text-slate-600">|</span>
          <a href="https://linkedin.com/in/mayank-raj-067248341" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors font-medium">LinkedIn</a>
        </div>
      </div>
    </div>
  );
}
