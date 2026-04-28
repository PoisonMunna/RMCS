const EMOJIS = ['👑', '🛡️', '🧠', '☠️'];

// Pre-computed deterministic particles so there's no layout thrash
const PARTICLES = [
  // [emoji, left%, top%, sizePx, durationS, delayS, driftX, driftY, rotDeg]
  ['👑', 5,  8,  38, 18, 0,    60,  80, 25],
  ['🛡️',22, 15, 28, 14, -3,  -50,  60, -18],
  ['🧠',40, 5,  32, 20, -1,   40, -70, 30],
  ['☠️',60, 12, 24, 16, -5,  -60,  50, -22],
  ['👑',80, 6,  42, 22, -2,   70, -90, 15],
  ['🛡️',92, 20, 26, 12, 0,  -45,  65, 20],

  ['🧠',10, 35, 20, 15, -4,   55, -55, -30],
  ['☠️',30, 42, 36, 19, -6,  -65,  75, 28],
  ['👑',50, 38, 22, 13, -2,   48, -60, -15],
  ['🛡️',70, 45, 40, 21, -8,  -80,  85, 35],
  ['🧠',88, 32, 30, 17, 0,    58, -68, -25],
  ['☠️',95, 50, 18, 11, -3,  -42,  55, 20],

  ['👑',15, 60, 44, 23, -7,   75, -95, 20],
  ['🛡️',35, 68, 24, 14, -1,  -52,  62, -30],
  ['🧠',55, 55, 34, 18, -5,   62, -75, 25],
  ['☠️',75, 65, 20, 12, -2,  -38,  48, -18],
  ['👑',90, 72, 38, 20, -9,   68, -80, 30],

  ['🛡️',8,  82, 28, 16, -4,  -60,  70, -22],
  ['🧠',28, 78, 42, 24, 0,    80, -100,28],
  ['☠️',48, 88, 22, 13, -6,  -45,  55, 15],
  ['👑',65, 80, 36, 19, -2,   58, -72, -25],
  ['🛡️',82, 85, 18, 11, -8,  -35,  45, 20],
  ['🧠',3,  92, 32, 17, -1,   50, -65, -30],
  ['☠️',92, 95, 26, 15, -5,  -55,  60, 22],
];

const GLOW = {
  '👑': '0 0 18px 4px rgba(250,204,21,0.55)',
  '🛡️': '0 0 18px 4px rgba(96,165,250,0.55)',
  '🧠': '0 0 18px 4px rgba(45,212,191,0.55)',
  '☠️': '0 0 18px 4px rgba(244,63,94,0.55)',
};

export default function EmojiBackground() {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}
    >
      <style>{`
        @keyframes cosmicFloat {
          0%   { transform: translate(0,0) rotate(0deg) scale(1);     opacity: 0.14; }
          25%  { opacity: 0.24; }
          50%  { transform: translate(var(--dx),var(--dy)) rotate(var(--r)) scale(1.2); opacity: 0.19; }
          75%  { opacity: 0.12; }
          100% { transform: translate(0,0) rotate(0deg) scale(1);     opacity: 0.14; }
        }
      `}</style>
      {PARTICLES.map(([emoji, left, top, size, dur, delay, dx, dy, rot], i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: `${left}%`,
            top: `${top}%`,
            fontSize: `${size}px`,
            '--dx': `${dx}px`,
            '--dy': `${dy}px`,
            '--r': `${rot}deg`,
            animation: `cosmicFloat ${dur}s ${delay}s ease-in-out infinite`,
            userSelect: 'none',
            filter: `drop-shadow(${GLOW[emoji] ?? GLOW['👑']})`,
            willChange: 'transform, opacity',
          }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}

