
import React, { useEffect, useState } from 'react';

export const Confetti: React.FC = () => {
  const [pieces, setPieces] = useState<any[]>([]);

  useEffect(() => {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    const newPieces = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 5,
      delay: Math.random() * 2,
      duration: Math.random() * 2 + 2
    }));
    setPieces(newPieces);
    const timer = setTimeout(() => setPieces([]), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pieces.map(p => (
        <div
          key={p.id}
          className="absolute rounded-sm animate-fall"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `fall ${p.duration}s linear ${p.delay}s forwards`
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          to { transform: translateY(110vh) rotate(360deg); }
        }
        .animate-fall {
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
};
