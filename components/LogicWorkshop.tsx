import React, { useState, useEffect, useCallback } from 'react';
import { sounds } from '../services/sounds';

type WorkshopMode = 'LOOP' | 'CONDITION' | 'LOGIC' | 'FINAL' | 'PLAYGROUND';

export const LogicWorkshop: React.FC<{ mode: WorkshopMode, onWin?: () => void, isCompleted?: boolean, onNext?: () => void }> = ({ mode, onWin, isCompleted, onNext }) => {
  const [blocks, setBlocks] = useState<{ id: number; y: number; color: string; emoji: string }[]>([]);
  const [isWin, setIsWin] = useState(false);
  const isCreative = mode === 'PLAYGROUND';

  const blockEmojis = ['📦', '🎁', '🧸', '🎨', '🧱', '🍭'];
  const colors = ['bg-red-400', 'bg-blue-400', 'bg-yellow-400', 'bg-green-400', 'bg-purple-400'];

  const setup = useCallback(() => {
    setBlocks([]);
    setIsWin(false);
  }, []);

  useEffect(() => { setup(); }, [setup]);

  // MODULE 5: Logic - Adding a "Clone" (Block)
  const dropBlock = () => {
    if (isWin && !isCreative) return;

    sounds.playPop();
    
    const newBlock = {
      id: Date.now(),
      y: blocks.length * -60, // Stack them upwards
      color: colors[blocks.length % colors.length],
      emoji: blockEmojis[blocks.length % blockEmojis.length],
    };

    setBlocks(prev => [...prev, newBlock]);

    // Win condition: Stack 5 blocks to reach the star
    if (!isCreative && blocks.length >= 4) {
      setTimeout(() => {
        setIsWin(true);
        sounds.playSuccess();
        if (onWin) onWin();
      }, 500);
    }
  };

  return (
    <div className={`h-full flex flex-col font-['Fredoka'] overflow-hidden transition-colors duration-500 ${isCreative ? 'bg-orange-50' : 'bg-sky-100'}`}>
      
      {/* Header */}
      <div className="bg-[#1e1b4b] text-white px-4 py-3 flex items-center justify-between border-b-4 border-black/20">
        <h2 className="text-xs font-black uppercase tracking-widest">
            {isCreative ? "🎵 Music Maker" : "🏗️ Stack the Toys!"}
        </h2>
        <div className="text-xs font-black bg-white/20 px-3 py-1 rounded-full">
            {isCreative ? "FREE PLAY" : `STACK: ${blocks.length}/5`}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-between p-6">
        
        {/* THE STAGE */}
        <div className="relative w-full max-w-[300px] h-[400px] bg-white/50 rounded-[3rem] border-b-[12px] border-slate-400 shadow-inner flex flex-col-reverse items-center overflow-visible">
          
          {/* THE STAR (Target) */}
          {!isCreative && !isWin && (
            <div className="absolute top-0 animate-bounce">
              <span className="text-6xl drop-shadow-lg">⭐</span>
            </div>
          )}

          {/* THE BLOCKS (Clones) */}
          {blocks.map((block, index) => (
            <div 
              key={block.id}
              className={`${block.color} w-24 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-[0_6px_0_0_rgba(0,0,0,0.2)] border-2 border-white/30 animate-in slide-in-from-top-20 duration-300`}
              style={{ marginBottom: '4px' }}
            >
              {block.emoji}
            </div>
          ))}

          {/* Floor */}
          <div className="absolute bottom-[-12px] w-[120%] h-4 bg-slate-500 rounded-full" />
        </div>

        {/* THE BIG ACTION BUTTON */}
        <div className="w-full max-w-[200px] pt-4">
          <button 
            onClick={dropBlock}
            className="w-full aspect-square bg-red-500 rounded-full border-b-[10px] border-red-800 active:border-b-0 active:translate-y-2 transition-all flex flex-col items-center justify-center shadow-xl group"
          >
            <span className="text-5xl group-active:scale-110 transition-transform">🚀</span>
            <span className="text-white font-black text-lg mt-2 uppercase tracking-tighter">PUSH!</span>
          </button>
        </div>
      </div>

      {/* Win Screen */}
      {isWin && (
        <div className="absolute inset-0 z-[100] bg-indigo-900/90 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-in zoom-in">
          <div className="text-9xl mb-6 animate-bounce">🎉</div>
          <h3 className="text-4xl font-black text-white text-center uppercase leading-tight">Amazing!<br/>You Built it!</h3>
          <button 
            onClick={() => onNext?.()} 
            className="mt-10 bg-emerald-500 text-white px-16 py-6 rounded-[2rem] font-black text-2xl shadow-[0_10px_0_0_#065f46] active:translate-y-2 transition-all"
          >
            NEXT LEVEL 🚀
          </button>
        </div>
      )}
    </div>
  );
};
