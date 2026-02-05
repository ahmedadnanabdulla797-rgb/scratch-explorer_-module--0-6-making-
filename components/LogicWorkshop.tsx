import React, { useState, useEffect, useCallback } from 'react';
import { sounds } from '../services/sounds';

type WorkshopMode = 'LOOP' | 'CONDITION' | 'LOGIC' | 'FINAL' | 'PLAYGROUND';

export const LogicWorkshop: React.FC<{ mode: WorkshopMode, onWin?: () => void, isCompleted?: boolean, onNext?: () => void }> = ({ mode, onWin, isCompleted, onNext }) => {
  const [blocks, setBlocks] = useState<{ id: number; color: string; emoji: string }[]>([]);
  const [isWin, setIsWin] = useState(false);
  
  const isCreative = mode === 'PLAYGROUND' || mode === 'FINAL';

  const blockEmojis = ['📦', '🎁', '🧸', '🎨', '🧱', '🍭'];
  const colors = ['bg-red-400', 'bg-blue-400', 'bg-yellow-400', 'bg-green-400', 'bg-purple-400'];

  const setup = useCallback(() => {
    setBlocks([]);
    setIsWin(false);
  }, []);

  useEffect(() => { setup(); }, [setup]);

  const dropBlock = () => {
    // Stop dropping if we already won (Logic mode)
    if (isWin && !isCreative) return;

    sounds.playPop();
    
    const newBlock = {
      id: Date.now(),
      color: colors[blocks.length % colors.length],
      emoji: blockEmojis[blocks.length % blockEmojis.length],
    };

    // We calculate the count immediately to solve the "lag"
    const nextCount = blocks.length + 1;
    setBlocks(prev => [...prev, newBlock]);

    // INSTANT WIN CHECK: No setTimeout, no delay. 
    // Triggers exactly when the 5th block is "caught"
    if (nextCount >= 5) {
      setIsWin(true);
      sounds.playSuccess();
      if (onWin) onWin();
    }
  };

  return (
    <div className={`h-full w-full flex flex-col font-['Fredoka'] overflow-hidden transition-colors duration-500 ${isCreative ? 'bg-orange-50' : 'bg-sky-100'}`}>
      
      <div className="bg-[#1e1b4b] text-white px-4 py-2 flex items-center justify-between border-b-4 border-black/20 shrink-0">
        <h2 className="text-[10px] font-black uppercase tracking-widest">
            {isCreative ? "🎵 Music Maker" : "🏗️ Stack the Toys!"}
        </h2>
        <div className="text-[10px] font-black bg-white/20 px-3 py-1 rounded-full">
            {isCreative ? "DANCE PARTY!" : `STACK: ${blocks.length}/5`}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-between p-4 overflow-hidden">
        
        <div className="relative w-full max-w-[240px] h-[280px] bg-white/50 rounded-[2.5rem] border-b-[8px] border-slate-400 shadow-inner flex flex-col-reverse items-center overflow-visible">
          
          {!isWin && (
            <div className="absolute top-2 animate-bounce">
              <span className="text-5xl drop-shadow-lg">{isCreative ? "🎉" : "⭐"}</span>
            </div>
          )}

          <div className="flex flex-col-reverse items-center mb-1">
            {blocks.map((block) => (
              <div 
                key={block.id}
                className={`${block.color} w-20 h-12 rounded-xl flex items-center justify-center text-3xl shadow-[0_4px_0_0_rgba(0,0,0,0.2)] border-2 border-white/30 animate-in slide-in-from-top-10 duration-300`}
                style={{ marginBottom: '2px' }}
              >
                {block.emoji}
              </div>
            ))}
          </div>

          <div className="absolute bottom-[-8px] w-[110%] h-3 bg-slate-500 rounded-full" />
        </div>

        <div className="w-full flex justify-center pb-2 shrink-0">
          <button 
            onClick={dropBlock}
            className="w-24 h-24 bg-red-500 rounded-full border-b-[8px] border-red-800 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center justify-center shadow-lg"
          >
            <span className="text-3xl">🚀</span>
            <span className="text-white font-black text-[10px] uppercase">PUSH!</span>
          </button>
        </div>
      </div>

      {isWin && (
        <div className="absolute inset-0 z-[100] bg-indigo-900/90 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-in zoom-in">
          <div className="text-8xl mb-4 animate-bounce">🎉</div>
          <h3 className="text-3xl font-black text-white text-center uppercase">Amazing!</h3>
          <button 
            onClick={() => onNext?.()} 
            className="mt-6 bg-emerald-500 text-white px-12 py-4 rounded-[1.5rem] font-black text-xl shadow-[0_8px_0_0_#065f46]"
          >
            NEXT 🚀
          </button>
        </div>
      )}
    </div>
  );
};
