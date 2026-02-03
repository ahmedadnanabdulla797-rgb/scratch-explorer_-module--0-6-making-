import React, { useState } from 'react';
import { sounds } from '../services/sounds';

const COORDINATE_QUESTIONS = [
  { q: "What does the 'X' number mean?", a: ["↔️ Side-to-Side", "↕️ Up-and-Down", "🔄 Spinning"], correct: 0, hint: "X is the flat line that goes left and right!" },
  { q: "If the cat moves to Y = 5, where does it go?", a: ["➡️ Right", "⬆️ Up", "⬅️ Left"], correct: 1, hint: "Y is the tall line! Plus (+) numbers go UP!" },
  { q: "Which number is always in the middle (the start)?", a: ["10", "100", "0"], correct: 2, hint: "Zero is the center of the world!" }
];

const LOOP_QUESTIONS = [
  { q: "What color is the 'Again' (Repeat) block?", a: ["🟡 Yellow", "🟠 Orange", "🔵 Blue"], correct: 1, hint: "Check the 'Again' game! The block looks like an Orange C!" },
  { q: "Which block looks like a 'C'?", a: ["Move Block", "Repeat Block", "Say Block"], correct: 1, hint: "The Orange block has a big mouth like a C!" },
  { q: "If you want the cat to jump 3 times, which number goes in the block?", a: ["1", "3", "0"], correct: 1, hint: "Type the number of jumps you want!" }
];

const EVENT_QUESTIONS = [
  { q: "Which color is the 'Magic Rule' (Event) block?", a: ["🟡 Yellow", "🔵 Blue", "🟣 Purple"], correct: 0, hint: "Rules are always YELLOW like a lightning bolt! ⚡" },
  { q: "What color is the 'Moving' (Motion) block?", a: ["🟡 Yellow", "🔵 Blue", "🟣 Purple"], correct: 1, hint: "Moving is BLUE like the sky! 🏃‍♂️" },
  { q: "Which color is the 'Talking' (Looks) block?", a: ["🟡 Yellow", "🔵 Blue", "🟣 Purple"], correct: 2, hint: "Talking is PURPLE! 🟣" }
];

const CONDITION_QUESTIONS = [
  { q: "What color is the 'Sensing' (Feeling) block?", a: ["Light Blue", "Red", "Green"], correct: 0, hint: "Sensing is LIGHT BLUE like water! 🧊" },
  { q: "The 'IF' block is the Cat's _______?", a: ["Tail", "Brain", "Feet"], correct: 1, hint: "The IF block helps the cat make smart choices!" }
];

// NEW: Simple questions for Module 5 (Advanced but easy to understand)
const ADVANCED_QUESTIONS = [
  { q: "How do we win a Maze Game?", a: ["🏃 Get to the Goal", "🧱 Touch the Wall", "😴 Stay Still"], correct: 0, hint: "Look for the finish line! 🏁" },
  { q: "What does a 'Broadcast' do?", a: ["🔇 Shushes", "📢 Sends a Message", "💤 Sleeps"], correct: 1, hint: "It's like calling your friend on the phone! ☎️" }
];

// NEW: Final Master questions for Module 6
const MASTER_QUESTIONS = [
  { q: "Who is the Master Coder?", a: ["🤖 Robot", "🐱 Cat", "👤 YOU!"], correct: 2, hint: "You built all these amazing games!" },
  { q: "What can you make with code?", a: ["🎨 Art", "🕹️ Games", "🌈 EVERYTHING!"], correct: 2, hint: "Coding is like magic!" }
];

export const QuizComponent: React.FC<{ onComplete: () => void, onNext: () => void, questionsType?: 'loops' | 'events' | 'conditions' | 'coordinates' | 'advanced' | 'master' }> = ({ onComplete, onNext, questionsType = 'loops' }) => {
  // Logic updated to include advanced and master types
  const QUESTIONS = 
    questionsType === 'events' ? EVENT_QUESTIONS : 
    questionsType === 'conditions' ? CONDITION_QUESTIONS : 
    questionsType === 'coordinates' ? COORDINATE_QUESTIONS : 
    questionsType === 'advanced' ? ADVANCED_QUESTIONS : 
    questionsType === 'master' ? MASTER_QUESTIONS : 
    LOOP_QUESTIONS;

  const [curr, setCurr] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleAnswer = (idx: number) => {
    if (idx === QUESTIONS[curr].correct) {
      sounds.playCollect();
      setScore(s => s + 1);
    } else {
      sounds.playPop(); 
    }
    setShowHint(false);
    if (curr < QUESTIONS.length - 1) setCurr(c => c + 1);
    else {
      setDone(true);
      onComplete(); 
    }
  };

  if (done) {
    return (
      <div className="text-center space-y-4 py-8 h-full flex flex-col justify-center items-center font-kids">
        <div className="text-[6rem] animate-bounce">🏆</div>
        <h3 className="text-4xl font-black text-indigo-950 uppercase">QUIZ HERO!</h3>
        <p className="text-xl font-bold text-indigo-500">You got {score} right!</p>
        <button 
          onClick={() => { sounds.playFanfare(); onNext(); }}
          className="bg-green-500 text-white px-12 py-5 rounded-[2rem] text-2xl font-black shadow-[0_8px_0_0_#15803d] active:translate-y-2 active:shadow-none transition-all"
        >
          CONTINUE QUEST! 🚀
        </button>
      </div>
    );
  }

  const currentQ = QUESTIONS[curr];

  return (
    <div className="space-y-4 h-full flex flex-col font-kids p-2">
      <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border-2 border-indigo-50 shrink-0">
        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-black shadow-lg">
          {curr + 1}
        </div>
        <div className="flex-1 bg-indigo-100 h-4 rounded-full overflow-hidden">
          <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${((curr + 1) / QUESTIONS.length) * 100}%` }} />
        </div>
      </div>

      <div className="text-center shrink-0">
        <div className="bg-white p-6 rounded-[2rem] border-4 border-indigo-100 shadow-xl relative">
          <h3 className="text-2xl font-black text-indigo-950 leading-tight">
            {currentQ.q}
          </h3>
          <button 
            onClick={() => { sounds.playPop(); setShowHint(!showHint); }}
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-950 px-4 py-1 rounded-full text-[10px] font-black uppercase shadow-md active:scale-95"
          >
            {showHint ? "Click to Close" : "💡 Need a hint?"}
          </button>
        </div>
      </div>

      {showHint && (
        <div className="bg-yellow-50 p-4 rounded-2xl border-2 border-yellow-200 animate-in fade-in zoom-in duration-300">
           <div className="flex items-center gap-3">
             <div className="text-3xl">💡</div>
             <p className="text-xs font-bold text-yellow-800 italic">"Remember what you learned! {currentQ.hint}"</p>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 overflow-y-auto flex-1 pr-1 pb-4">
        {currentQ.a.map((opt, i) => {
          const isYellow = opt.includes('Yellow');
          const isOrange = opt.includes('Orange');
          const isBlue = opt.includes('Blue');
          const isPurple = opt.includes('Purple');

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className={`p-5 rounded-[1.5rem] text-xl font-black text-left border-4 transition-all transform active:scale-95 flex items-center gap-6 shadow-lg group
                ${isYellow ? 'bg-yellow-400 border-yellow-200 text-yellow-950 hover:bg-yellow-300' : ''}
                ${isOrange ? 'bg-orange-500 border-orange-300 text-white hover:bg-orange-400' : ''}
                ${isBlue ? 'bg-blue-500 border-blue-300 text-white hover:bg-blue-400' : ''}
                ${isPurple ? 'bg-purple-500 border-purple-300 text-white hover:bg-purple-400' : ''}
                ${!isYellow && !isOrange && !isBlue && !isPurple ? 'bg-white border-indigo-100 text-indigo-900 hover:bg-indigo-50' : ''}
              `}
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-sm font-black shadow-inner group-hover:bg-white/40">
                {String.fromCharCode(65 + i)}
              </div>
              <span className="flex-1">{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
