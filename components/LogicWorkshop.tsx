import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sounds } from '../services/sounds';

type WorkshopMode = 'LOOP' | 'CONDITION' | 'LOGIC' | 'FINAL' | 'PLAYGROUND';

export const LogicWorkshop: React.FC<{ mode: WorkshopMode, onWin?: () => void, isCompleted?: boolean, onNext?: () => void }> = ({ mode, onWin, isCompleted, onNext }) => {
  const [spriteState, setSpriteState] = useState({ x: 0, y: 0, rotation: 0, say: '', hearts: 3, score: 0 });
  const [isWin, setIsWin] = useState(false);
  const stageSize = 340;

  // Reset level
  const setup = useCallback(() => {
    setIsWin(false);
    setSpriteState({ x: 0, y: 0, rotation: 0, say: '', hearts: 3, score: 0 });
  }, []);

  useEffect(() => { setup(); }, [setup]);

  // Direct Control Movement for Toddlers
  const moveManual = (dir: 'U' | 'D' | 'L' | 'R') => {
    if (isWin) return;
    sounds.playPop();
    
    setSpriteState(p => {
      let nx = p.x;
      let ny = p.y;
      let nr = p.rotation;
      const step = 40;

      if (dir === 'U') { ny -= step; nr = 270; }
      if (dir === 'D') { ny += step; nr = 90; }
      if (dir === 'L') { nx -= step; nr = 180; }
      if (dir === 'R') { nx += step; nr = 0; }

      // Keep inside bounds
      nx = Math.max(-stageSize/2 + 40, Math.min(stageSize/2 - 40, nx));
      ny = Math.max(-stageSize/2 + 40, Math.min(stageSize/2 - 40, ny));

      // Check if found the Star (at roughly -80, -80)
      if (Math.abs(nx - (-80)) < 45 && Math.abs(ny - (-80)) < 45) {
        handleWin();
      }

      return { ...p, x: nx, y: ny, rotation: nr };
    });
  };

  const handleWin = () => {
    setIsWin(true);
    sounds.playSuccess();
    if (onWin) onWin();
  };

  return (
    <div className="h-full flex flex-col font-['Fredoka'] bg-[#e0f2fe] overflow-hidden">
      {/* Header */}
      <div className="bg-[#1e1b4b] text-white px-4 py-2 flex items-center justify-between border-b-4 border-indigo-950 shrink-0">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-lg">🐱</div>
            <h2 className="text-sm font-black uppercase tracking-widest">KIT'S HOME QUEST</h2>
        </div>
        <div className="bg-white/10 px-3 py-1 rounded-xl border border-white/10">
            <span className="text-xs font-black">⭐ {isWin ? '1' : '0'}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT SIDE: THE NEW REMOTE CONTROL (Replaces the blocks) */}
        <div className="w-full lg:w-[260px] p-6 flex flex-col items-center justify-center bg-[#f1f5f9] border-r-2 border-slate-300 shadow-inner shrink-0">
          <p className="text-[10px] font-black text-indigo-900 uppercase mb-4 text-center tracking-tighter">Tap to move Kit! 🐾</p>
          <div className="grid grid-cols-3 gap-2">
            <div />
            <button onClick={() => moveManual('U')} className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center text-2xl shadow-[0_6px_0_0_#312e81] active:translate-y-1 active:shadow-none">⬆️</button>
            <div />
            <button onClick={() => moveManual('L')} className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center text-2xl shadow-[0_6px_0_0_#312e81] active:translate-y-1 active:shadow-none">⬅️</button>
            <button onClick={() => moveManual('D')} className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center text-2xl shadow-[0_6px_0_0_#312e81] active:translate-y-1 active:shadow-none">⬇️</button>
            <button onClick={() => moveManual('R')} className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center text-2xl shadow-[0_6px_0_0_#312e81] active:translate-y-1 active:shadow-none">➡️</button>
          </div>
        </div>

        {/* RIGHT SIDE: THE GAME STAGE */}
        <div className="flex-1 relative bg-[#0f172a] flex items-center justify-center p-4">
          <div className="relative w-[340px] h-[340px] bg-[#1e293b] rounded-[3rem] border-[8px] border-white/5 shadow-2xl flex items-center justify-center overflow-hidden">
            {/* The Goal Star */}
            <div className="absolute w-20 h-20 bg-emerald-500/20 border-4 border-dashed border-emerald-500/40 rounded-full flex items-center justify-center animate-pulse" style={{ transform: 'translate(-80px, -80px)' }}>
              <span className="text-5xl">{isWin ? '🏠' : '⭐'}</span>
            </div>

            {/* The Cat */}
            <div 
              className="relative transition-all duration-300 ease-out z-20" 
              style={{ transform: `translate(${spriteState.x}px, ${spriteState.y}px) rotate(${spriteState.rotation}deg)` }}
            >
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-[50px] shadow-[0_8px_0_0_#1e1b4b] border-4 border-indigo-100">
                {isWin ? '😻' : '🐱'}
              </div>
            </div>
          </div>

          {/* Win Overlay */}
          {isWin && (
            <div className="absolute inset-0 bg-indigo-950/90 z-[200] flex flex-col items-center justify-center p-6 animate-in zoom-in backdrop-blur-md">
               <div className="text-8xl mb-4 animate-bounce">🏆</div>
               <h3 className="text-4xl font-black text-white uppercase mb-6">YOU DID IT!</h3>
               <button onClick={() => onNext?.()} className="bg-emerald-500 text-white px-12 py-5 rounded-3xl font-black text-2xl shadow-[0_8px_0_0_#065f46] hover:scale-105 active:translate-y-2 transition-all uppercase">Next Level 🚀</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
