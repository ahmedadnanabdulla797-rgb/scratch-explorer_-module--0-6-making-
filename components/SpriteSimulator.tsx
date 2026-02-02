import React, { useState, useEffect, useCallback } from 'react';
import { sounds } from '../services/sounds';

const SCALE = 38; 

interface SpriteSimulatorProps {
  onWin?: () => void;
  isCompleted?: boolean;
  onNext?: () => void;
}

export const SpriteSimulator: React.FC<SpriteSimulatorProps> = ({ onWin, isCompleted, onNext }) => {
  const [targetPos, setTargetPos] = useState({ x: -2, y: -3 }); 
  const [spritePos, setSpritePos] = useState({ x: 4, y: 3 }); 
  const [inputX, setInputX] = useState('');
  const [inputY, setInputY] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [feedback, setFeedback] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  const spawnTarget = useCallback(() => {
    const rx = Math.floor(Math.random() * 8) - 4; 
    const ry = Math.floor(Math.random() * 6) - 3; 
    setTargetPos({ x: rx, y: ry });
    setInputX('');
    setInputY('');
    setShowHint(false);
  }, []);

  useEffect(() => {
    spawnTarget();
  }, [spawnTarget]);

  const handleLaunch = () => {
    sounds.playPop();
    const nx = parseInt(inputX);
    const ny = parseInt(inputY);
    if (isNaN(nx) || isNaN(ny)) return;

    setIsSpinning(true);
    setSpritePos({ x: nx, y: ny });

    setTimeout(() => {
      setIsSpinning(false);
      sounds.playSpin(); 
      
      if (nx === targetPos.x && ny === targetPos.y) {
        sounds.playSuccess();
        setFeedback({ msg: "TARGET ACQUIRED!", type: 'success' });
        if (onWin) onWin();
        
        setTimeout(() => {
          setFeedback(null);
          spawnTarget();
        }, 1800);
      } else {
        sounds.playMiss();
        setFeedback({ msg: "CALIBRATION FAILED!", type: 'error' });
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        setTimeout(() => setFeedback(null), 1000);
      }
    }, 700);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden font-['Lexend']">
      <div className="relative flex-1 bg-[#0a0a1f] rounded-[2rem] border-2 border-slate-800/50 overflow-hidden flex items-center justify-center min-h-[300px] shadow-[inset_0_4px_30px_rgba(0,0,0,0.8)]">
        <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ 
          backgroundImage: `radial-gradient(circle, #818cf8 1px, transparent 1px)`,
          backgroundSize: `${SCALE}px ${SCALE}px`,
          backgroundPosition: 'center center'
        }}></div>

        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[110] bg-indigo-600/90 backdrop-blur-md px-4 py-1 rounded-full border border-white/20 shadow-lg animate-pulse hidden sm:block">
          <span className="text-white font-black text-[9px] tracking-[0.2em] uppercase font-kids">CATCH THE STAR! ⭐</span>
        </div>

        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute w-full h-[2px] bg-blue-500/30 top-1/2 -translate-y-1/2 shadow-[0_0_20px_rgba(59,130,246,0.3)]"></div>
          <div className="absolute h-full w-[2px] bg-orange-500/30 left-1/2 -translate-x-1/2 shadow-[0_0_20px_rgba(249,115,22,0.3)]"></div>
          
          {[-8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8].map(val => (
            <span key={`x-${val}`} className="absolute text-[9px] font-black text-slate-400/80" 
                  style={{ left: `calc(50% + ${val * SCALE}px - 4px)`, top: 'calc(50% + 8px)' }}>{val}</span>
          ))}
          {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map(val => (
            <span key={`y-${val}`} className="absolute text-[9px] font-black text-slate-400/80" 
                  style={{ top: `calc(50% - ${val * SCALE}px - 6px)`, left: 'calc(50% + 12px)' }}>{val}</span>
          ))}
        </div>

        <div className="absolute top-3 left-3 z-[100] bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-blue-500/30 flex items-center gap-2.5 shadow-xl">
           <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center text-sm">🐱</div>
           <div className="flex flex-col">
             <span className="text-[6px] text-blue-400 font-black uppercase tracking-widest leading-none mb-0.5">STATUS</span>
             <span className="text-white font-black text-[9px] tabular-nums leading-none">X:{spritePos.x} Y:{spritePos.y}</span>
           </div>
        </div>

        <div 
          onClick={() => { if(!showHint) sounds.playPop(); setShowHint(true); }}
          className={`absolute top-3 right-3 z-[100] bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-orange-500/30 flex items-center gap-2.5 shadow-xl transition-all active:scale-95 select-none ${!showHint ? 'cursor-pointer hover:bg-slate-800' : ''}`}
        >
           <div className="flex flex-col items-end">
             <span className="text-[6px] text-orange-400 font-black uppercase tracking-widest leading-none mb-0.5">CLUE</span>
             {showHint ? (
                <div className="flex flex-col items-end">
                   <span className="text-white font-black text-[8px] uppercase leading-none">
                     {Math.abs(targetPos.x)} {targetPos.x >= 0 ? 'Right' : 'Left'}
                   </span>
                   <span className="text-white font-black text-[8px] uppercase leading-none mt-0.5">
                     {Math.abs(targetPos.y)} {targetPos.y >= 0 ? 'Up' : 'Down'}
                   </span>
                </div>
             ) : (
                <span className="text-white font-black text-[9px] uppercase leading-none animate-pulse">Hint</span>
             )}
           </div>
           <div className="w-6 h-6 bg-orange-500/20 rounded flex items-center justify-center text-sm">⭐</div>
        </div>

        <div className="absolute transition-all duration-700 z-[60]"
             style={{ transform: `translate(${targetPos.x * SCALE}px, ${-targetPos.y * SCALE}px)` }}>
          <div className="relative group">
             <span className="text-3xl drop-shadow-[0_0_10px_rgba(250,204,21,0.6)] select-none animate-float block">⭐</span>
          </div>
        </div>

        <div className="absolute z-[100] transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1)"
             style={{ transform: `translate(${spritePos.x * SCALE}px, ${-spritePos.y * SCALE}px)` }}>
          <div className={`w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-xl flex items-center justify-center text-3xl shadow-[0_4px_0_0_#ca8a04] border-2 border-white/90 transform transition-all cursor-pointer ${isSpinning ? 'animate-spin-pro scale-110' : isShaking ? 'animate-shake-pro' : 'hover:scale-110 active:scale-95'}`}>
            🐱
          </div>
        </div>

        {feedback && (
          <div className="absolute inset-0 z-[200] bg-slate-950/60 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
             <div className={`px-8 py-5 rounded-[2rem] shadow-2xl border-b-4 transform animate-in zoom-in duration-500 flex items-center gap-4 ${
               feedback.type === 'success' ? 'bg-emerald-600 border-emerald-800 text-white' : 'bg-rose-600 border-rose-800 text-white'
             }`}>
                <span className="text-3xl animate-bounce">{feedback.type === 'success' ? '🚀' : '⚙️'}</span>
                <p className="font-black text-xl uppercase tracking-tighter drop-shadow-lg font-kids">{feedback.msg}</p>
             </div>
          </div>
        )}
      </div>

      <div className="bg-[#1e1b4b] p-4 lg:p-6 rounded-[2rem] mt-3 flex flex-wrap items-center justify-center gap-6 lg:gap-10 shadow-xl border-b-[8px] border-[#0f172a] border-t border-white/5">
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-2 group">
             <div className="bg-slate-900/50 p-2 rounded-xl border border-blue-500/20 flex flex-col items-center relative transition-all group-focus-within:border-blue-400/50">
                <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 bg-blue-600 text-white px-2 py-0.5 rounded-md text-[7px] font-black border border-white/20 tracking-widest font-kids">X-AXIS</div>
                <div className="bg-white rounded-lg mt-0.5 overflow-hidden border border-slate-200">
                  <input 
                    type="number" 
                    value={inputX}
                    onChange={(e) => setInputX(e.target.value)}
                    className="w-14 h-10 text-xl font-black text-center text-slate-900 focus:outline-none tabular-nums"
                    placeholder="0"
                  />
                </div>
             </div>
          </div>

          <div className="flex flex-col items-center gap-2 group">
             <div className="bg-slate-900/50 p-2 rounded-xl border border-orange-500/20 flex flex-col items-center relative transition-all group-focus-within:border-orange-400/50">
                <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 bg-orange-600 text-white px-2 py-0.5 rounded-md text-[7px] font-black border border-white/20 tracking-widest font-kids">Y-AXIS</div>
                <div className="bg-white rounded-lg mt-0.5 overflow-hidden border border-slate-200">
                  <input 
                    type="number" 
                    value={inputY}
                    onChange={(e) => setInputY(e.target.value)}
                    className="w-14 h-10 text-xl font-black text-center text-slate-900 focus:outline-none tabular-nums"
                    placeholder="0"
                  />
                </div>
             </div>
          </div>
        </div>

        <button 
          onClick={handleLaunch}
          className="bg-gradient-to-b from-emerald-400 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500 text-white h-14 px-12 rounded-xl font-black text-xl shadow-[0_6px_0_0_#064e3b] active:translate-y-1 active:shadow-none transition-all transform hover:scale-105 flex items-center gap-3 font-kids"
        >
          EXECUTE 🚀
        </button>

        {isCompleted && (
          <button 
            onClick={() => { sounds.playPop(); onNext?.(); }}
            className="bg-yellow-400 text-indigo-950 h-10 px-6 rounded-lg font-black text-sm shadow-[0_4px_0_0_#ca8a04] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 animate-bounce font-kids"
          >
            NEXT 🏆
          </button>
        )}
      </div>

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes spin-pro { from { transform: rotate(0deg); } to { transform: rotate(720deg); } }
        @keyframes shake-pro { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-10px); } 40% { transform: translateX(10px); } 60% { transform: translateX(-10px); } 80% { transform: translateX(10px); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-spin-pro { animation: spin-pro 0.7s cubic-bezier(0.19, 1, 0.22, 1); }
        .animate-shake-pro { animation: shake-pro 0.4s ease-in-out; }
      `}</style>
    </div>
  );
};