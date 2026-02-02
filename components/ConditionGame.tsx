import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../services/sounds';

interface ConditionGameProps {
  onWin?: () => void;
  isCompleted?: boolean;
  onNext?: () => void;
}

export const ConditionGame: React.FC<ConditionGameProps> = ({ onWin, isCompleted, onNext }) => {
  const [isHappy, setIsHappy] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleRestart = () => {
    sounds.playPop();
    setIsHappy(false);
    setPos({ x: 0, y: 150 });
    setIsDragging(false);
  };

  useEffect(() => {
    const dist = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
    if (dist < 60 && !isHappy) {
      sounds.playSuccess();
      setIsHappy(true);
      if (onWin) onWin();
    }
  }, [pos, isHappy, onWin]);

  const handlePointerMove = (e: React.PointerEvent | PointerEvent) => {
    if (!isDragging || isHappy || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPos({ x: e.clientX - (rect.left + rect.width / 2), y: e.clientY - (rect.top + rect.height / 2) });
  };

  const stopDragging = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', stopDragging);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopDragging);
    };
  }, [isDragging]);

  return (
    <div className="flex flex-col h-full bg-sky-50 rounded-[2rem] p-4 font-kids overflow-hidden">
      <div className="bg-sky-500 p-4 rounded-2xl text-white shadow-lg flex justify-between items-center mb-4">
         <div className="flex-1">
            <h3 className="text-lg font-black uppercase leading-none mb-1">SMART CHOICE (IF/THEN)</h3>
            <p className="text-[9px] font-bold opacity-80 uppercase tracking-widest">Sensing helps the cat decide!</p>
         </div>
         <button onClick={handleRestart} className="bg-sky-600/50 w-10 h-10 rounded-full flex items-center justify-center text-xl border border-white/20">🔄</button>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <div className="w-[38%] flex flex-col gap-3">
           <div className="bg-orange-500 p-4 rounded-[2rem] border-b-4 border-orange-700 shadow-lg relative">
              <div className="absolute -top-2 left-6 bg-white text-orange-600 px-2 py-0.5 rounded-full text-[8px] font-black border border-orange-400 uppercase">THE QUESTION</div>
              <div className="flex flex-col gap-2 pt-2">
                 <p className="text-white font-black text-sm italic uppercase tracking-tighter">IF Cat touches...</p>
                 <div className="bg-sky-400 p-2 rounded-xl border border-sky-200 flex items-center gap-2">
                    <span className="text-xl">🧁</span>
                    <span className="text-white font-black text-[9px] uppercase">CAKE SENSOR</span>
                 </div>
              </div>
           </div>
           <div className="bg-purple-500 p-4 rounded-[2rem] border-b-4 border-purple-700 shadow-lg relative flex-1">
              <div className="absolute -top-2 left-6 bg-white text-purple-600 px-2 py-0.5 rounded-full text-[8px] font-black border border-purple-400 uppercase">THE RESULT</div>
              <p className="text-white font-black text-sm italic uppercase mb-2 pt-2 tracking-tighter">THEN Cat will...</p>
              <div className="bg-white/10 p-4 rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center h-full max-h-[140px]">
                 <span className="text-4xl mb-1">{isHappy ? '😻' : '🐱'}</span>
                 <p className="text-white font-black text-[9px] text-center uppercase tracking-tighter">GET HAPPY!</p>
              </div>
           </div>
        </div>

        <div 
          ref={containerRef}
          className={`flex-1 rounded-[2.5rem] relative flex items-center justify-center overflow-hidden border-4 transition-colors duration-500 shadow-xl ${
            isHappy ? 'bg-sky-300 border-sky-400' : 'bg-indigo-950 border-indigo-900'
          }`}
        >
          <div className="text-[90px] select-none pointer-events-none transition-transform duration-500 transform filter drop-shadow(0 15px 0 rgba(0,0,0,0.5))">
            {isHappy ? '😻' : '🐱'}
          </div>

          {!isHappy && (
            <div 
              onPointerDown={() => { sounds.playPop(); setIsDragging(true); }}
              className="absolute w-20 h-20 flex flex-col items-center justify-center text-5xl cursor-grab active:cursor-grabbing z-30 touch-none select-none bg-white/10 rounded-full border-2 border-white/20 p-2"
              style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.5))' }}
            >
              🧁
              <div className="absolute -top-10 animate-bounce text-3xl">👇</div>
            </div>
          )}

          {isHappy && (
            <div className="absolute inset-0 bg-green-500/98 flex flex-col items-center justify-center z-50 animate-in zoom-in duration-300 p-6 text-center backdrop-blur-md">
              <span className="text-7xl mb-4">🏆</span>
              <h3 className="text-3xl font-black text-white uppercase mb-2">SMART BRAIN!</h3>
              <p className="text-white/80 text-xs font-bold mb-8">The IF-block sensed the cake!</p>
              <div className="flex gap-4">
                <button onClick={handleRestart} className="bg-white/10 text-white px-6 py-3 rounded-xl font-black text-[10px] border-2 border-white/20 uppercase">REPLAY</button>
                <button onClick={() => { sounds.playPop(); onNext?.(); }} className="bg-white text-green-600 px-10 py-4 rounded-2xl font-black text-xl shadow-lg transition-transform hover:scale-105 uppercase">NEXT 🚀</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};