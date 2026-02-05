import React, { useState, useEffect, useCallback } from 'react';
import { sounds } from '../services/sounds';

type WorkshopMode = 'LOOP' | 'CONDITION' | 'LOGIC' | 'FINAL' | 'PLAYGROUND';

export const LogicWorkshop: React.FC<{ mode: WorkshopMode, onWin?: () => void, isCompleted?: boolean, onNext?: () => void }> = ({ mode, onWin, isCompleted, onNext }) => {
  const [spriteState, setSpriteState] = useState({ x: 0, y: 0, rotation: 0, say: '', hearts: 3 });
  const [isWin, setIsWin] = useState(false);
  const [clones, setClones] = useState<{id: number, x: number, y: number}[]>([]);
  const stageSize = 340;

  const setup = useCallback(() => {
    setIsWin(false);
    setClones([]);
    setSpriteState({ x: 60, y: 60, rotation: 0, say: '', hearts: 3 });
  }, []);

  useEffect(() => { setup(); }, [setup]);

  const moveManual = (dir: 'U' | 'D' | 'L' | 'R') => {
    if (isWin) return;
    
    // Module 6: Music Mode (Play different notes for different directions)
    if (mode === 'PLAYGROUND') {
       sounds.playPop(); // Or replace with musical notes if available
    } else {
       sounds.playPop();
    }
    
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

      // Module 5.1: Lose Condition (Monster 👾)
      // Monster is at (70, 70)
      if (mode !== 'PLAYGROUND' && Math.abs(nx - 70) < 40 && Math.abs(ny - 70) < 40) {
        nx = 100; ny = 100; // Reset position
        return { ...p, x: nx, y: ny, say: 'Oh no!' };
      }

      // Module 5.3: Broadcast/Messaging (Bell 🔔)
      // Bell is at (70, -70)
      if (Math.abs(nx - 70) < 40 && Math.abs(ny - (-70)) < 40 && clones.length === 0) {
        sounds.playFanfare();
        setClones([
          {id: 1, x: nx - 30, y: ny - 30},
          {id: 2, x: nx + 30, y: ny - 30},
          {id: 3, x: nx, y: ny + 40}
        ]);
      }

      // Win Condition (Star ⭐)
      if (Math.abs(nx - (-80)) < 45 && Math.abs(ny - (-80)) < 45) {
        handleWin();
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
                {mode === 'PLAYGROUND' ? 'DANCE PARTY 🎉' : 'MAZE CHALLENGE 👾'}
            </h2>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="w-full lg:w-[240px] p-6 flex flex-col items-center justify-center bg-[#f1f5f9] border-r-2 border-slate-300 shadow-inner">
          <div className="grid grid-cols-3 gap-2">
            <div />
            <button onClick={() => moveManual('U')} className="w-14 h-14 bg-indigo-500 rounded-2xl text-2xl shadow-[0_6px_0_0_#312e81] active:translate-y-1 active:shadow-none transition-all">⬆️</button>
            <div />
            <button onClick={() => moveManual('L')} className="w-14 h-14 bg-indigo-500 rounded-2xl text-2xl shadow-[0_6px_0_0_#312e81] active:translate-y-1 active:shadow-none transition-all">⬅️</button>
            <button onClick={() => moveManual('D')} className="w-14 h-14 bg-indigo-500 rounded-2xl text-2xl shadow-[0_6px_0_0_#312e81] active:translate-y-1 active:shadow-none transition-all">⬇️</button>
            <button onClick={() => moveManual('R')} className="w-14 h-14 bg-indigo-500 rounded-2xl text-2xl shadow-[0_6px_0_0_#312e81] active:translate-y-1 active:shadow-none transition-all">➡️</button>
          </div>
          <p className="mt-4 text-[9px] font-black text-indigo-400 uppercase">Remote Control</p>
        </div>

        <div className="flex-1 relative bg-[#0f172a] flex items-center justify-center p-4">
          <div className="relative w-[340px] h-[340px] bg-[#1e293b] rounded-[3rem] border-[8px] border-white/5 shadow-2xl overflow-hidden">
            
            {/* GOAL STAR (Module 5.1) */}
            <div className="absolute w-20 h-20 bg-emerald-500/10 border-4 border-dashed border-emerald-500/20 rounded-full flex items-center justify-center animate-pulse" style={{ left: '50%', top: '50%', transform: 'translate(-120px, -120px)' }}>
              <span className="text-5xl">{isWin ? '🏠' : '⭐'}</span>
            </div>

            {/* MONSTER (Module 5.1 - Lose condition) */}
            {mode !== 'PLAYGROUND' && !isWin && (
              <div className="absolute w-16 h-16 flex items-center justify-center animate-bounce" style={{ left: '50%', top: '50%', transform: 'translate(40px, 40px)' }}>
                <span className="text-4xl">👾</span>
              </div>
            )}

            {/* BROADCAST BELL (Module 5.3) */}
            {!isWin && (
               <div className="absolute w-16 h-16 flex items-center justify-center" style={{ left: '50%', top: '50%', transform: 'translate(40px, -100px)' }}>
                 <span className="text-4xl animate-swing origin-top">🔔</span>
               </div>
            )}

            {/* CLONES (Module 5.2) */}
            {clones.map(c => (
              <div key={c.id} className="absolute text-3xl transition-all duration-500" style={{ left: '50%', top: '50%', transform: `translate(${c.x}px, ${c.y}px)` }}>🐱</div>
            ))}

            {/* MAIN SPRITE */}
            <div className="absolute transition-all duration-300 ease-out z-20" style={{ left: '50%', top: '50%', transform: `translate(${spriteState.x}px, ${spriteState.y}px) rotate(${spriteState.rotation}deg)` }}>
              {spriteState.say && <div className="absolute -top-10 bg-white text-indigo-900 px-2 py-1 rounded-lg font-bold text-xs whitespace-nowrap">{spriteState.say}</div>}
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[40px] shadow-[0_6px_0_0_#1e1b4b] border-2 border-indigo-100">
                {isWin ? '😻' : '🐱'}
              </div>
            </div>
          </div>

          {isWin && (
            <div className="absolute inset-0 bg-indigo-950/90 z-[200] flex flex-col items-center justify-center p-6 animate-in zoom-in backdrop-blur-md">
               <div className="text-7xl mb-4">🏆</div>
               <h3 className="text-3xl font-black text-white uppercase mb-6">MISSION PASSED!</h3>
               <button onClick={() => onNext?.()} className="bg-emerald-500 text-white px-10 py-4 rounded-3xl font-black text-xl shadow-[0_6px_0_0_#065f46] uppercase">Next 🚀</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
