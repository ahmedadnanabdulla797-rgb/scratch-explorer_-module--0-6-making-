import React, { useState, useEffect, useCallback } from 'react';
import { sounds } from '../services/sounds';

type WorkshopMode = 'LOOP' | 'CONDITION' | 'LOGIC' | 'FINAL' | 'PLAYGROUND';

export const LogicWorkshop: React.FC<{ mode: WorkshopMode, onWin?: () => void, isCompleted?: boolean, onNext?: () => void }> = ({ mode, onWin, isCompleted, onNext }) => {
  const [spriteState, setSpriteState] = useState({ x: 0, y: 0, rotation: 0 });
  const [itemsCollected, setItemsCollected] = useState<number>(0);
  const [trail, setTrail] = useState<{x: number, y: number, id: number}[]>([]); // For Module 6 Art
  const [isWin, setIsWin] = useState(false);
  const stageSize = 340;

  const isModule6 = mode === 'PLAYGROUND';

  const setup = useCallback(() => {
    setSpriteState({ x: 0, y: 0, rotation: 0 });
    setItemsCollected(0);
    setTrail([]);
    setIsWin(false);
  }, []);

  useEffect(() => { setup(); }, [setup]);

  const moveManual = (dir: 'U' | 'D' | 'L' | 'R') => {
    if (isWin && !isModule6) return;
    
    sounds.playPop();
    
    setSpriteState(p => {
      let nx = p.x;
      let ny = p.y;
      let nr = p.rotation;
      const step = 45;

      if (dir === 'U') { ny -= step; nr = 270; }
      if (dir === 'D') { ny += step; nr = 90; }
      if (dir === 'L') { nx -= step; nr = 180; }
      if (dir === 'R') { nx += step; nr = 0; }

      nx = Math.max(-stageSize/2 + 40, Math.min(stageSize/2 - 40, nx));
      ny = Math.max(-stageSize/2 + 40, Math.min(stageSize/2 - 40, ny));

      // MODULE 6: CREATE ART (Add to trail)
      if (isModule6) {
        setTrail(prev => [{x: nx, y: ny, id: Date.now()}, ...prev].slice(0, 15));
      }

      // MODULE 5: COLLECT LOGIC (Collect 3 stars to open the house)
      if (!isModule6 && Math.abs(nx - 0) < 40 && Math.abs(ny - 0) < 40) {
          // If cat is in the center, count it as a "check"
      }

      return { ...p, x: nx, y: ny, rotation: nr };
    });
  };

  return (
    <div className={`h-full flex flex-col font-['Fredoka'] overflow-hidden ${isModule6 ? 'bg-indigo-50' : 'bg-slate-100'}`}>
      
      {/* 1. HEADER: Changes title based on Module */}
      <div className={`${isModule6 ? 'bg-pink-500' : 'bg-indigo-900'} text-white px-4 py-3 flex items-center justify-between shadow-lg z-10`}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{isModule6 ? '🎨' : '🗺️'}</span>
          <h2 className="text-xs font-black uppercase tracking-widest">
            {isModule6 ? 'Module 6: Creative Art' : 'Module 5: Logic Maze'}
          </h2>
        </div>
        {isModule6 && <button onClick={setup} className="text-[10px] bg-white/20 px-2 py-1 rounded-lg font-bold">CLEAR CANVAS</button>}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* 2. CONTROLS: Simplified for Tiny Fingers */}
        <div className="w-full lg:w-[220px] p-4 flex flex-col items-center justify-center bg-white border-r-2 border-slate-200">
          <div className="grid grid-cols-3 gap-2">
            <div />
            <button onClick={() => moveManual('U')} className="w-14 h-14 bg-slate-800 rounded-2xl text-2xl shadow-[0_5px_0_0_#000] active:translate-y-1 active:shadow-none">⬆️</button>
            <div />
            <button onClick={() => moveManual('L')} className="w-14 h-14 bg-slate-800 rounded-2xl text-2xl shadow-[0_5px_0_0_#000] active:translate-y-1 active:shadow-none">⬅️</button>
            <button onClick={() => moveManual('D')} className="w-14 h-14 bg-slate-800 rounded-2xl text-2xl shadow-[0_5px_0_0_#000] active:translate-y-1 active:shadow-none">⬇️</button>
            <button onClick={() => moveManual('R')} className="w-14 h-14 bg-slate-800 rounded-2xl text-2xl shadow-[0_5px_0_0_#000] active:translate-y-1 active:shadow-none">➡️</button>
          </div>
          <p className="mt-4 text-[8px] font-black opacity-40 uppercase">Control Kit</p>
        </div>

        {/* 3. STAGE: COMPLETELY DIFFERENT LOOKS */}
        <div className="flex-1 relative flex items-center justify-center p-4 bg-slate-200">
          
          <div className={`relative w-[340px] h-[340px] rounded-[3rem] shadow-2xl overflow-hidden border-8 border-white
            ${isModule6 ? 'bg-white' : 'bg-[url("https://www.transparenttextures.com/patterns/cubes.png")] bg-indigo-50'}`}>
            
            {/* MODULE 6: Rainbow Art Trail */}
            {isModule6 && trail.map((dot, i) => (
              <div key={dot.id} className="absolute w-12 h-12 rounded-full opacity-30"
                style={{ 
                  left: '50%', top: '50%', 
                  transform: `translate(${dot.x-24}px, ${dot.y-24}px)`,
                  backgroundColor: `hsl(${i * 40}, 70%, 60%)` 
                }} 
              />
            ))}

            {/* MODULE 5: The Maze Goal (Star) */}
            {!isModule6 && (
              <div className="absolute w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce shadow-lg"
                style={{ left: '50%', top: '50%', transform: 'translate(-120px, -120px)' }}
                onClick={() => { if(Math.abs(spriteState.x - (-80)) < 50) setIsWin(true); }}>
                <span className="text-4xl">⭐</span>
              </div>
            )}

            {/* THE SPRITE */}
            <div className="absolute transition-all duration-300 ease-out z-20" 
                 style={{ left: '50%', top: '50%', transform: `translate(${spriteState.x}px, ${spriteState.y}px) rotate(${spriteState.rotation}deg)` }}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-xl border-2
                ${isModule6 ? 'bg-pink-100 border-pink-400' : 'bg-white border-indigo-600'}`}>
                {isModule6 ? '🎨' : '🐱'}
              </div>
            </div>

            {/* MODULE 5: Obstacle (The Dog) */}
            {!isModule6 && (
              <div className="absolute text-4xl" style={{ left: '70%', top: '70%' }}>🐶</div>
            )}

          </div>

          {/* Win Screen for Module 5 / Finish for Module 6 */}
          {(isWin || (isModule6 && trail.length > 10)) && (
            <div className="absolute inset-0 z-[100] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in zoom-in">
              <span className="text-8xl mb-4">{isModule6 ? '🖼️' : '🏆'}</span>
              <h3 className="text-2xl font-black text-slate-800 uppercase">
                {isModule6 ? 'BEAUTIFUL ART!' : 'MAZE MASTER!'}
              </h3>
              <button onClick={() => onNext?.()} className="mt-6 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg">
                NEXT 🚀
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
