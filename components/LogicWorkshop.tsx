import React, { useState, useEffect, useCallback } from 'react';
import { sounds } from '../services/sounds';

type WorkshopMode = 'LOOP' | 'CONDITION' | 'LOGIC' | 'FINAL' | 'PLAYGROUND';

export const LogicWorkshop: React.FC<{ mode: WorkshopMode, onWin?: () => void, isCompleted?: boolean, onNext?: () => void }> = ({ mode, onWin, isCompleted, onNext }) => {
  const [spriteState, setSpriteState] = useState({ x: 60, y: 60, rotation: 0, say: '', hearts: 3 });
  const [isWin, setIsWin] = useState(false);
  const [clones, setClones] = useState<{id: number, x: number, y: number}[]>([]);
  const [starsCollected, setStarsCollected] = useState(0);
  const [starPos, setStarPos] = useState({ x: -80, y: -80 });
  const stageSize = 340;

  // Level Setup
  const setup = useCallback(() => {
    setIsWin(false);
    setClones([]);
    setStarsCollected(0);
    setStarPos({ x: -80, y: -80 });
    setSpriteState({ x: 60, y: 60, rotation: 0, say: '', hearts: 3 });
  }, []);

  useEffect(() => { setup(); }, [setup]);

  // Function to move the star to a new random spot to keep the game going
  const moveStar = () => {
    const spots = [
      { x: -100, y: -100 },
      { x: 100, y: -100 },
      { x: -100, y: 100 },
      { x: 0, y: 0 }
    ];
    setStarPos(spots[Math.min(starsCollected, spots.length - 1)]);
  };

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

      // Boundaries
      nx = Math.max(-stageSize/2 + 40, Math.min(stageSize/2 - 40, nx));
      ny = Math.max(-stageSize/2 + 40, Math.min(stageSize/2 - 40, ny));

      // 1. Lose Condition: Monster 👾 (Sends back but doesn't end game)
      if (mode !== 'PLAYGROUND' && Math.abs(nx - 70) < 40 && Math.abs(ny - 70) < 40) {
        sounds.playPop(); 
        return { ...p, x: 100, y: 100, say: 'Woah!' };
      }

      // 2. Messaging: Bell 🔔 (Creates Clones)
      if (Math.abs(nx - 70) < 40 && Math.abs(ny - (-70)) < 40) {
        if (clones.length < 6) { // Allow more clones to make it fun
          setClones(prev => [...prev, {id: Date.now(), x: nx + (Math.random() * 40 - 20), y: ny + (Math.random() * 40 - 20)}]);
        }
      }

      // 3. LONGER GAMEPLAY: Collect 3 Stars instead of 1
      if (Math.abs(nx - starPos.x) < 45 && Math.abs(ny - starPos.y) < 45) {
        if (starsCollected < 2) {
          sounds.playFanfare();
          setStarsCollected(prev => prev + 1);
          moveStar(); // Move star to new position
          return { ...p, x: nx, y: ny, say: 'Got it! ✨' };
        } else {
          handleWin();
        }
      }

      return { ...p, x: nx, y: ny, rotation: nr, say: '' };
    });
  };

  const handleWin = () => {
    setIsWin(true);
    sounds.playSuccess();
    if (onWin) onWin();
  };

  return (
    <div className="h-full flex flex-col font-['Fredoka'] bg-[#e0f2fe] overflow-hidden">
      <div className="bg-[#1e1b4b] text-white px-4 py-2 flex items-center justify-between border-b-4 border-indigo-950 shrink-0">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-lg">🐱</div>
            <h2 className="text-sm font-black uppercase tracking-widest">
                {mode === 'PLAYGROUND' ? 'FREE PLAY' : `STARS: ${starsCollected}/3`}
            </h2>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Remote Control */}
        <div className="w-full lg:w-[240px] p-6 flex flex-col items-center justify-center bg-[#f1f5f9] border-r-2 border-slate-300 shadow-inner">
          <div className="grid grid-cols-3 gap-3">
            <div />
            <button onClick={() => moveManual('U')} className="w-16 h-16 bg-indigo-500 rounded-2xl text-3xl shadow-[0_8px_0_0_#312e81] active:translate-y-2 active:shadow-none transition-all">⬆️</button>
            <div />
            <button onClick={() => moveManual('L')} className="w-16 h-16 bg-indigo-500 rounded-2xl text-3xl shadow-[0_8px_0_0_#312e81] active:translate-y-2 active:shadow-none transition-all">⬅️</button>
            <button onClick={() => moveManual('D')} className="w-16 h-16 bg-indigo-500 rounded-2xl text-3xl shadow-[0_8px_0_0_#312e81] active:translate-y-2 active:shadow-none transition-all">⬇️</button>
            <button onClick={() => moveManual('R')} className="w-16 h-16 bg-indigo-500 rounded-2xl text-3xl shadow-[0_8px_0_0_#312e81] active:translate-y-2 active:shadow-none transition-all">➡️</button>
          </div>
        </div>

        {/* Stage */}
        <div className="flex-1 relative bg-[#0f172a] flex items-center justify-center p-4">
          <div className="relative w-[340px] h-[340px] bg-[#1e293b] rounded-[3rem] border-[8px] border-white/5 shadow-2xl overflow-hidden">
            
            {/* The Target Star (Moves 3 times) */}
            <div className="absolute w-20 h-20 bg-yellow-400/10 border-4 border-dashed border-yellow-400/20 rounded-full flex items-center justify-center animate-pulse" 
                 style={{ left: '50%', top: '50%', transform: `translate(${starPos.x - 40}px, ${starPos.y - 40}px)` }}>
              <span className="text-5xl">⭐</span>
            </div>

            {/* Monster 👾 */}
            {mode !== 'PLAYGROUND' && !isWin && (
              <div className="absolute w-16 h-16 flex items-center justify-center animate-bounce" style={{ left: '50%', top: '50%', transform: 'translate(60px, 60px)' }}>
                <span className="text-4xl">👾</span>
              </div>
            )}

            {/* Bell 🔔 */}
            <div className="absolute w-16 h-16 flex items-center justify-center" style={{ left: '50%', top: '50%', transform: 'translate(60px, -110px)' }}>
              <span className="text-4xl">🔔</span>
            </div>

            {/* Clones 🐱 */}
            {clones.map(c => (
              <div key={c.id} className="absolute text-3xl" style={{ left: '50%', top: '50%', transform: `translate(${c.x}px, ${c.y}px)` }}>🐱</div>
            ))}

            {/* Main Cat */}
            <div className="absolute transition-all duration-300 ease-out z-20" style={{ left: '50%', top: '50%', transform: `translate(${spriteState.x}px, ${spriteState.y}px) rotate(${spriteState.rotation}deg)` }}>
              {spriteState.say && <div className="absolute -top-10 bg-white px-2 py-1 rounded-lg font-bold text-xs">{spriteState.say}</div>}
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[40px] shadow-[0_6px_0_0_#1e1b4b] border-2 border-indigo-100">
                {isWin ? '😻' : '🐱'}
              </div>
            </div>
          </div>

          {isWin && (
            <div className="absolute inset-0 bg-indigo-950/90 z-[200] flex flex-col items-center justify-center p-6 animate-in zoom-in backdrop-blur-md">
               <div className="text-8xl mb-4 animate-bounce">👑</div>
               <h3 className="text-4xl font-black text-white uppercase mb-8 text-center">Master Coder!</h3>
               <button onClick={() => onNext?.()} className="bg-emerald-500 text-white px-16 py-6 rounded-[2rem] font-black text-2xl shadow-[0_10px_0_0_#065f46] uppercase">Next level 🚀</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
