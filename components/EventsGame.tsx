import React, { useState } from 'react';
import { sounds } from '../services/sounds';

interface EventsGameProps {
  onWin?: () => void;
  isCompleted?: boolean;
  onNext?: () => void;
}

type MotionType = 'JUMP' | 'SPIN' | 'SHAKE' | 'NONE';
type SoundType = 'MEOW' | 'BOING' | 'MAGIC' | 'TADA' | 'NONE';
type BackdropType = 'SPACE' | 'PARK' | 'OCEAN';

const PHRASES = [
  { text: "Hello world!", icon: "👋" },
  { text: "Once upon a time...", icon: "📖" },
  { text: "Let's code!", icon: "💻" },
  { text: "I love stars!", icon: "⭐" },
  { text: "The end.", icon: "🏁" }
];

export const EventsGame: React.FC<EventsGameProps> = ({ onWin, isCompleted, onNext }) => {
  const [selectedMotion, setSelectedMotion] = useState<MotionType>('JUMP');
  const [selectedSound, setSelectedSound] = useState<SoundType>('MEOW');
  const [selectedPhrase, setSelectedPhrase] = useState(PHRASES[0]);
  const [backdrop, setBackdrop] = useState<BackdropType>('SPACE');
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const [showBubble, setShowBubble] = useState(false);
  const [count, setCount] = useState(0);
  const [showFact, setShowFact] = useState(false);

  const GOAL = 3; 

  const handleRestart = () => {
    sounds.playPop();
    setCount(0);
    setShowFact(false);
    setIsAnimating(false);
    setAnimationClass('');
    setShowBubble(false);
  };

  const handleClickSprite = () => {
    if (isAnimating || showFact) return;
    
    setIsAnimating(true);
    
    // Play Sound immediately
    if (selectedSound === 'MEOW') sounds.playMeow();
    else if (selectedSound === 'BOING') sounds.playBoing();
    else if (selectedSound === 'MAGIC') sounds.playMagic();
    else if (selectedSound === 'TADA') sounds.playTada();

    // Play Motion
    if (selectedMotion === 'JUMP') {
      sounds.playJump();
      setAnimationClass('animate-bounce-fast');
    } else if (selectedMotion === 'SPIN') {
      sounds.playSpin();
      setAnimationClass('animate-spin-once');
    } else if (selectedMotion === 'SHAKE') {
      sounds.playShake();
      setAnimationClass('animate-shake-once');
    }

    // Show Speech Bubble
    setShowBubble(true);

    // Update progress
    setCount(prev => {
        const next = Math.min(prev + 1, GOAL);
        if (next === GOAL) {
          setTimeout(() => {
            sounds.playSuccess();
            setShowFact(true);
            if (onWin) onWin();
          }, 800);
        }
        return next;
    });

    setTimeout(() => {
      setIsAnimating(false);
      setAnimationClass('');
      setShowBubble(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full gap-4 font-kids relative">
      <div className="bg-white p-3 rounded-3xl shadow-sm flex justify-between items-center border border-slate-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-lg shadow-[0_2px_0_0_#ca8a04]">⚡</div>
          <div className="flex flex-col">
            <h3 className="text-[14px] font-black text-indigo-900 leading-none">MAGIC RULES (EVENTS)</h3>
            <p className="text-[9px] text-indigo-400 font-bold uppercase mt-1">AIM: TAP THE CAT 3 TIMES TO WIN!</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-black text-slate-400 mr-2">BACKDROP:</span>
           {(['SPACE', 'PARK', 'OCEAN'] as BackdropType[]).map(b => (
             <button 
              key={b}
              onClick={() => { sounds.playPop(); setBackdrop(b); }}
              className={`px-3 py-1 rounded-full text-[9px] font-black transition-all ${backdrop === b ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
             >
               {b}
             </button>
           ))}
           <div className="w-[1px] h-4 bg-slate-200 mx-2" />
           <button onClick={handleRestart} className="bg-slate-100 p-2 rounded-full hover:bg-slate-200 text-xs">🔄</button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
        {/* BLOCK BUILDER SIDEBAR */}
        <div className="w-[42%] flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1">
          
          <div className="bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100 mb-1">
            <p className="text-[10px] font-bold text-indigo-800 leading-tight">
              Pick a <b>Move</b>, a <b>Sound</b>, and <b>Words</b>. Then tap the cat to test your rule!
            </p>
          </div>

          {/* TRIGGER */}
          <div className="bg-yellow-400 p-4 rounded-3xl border-b-4 border-yellow-600 shadow-lg relative shrink-0">
             <div className="absolute -top-2 left-4 bg-white text-yellow-600 px-2 py-0.5 rounded-full text-[7px] font-black border border-yellow-400 uppercase">Trigger</div>
             <div className="flex items-center gap-3 text-yellow-950 font-black">
               <span className="text-2xl">👆</span>
               <span className="text-[10px] uppercase tracking-tighter">WHEN I TAP THE CAT...</span>
             </div>
          </div>

          <div className="flex justify-center -my-3 z-0">
            <div className="w-4 h-6 bg-indigo-50 border-x-2 border-indigo-100"></div>
          </div>

          {/* ACTIONS CONTAINER */}
          <div className="bg-white p-4 rounded-[2rem] border-2 border-indigo-50 flex-1 space-y-4 shadow-inner overflow-y-auto custom-scrollbar">
             
             {/* MOTION SECTION */}
             <div className="space-y-2">
               <p className="text-[8px] font-black text-blue-500 uppercase tracking-[0.2em] text-center">🔵 PICK A DANCE MOVE</p>
               <div className="grid grid-cols-3 gap-1.5">
                  {(['JUMP', 'SPIN', 'SHAKE'] as MotionType[]).map(act => (
                    <button 
                      key={act}
                      onClick={() => { sounds.playPop(); setSelectedMotion(act); }}
                      className={`py-2 rounded-xl text-[9px] font-black transition-all border-b-2 ${
                        selectedMotion === act 
                          ? 'bg-blue-500 text-white border-blue-700 shadow-md' 
                          : 'bg-blue-50 text-blue-300 border-blue-100 hover:bg-blue-100'
                      }`}
                    >
                      {act}
                    </button>
                  ))}
               </div>
             </div>

             {/* SOUND SECTION */}
             <div className="space-y-2">
               <p className="text-[8px] font-black text-pink-500 uppercase tracking-[0.2em] text-center">💗 PICK A NOISE</p>
               <div className="grid grid-cols-2 gap-1.5">
                  {(['MEOW', 'BOING', 'MAGIC', 'TADA'] as SoundType[]).map(snd => (
                    <button 
                      key={snd}
                      onClick={() => { sounds.playPop(); setSelectedSound(snd); }}
                      className={`py-2 rounded-xl text-[9px] font-black transition-all border-b-2 ${
                        selectedSound === snd 
                          ? 'bg-pink-500 text-white border-pink-700 shadow-md' 
                          : 'bg-pink-50 text-pink-300 border-pink-100 hover:bg-pink-100'
                      }`}
                    >
                      🎵 {snd}
                    </button>
                  ))}
               </div>
             </div>

             {/* LOOKS SECTION */}
             <div className="space-y-2">
               <p className="text-[8px] font-black text-purple-500 uppercase tracking-[0.2em] text-center">🟣 PICK WORDS</p>
               <div className="grid grid-cols-1 gap-1.5">
                  {PHRASES.map(p => (
                    <button 
                      key={p.text}
                      onClick={() => { sounds.playPop(); setSelectedPhrase(p); }}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-[9px] font-black transition-all border-b-2 ${
                        selectedPhrase.text === p.text 
                          ? 'bg-purple-500 text-white border-purple-700 shadow-md' 
                          : 'bg-purple-50 text-purple-300 border-purple-100 hover:bg-purple-100'
                      }`}
                    >
                      <span className="text-base">{p.icon}</span>
                      <span className="truncate">SAY "{p.text.toUpperCase()}"</span>
                    </button>
                  ))}
               </div>
             </div>

          </div>
        </div>

        {/* PREVIEW STAGE */}
        <div 
          className={`flex-1 rounded-[3rem] border-4 border-indigo-900/20 relative flex flex-col items-center justify-center overflow-hidden shadow-2xl cursor-pointer group transition-all duration-700 ${
            backdrop === 'SPACE' ? 'bg-[#0a0a1f]' : 
            backdrop === 'PARK' ? 'bg-[#dcfce7]' : 'bg-[#e0f2fe]'
          }`} 
          onClick={handleClickSprite}
        >
          {/* DECORATIONS BASED ON BACKDROP */}
          {backdrop === 'SPACE' && (
             <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:30px_30px]" />
          )}
          {backdrop === 'PARK' && (
             <>
               <div className="absolute bottom-0 left-0 right-0 h-24 bg-emerald-500/20" />
               <span className="absolute bottom-16 left-12 text-5xl opacity-40">🌳</span>
               <span className="absolute bottom-20 right-16 text-5xl opacity-40">🌸</span>
             </>
          )}
          {backdrop === 'OCEAN' && (
             <>
               <div className="absolute bottom-0 left-0 right-0 h-32 bg-blue-500/20" />
               <span className="absolute bottom-12 left-1/4 text-5xl opacity-30 animate-pulse">🐚</span>
               <span className="absolute top-1/4 right-1/4 text-4xl opacity-20 animate-bounce">🫧</span>
             </>
          )}

          <div className="absolute top-4 left-6 right-6 flex justify-between items-center z-50">
             <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[8px] text-indigo-900 font-black uppercase tracking-widest border border-white/30 shadow-sm">
                STORY PREVIEW
             </div>
             <div className="flex flex-col items-end gap-1">
                <span className="text-[7px] text-white/50 font-black uppercase tracking-widest">PROGRESS</span>
                <div className="flex gap-1.5">
                   {[...Array(GOAL)].map((_, i) => (
                     <div key={i} className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${i < count ? 'bg-yellow-400 border-yellow-200 scale-125 shadow-[0_0_12px_#fbbf24]' : 'bg-white/10 border-white/20'}`}></div>
                   ))}
                </div>
             </div>
          </div>

          <div className={`transition-all duration-300 relative z-20 ${animationClass}`}>
             {showBubble && (
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 bg-white px-6 py-4 rounded-[2rem] shadow-2xl flex items-center gap-3 border-4 border-purple-400 min-w-[140px] whitespace-nowrap after:content-[''] after:absolute after:-bottom-3 after:left-1/2 after:-translate-x-1/2 after:border-t-[12px] after:border-t-white after:border-x-[12px] after:border-x-transparent animate-in zoom-in duration-200">
                  <span className="text-2xl">{selectedPhrase.icon}</span>
                  <p className="text-[10px] font-black text-indigo-900 uppercase leading-none">{selectedPhrase.text}</p>
                </div>
             )}
             <div className="w-32 h-32 bg-[#ffcc33] rounded-[2.5rem] flex items-center justify-center text-[80px] shadow-[0_15px_0_0_#ca8a04] border-[8px] border-white transform transition-transform group-hover:scale-105 select-none">
               🐱
             </div>
          </div>
          
          {!isAnimating && !showFact && (
            <div className="absolute bottom-12 flex flex-col items-center animate-bounce opacity-60">
              <span className="text-4xl">👆</span>
              <p className="text-[10px] font-black text-indigo-900 bg-white/80 px-4 py-1 rounded-full uppercase mt-2 tracking-widest shadow-sm">TAP THE CAT!</p>
            </div>
          )}

          {showFact && (
            <div className="absolute inset-0 bg-yellow-400/95 z-50 flex flex-col items-center justify-center p-10 text-center animate-in zoom-in duration-300">
               <span className="text-7xl mb-4 animate-bounce">🎭</span>
               <h3 className="text-3xl font-black text-indigo-950 uppercase mb-2 leading-tight">RULE MASTER!</h3>
               <p className="bg-white p-6 rounded-[2rem] border-4 border-yellow-200 shadow-xl mb-8 text-[12px] font-black text-indigo-900 leading-relaxed max-w-sm">
                 "You just taught the cat a rule! Every time you clicked, it did exactly what you told it to do!"
               </p>
               <button 
                onClick={() => { sounds.playPop(); onNext?.(); }}
                className="bg-green-600 text-white px-12 py-5 rounded-[2rem] font-black text-2xl shadow-[0_10px_0_0_#14532d] active:translate-y-2 active:shadow-none transition-all transform hover:scale-105"
               >
                 NEXT LEVEL 🚀
               </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes bounce-fast {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-100px); }
        }
        @keyframes spin-once {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shake-once {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-30px); }
          40% { transform: translateX(30px); }
          60% { transform: translateX(-30px); }
          80% { transform: translateX(30px); }
        }
        .animate-bounce-fast { animation: bounce-fast 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .animate-spin-once { animation: spin-once 0.6s ease-out; }
        .animate-shake-once { animation: shake-once 0.5s ease-in-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};