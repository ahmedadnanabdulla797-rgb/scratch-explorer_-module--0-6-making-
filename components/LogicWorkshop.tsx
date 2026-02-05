import React, { useState, useEffect, useCallback } from 'react';
import { sounds } from '../services/sounds';

type WorkshopMode = 'LOOP' | 'CONDITION' | 'LOGIC' | 'FINAL' | 'PLAYGROUND';

export const LogicWorkshop: React.FC<{ mode: WorkshopMode, onWin?: () => void, isCompleted?: boolean, onNext?: () => void }> = ({ mode, onWin, isCompleted, onNext }) => {
  const [spriteState, setSpriteState] = useState({ x: 0, y: 0, rotation: 0 });
  const [itemsFound, setItemsFound] = useState<string[]>([]);
  const [isPartyMode, setIsPartyMode] = useState(false);
  const stageSize = 340;

  // The hidden items for Module 5
  const magicItems = [
    { id: 'cake', emoji: '🎂', x: -100, y: -100 },
    { id: 'balloon', emoji: '🎈', x: 100, y: -100 },
    { id: 'gift', emoji: '🎁', x: 0, y: 110 },
  ];

  const setup = useCallback(() => {
    setSpriteState({ x: 0, y: 0, rotation: 0 });
    setItemsFound([]);
    setIsPartyMode(false);
  }, []);

  useEffect(() => { setup(); }, [setup]);

  const moveManual = (dir: 'U' | 'D' | 'L' | 'R') => {
    if (isPartyMode && itemsFound.length === 3 && dir === 'U') {
        // Just keep moving in party mode!
    }
    
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

      nx = Math.max(-stageSize/2 + 40, Math.min(stageSize/2 - 40, nx));
      ny = Math.max(-stageSize/2 + 40, Math.min(stageSize/2 - 40, ny));

      // MODULE 5: Interaction & Messaging
      magicItems.forEach(item => {
        if (!itemsFound.includes(item.id)) {
          if (Math.abs(nx - item.x) < 40 && Math.abs(ny - item.y) < 40) {
            setItemsFound(prev => [...prev, item.id]);
            sounds.playFanfare(); // Broadcast sound
          }
        }
      });

      // MODULE 6: Win Condition / Creative Party
      if (itemsFound.length === 3 && !isPartyMode) {
        setIsPartyMode(true);
        sounds.playSuccess();
      }

      return { ...p, x: nx, y: ny, rotation: nr };
    });
  };

  return (
    <div className={`h-full flex flex-col font-['Fredoka'] transition-colors duration-500 ${isPartyMode ? 'bg-pink-200' : 'bg-[#1e293b]'} overflow-hidden`}>
      {/* Header */}
      <div className="bg-[#1e1b4b] text-white px-4 py-3 flex items-center justify-between border-b-4 border-indigo-950 shrink-0">
        <h2 className="text-xs font-black uppercase tracking-widest">
            {isPartyMode ? "🎉 PARTY TIME!" : "🔍 FIND THE SURPRISES!"}
        </h2>
        <div className="flex gap-2">
            {magicItems.map(item => (
                <span key={item.id} className={`text-lg transition-opacity ${itemsFound.includes(item.id) ? 'opacity-100' : 'opacity-20'}`}>
                    {item.emoji}
                </span>
            ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Controls */}
        <div className="w-full lg:w-[240px] p-6 flex flex-col items-center justify-center bg-white/50 backdrop-blur-md border-r-2 border-slate-300">
          <div className="grid grid-cols-3 gap-3">
            <div />
            <button onClick={() => moveManual('U')} className="w-16 h-16 bg-indigo-600 rounded-3xl text-3xl shadow-[0_8px_0_0_#312e81] active:translate-y-2 active:shadow-none transition-all">⬆️</button>
            <div />
            <button onClick={() => moveManual('L')} className="w-16 h-16 bg-indigo-600 rounded-3xl text-3xl shadow-[0_8px_0_0_#312e81] active:translate-y-2 active:shadow-none transition-all">⬅️</button>
            <button onClick={() => moveManual('D')} className="w-16 h-16 bg-indigo-600 rounded-3xl text-3xl shadow-[0_8px_0_0_#312e81] active:translate-y-2 active:shadow-none transition-all">⬇️</button>
            <button onClick={() => moveManual('R')} className="w-16 h-16 bg-indigo-600 rounded-3xl text-3xl shadow-[0_8px_0_0_#312e81] active:translate-y-2 active:shadow-none transition-all">➡️</button>
          </div>
        </div>

        {/* Game Stage */}
        <div className="flex-1 relative flex items-center justify-center p-4">
          <div className={`relative w-[340px] h-[340px] rounded-[3rem] border-[10px] shadow-2xl overflow-hidden transition-all duration-700 ${isPartyMode ? 'bg-white border-yellow-400 scale-105' : 'bg-slate-900 border-white/10'}`}>
            
            {/* Module 6: Disco Lights (Only shows in Party Mode) */}
            {isPartyMode && <div className="absolute inset-0 animate-pulse bg-gradient-to-tr from-yellow-200/40 via-pink-200/40 to-blue-200/40" />}

            {/* Hidden Items to Find (Module 5) */}
            {magicItems.map(item => (
              <div key={item.id} className={`absolute text-5xl transition-all duration-500 ${itemsFound.includes(item.id) ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                   style={{ left: '50%', top: '50%', transform: `translate(${item.x - 24}px, ${item.y - 24}px)` }}>
                {item.emoji}
              </div>
            ))}

            {/* Hint Bubbles (To help the child find things) */}
            {!isPartyMode && magicItems.map(item => !itemsFound.includes(item.id) && (
                <div key={`hint-${item.id}`} className="absolute w-4 h-4 bg-white/10 rounded-full animate-ping"
                     style={{ left: '50%', top: '50%', transform: `translate(${item.x}px, ${item.y}px)` }} />
            ))}

            {/* The Main Sprite (Kit) */}
            <div className="absolute transition-all duration-300 ease-out z-20" 
                 style={{ left: '50%', top: '50%', transform: `translate(${spriteState.x}px, ${spriteState.y}px) rotate(${spriteState.rotation}deg)` }}>
              <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-[50px] shadow-xl border-4 border-indigo-500">
                {isPartyMode ? '😻' : '🐱'}
              </div>
            </div>

            {/* Module 5.2: Party Guests (Clones that appear at the end) */}
            {isPartyMode && (
                <>
                    <div className="absolute text-5xl animate-bounce" style={{left: '20%', top: '20%'}}>🐶</div>
                    <div className="absolute text-5xl animate-bounce" style={{left: '70%', top: '20%', animationDelay: '0.2s'}}>🐰</div>
                    <div className="absolute text-5xl animate-bounce" style={{left: '50%', top: '70%', animationDelay: '0.4s'}}>🦊</div>
                </>
            )}
          </div>

          {/* Final Module 6 Win Screen */}
          {isPartyMode && (
            <div className="absolute bottom-10 flex flex-col items-center animate-in slide-in-from-bottom duration-1000">
                <button onClick={() => onNext?.()} className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-12 py-5 rounded-full font-black text-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all uppercase tracking-widest">
                    Next Level 🚀
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
