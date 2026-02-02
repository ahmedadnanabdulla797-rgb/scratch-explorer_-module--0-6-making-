import React, { useState } from 'react';
import { sounds } from '../services/sounds';

interface LoopGameProps {
  onWin?: () => void;
  isCompleted?: boolean;
  onNext?: () => void;
}

export const LoopGame: React.FC<LoopGameProps> = ({ onWin, isCompleted, onNext }) => {
  const [times, setTimes] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);

  const handleRestart = () => {
    sounds.playPop();
    setPlaying(false);
    setDone(false);
    setCurrentStep(0);
  };

const start = async () => {
    if (times === 0) {
      sounds.playMiss();
      return;
    }
    
    setPlaying(true);
    setCurrentStep(0);
    setDone(false); // Reset done state just in case

    for(let i = 0; i < times; i++) {
      setCurrentStep(i + 1);
      sounds.playJump();
      // Wait for the full jump animation (0.8s)
      await new Promise(r => setTimeout(r, 800));
    }
    
    // 1. Stop the jumping animation first
    setPlaying(false);
    
    // 2. Wait a tiny bit (200ms) for the cat to "settle" on the ground
    await new Promise(r => setTimeout(r, 200));
    
    // 3. NOW show the success message
    setDone(true);
    sounds.playSuccess();
    if (onWin) onWin();
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] rounded-[2rem] p-3 lg:p-5 font-['Lexend'] overflow-hidden shadow-inner border border-indigo-100/50">
      
      {/* COMPACT PROFESSIONAL HEADER */}
      <div className="bg-[#1e1b4b] p-2.5 lg:p-3.5 rounded-2xl text-white shadow-lg flex justify-between items-center mb-3 shrink-0 border-b-4 border-indigo-950 border-t border-white/5">
         <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-0.5">
               <div className="w-6 h-6 lg:w-7 lg:h-7 bg-indigo-500 rounded-lg flex items-center justify-center text-xs shadow-md border border-white/10">🔁</div>
               <h3 className="text-xs lg:text-sm font-black uppercase leading-none tracking-tight font-kids">LOOP ANALYTICS ENGINE</h3>
            </div>
            <p className="text-[7px] lg:text-[8px] font-bold text-indigo-400 uppercase tracking-widest ml-8 lg:ml-9 opacity-80">
              {times === 0 ? "AWAITING PARAMETERS" : `EXECUTING ${times} CYCLES`}
            </p>
         </div>
         <button onClick={handleRestart} className="bg-slate-800/40 hover:bg-slate-700 w-8 h-8 lg:w-9 lg:h-9 rounded-xl flex items-center justify-center text-sm lg:text-lg border border-slate-700 transition-all active:scale-90 shadow-sm">🔄</button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-3 min-h-0 overflow-hidden">
        
        {/* LOOP CODE BLOCK - REFINED WIDTH */}
        <div className="w-full lg:w-[32%] flex flex-col items-center min-h-0 shrink-0">
           <div className="bg-white p-2.5 rounded-xl border border-indigo-50 mb-2 w-full shadow-sm">
             <div className="flex items-center gap-2">
                <span className="text-xs">📋</span>
                <p className="text-[8px] lg:text-[9px] font-black text-indigo-900 leading-tight uppercase tracking-tight">
                  {times === 0 ? "CONFIGURE COMMAND CENTER" : "EXECUTION READY"}
                </p>
             </div>
           </div>
           
           <div className="relative w-full flex-1 bg-indigo-600 rounded-[2rem] border-l-[10px] border-indigo-800 shadow-xl flex flex-col justify-between p-4 py-5 min-h-0 border border-white/10">
              <div className="bg-white/10 backdrop-blur-md shadow-inner px-3 py-1.5 rounded-xl self-start flex items-center gap-2.5 shrink-0 border border-white/20">
                 <span className="text-[7px] lg:text-[8px] font-black text-indigo-100 uppercase tracking-widest">REPEAT</span>
                 <div className={`bg-white text-indigo-600 px-2.5 py-0.5 rounded-md text-sm lg:text-xl font-black tabular-nums transition-all ${times === 0 ? 'animate-pulse' : ''}`}>
                   {times}
                 </div>
              </div>

              <div className="flex-1 flex items-center justify-center px-4">
                 <div className={`w-full max-w-[140px] bg-blue-500 rounded-xl p-3.5 shadow-[0_5px_0_0_#1d4ed8] border border-white/20 transition-all duration-300 ${playing ? 'scale-105 ring-4 ring-white/10' : 'opacity-70 scale-95'}`}>
                    <p className="text-[8px] lg:text-[10px] font-black text-white uppercase text-center tracking-widest drop-shadow-sm">JUMP UNIT</p>
                 </div>
              </div>

              <div className="h-4 w-1/2 bg-indigo-900/20 rounded-full self-start shrink-0"></div>
           </div>
        </div>

        {/* STAGE AREA - REFINED FRAME */}
        <div className="flex-1 bg-[#0a0a1f] rounded-[2.5rem] border-[6px] border-slate-800/30 relative flex flex-col items-center justify-end shadow-2xl overflow-hidden min-h-[180px]">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(circle,#818cf8_1px,transparent_1px)] bg-[size:40px_40px]" />

          {playing && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-indigo-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full shadow-2xl border border-white/10 z-50 animate-in slide-in-from-top duration-300 flex items-center gap-3">
              <span className="text-[8px] font-black uppercase tracking-widest opacity-60">CYCLE</span>
              <span className="text-base lg:text-xl tabular-nums font-black leading-none">{currentStep} <span className="text-[10px] opacity-40">/</span> {times}</span>
            </div>
          )}

          <div className="absolute bottom-1/2 left-0 right-0 h-[1px] bg-blue-500/10 pointer-events-none"></div>
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-orange-500/10 pointer-events-none"></div>

          <div className="relative mb-10 lg:mb-14 flex flex-col items-center justify-center w-full z-10">
            <div className={`w-16 lg:w-24 h-3 bg-blue-400/5 rounded-full blur-xl transition-all duration-[400ms] ${playing ? 'scale-x-150 opacity-0' : 'scale-100 opacity-40'}`}></div>
            <div className={`absolute bottom-1 text-[70px] lg:text-[110px] leading-none select-none filter drop-shadow(0 0 10px rgba(59,130,246,0.1)) transition-all duration-[400ms] ${playing ? 'animate-loop-jump' : 'transform-none'}`}>
   <span className="inline-block">🐱</span>
</div>
          </div>
          
          {done && !playing && (
            <div className="absolute inset-0 bg-emerald-950/95 flex flex-col items-center justify-center z-[200] animate-in fade-in zoom-in duration-300 p-4 text-center backdrop-blur-xl">
              <div className="max-w-[280px] lg:max-w-[340px] w-full bg-white/5 p-6 lg:p-8 rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-md">
                <span className="text-4xl lg:text-6xl mb-3 block animate-bounce">⭐</span>
                <h3 className="text-lg lg:text-2xl font-black text-white mb-1.5 uppercase tracking-tighter font-kids">
                  MISSION SUCCESS
                </h3>
                <p className="text-blue-200/60 font-bold mb-6 text-[8px] lg:text-[10px] leading-snug px-4 tracking-wider uppercase">
                  Logical loops verified. Clearance granted.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                  <button onClick={handleRestart} className="w-full sm:w-auto bg-slate-800/80 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-black text-[9px] border border-slate-700 transition-all active:scale-95 uppercase tracking-widest">RESET</button>
                  <button onClick={() => { sounds.playPop(); onNext?.(); }} className="w-full sm:w-auto bg-gradient-to-b from-emerald-400 to-emerald-600 text-white px-8 py-3 rounded-xl font-black text-sm shadow-lg transition-all active:translate-y-1 uppercase tracking-tighter">CONTINUE 🚀</button>
                </div>
              </div>
            </div>
          )}

          {!playing && !done && times === 0 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
               <div className="bg-indigo-600/40 text-white px-4 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                 <p className="font-black text-[7px] lg:text-[8px] uppercase tracking-[0.4em] whitespace-nowrap opacity-60">AWAITING INPUT</p>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* REFINED COMMAND CENTER - MATCHING SPRITE SIMULATOR */}
      <div className="bg-[#1e1b4b] p-3 lg:p-4 rounded-[2rem] mt-3 flex flex-wrap items-center justify-center gap-6 lg:gap-10 shadow-2xl border-b-[8px] border-[#0f172a] border-t border-white/5 shrink-0">
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-1.5">
             <div className="bg-slate-900/50 p-2 rounded-xl border border-indigo-500/20 flex flex-col items-center relative transition-all">
                <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-2.5 py-0.5 rounded-md text-[7px] font-black border border-white/10 tracking-[0.1em] font-kids uppercase whitespace-nowrap">REPETITIONS</div>
                <div className="bg-white rounded-lg mt-1 overflow-hidden border border-slate-200 flex items-center h-10 lg:h-12">
                  <button onClick={() => { sounds.playPop(); setTimes(t => Math.max(0, t-1)); }} className="w-10 h-full bg-slate-50 text-slate-400 hover:text-rose-500 transition-colors border-r border-slate-100 font-bold">－</button>
                  <div className={`text-xl lg:text-2xl font-black w-14 lg:w-16 flex items-center justify-center tabular-nums ${times === 0 ? 'text-slate-200' : 'text-slate-900'}`}>{times}</div>
                  <button onClick={() => { sounds.playPop(); setTimes(t => Math.min(10, t+1)); }} className="w-10 h-full bg-slate-50 text-slate-400 hover:text-emerald-500 transition-colors border-l border-slate-100 font-bold">＋</button>
                </div>
             </div>
          </div>
        </div>

        <button 
          onClick={() => { sounds.playPop(); start(); }}
          disabled={playing}
          className={`h-12 lg:h-14 px-10 lg:px-14 rounded-xl font-black text-sm lg:text-xl shadow-[0_5px_0_0_#064e3b] active:translate-y-1 active:shadow-none transition-all transform hover:scale-105 border-b border-white/10 flex items-center gap-2.5 font-kids ${
            playing ? 'bg-slate-700 cursor-not-allowed opacity-50 shadow-none' : 
            times === 0 ? 'bg-slate-800 shadow-[0_5px_0_0_#1e293b] cursor-not-allowed opacity-60' :
            'bg-gradient-to-b from-emerald-400 to-emerald-600 text-white'
          }`}
        >
          {playing ? 'BUSY' : 'RUN CODE 🚀'}
        </button>
      </div>

      <style>{`
        @keyframes loop-jump {
          0%, 100% { transform: translateY(0) scale(1, 1); }
          50% { transform: translateY(-16vh) scale(0.85, 1.15); }
        }
        .animate-loop-jump { 
          animation: loop-jump 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite; 
        }
        @media (max-width: 640px) {
          @keyframes loop-jump {
            0%, 100% { transform: translateY(0) scale(1, 1); }
            50% { transform: translateY(-8vh) scale(0.85, 1.15); }
          }
        }
      `}</style>
    </div>
  );
};