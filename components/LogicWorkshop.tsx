import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sounds } from '../services/sounds';

type WorkshopMode = 'LOOP' | 'CONDITION' | 'LOGIC' | 'FINAL' | 'PLAYGROUND';

const MOVE_OPTIONS = [
  { label: 'Tiny Step 👣', val: 20 },
  { label: 'Small Walk 🚶', val: 40 },
  { label: 'Big Jump 🚀', val: 80 },
  { label: 'Mega Dash 🔥', val: 140 }
];

const TURN_OPTIONS = [
  { label: 'Turn a Little ↪️', val: 45 },
  { label: 'Square Turn 📐', val: 90 },
  { label: 'Half Flip 🔄', val: 135 },
  { label: 'Total Flip 🙃', val: 180 }
];

const WAIT_OPTIONS = [
  { label: 'Quick Blink ✨', val: 150 },
  { label: 'Short Rest ⏱️', val: 400 },
  { label: 'Long Nap 💤', val: 1000 }
];

const REPEAT_OPTIONS = [
  { label: 'Twice (2)', val: 2 },
  { label: 'Thrice (3)', val: 3 },
  { label: 'Plenty (5)', val: 5 },
  { label: 'Heaps (10)', val: 10 }
];

interface Block {
  id: string;
  type: 'repeat' | 'forever' | 'if' | 'ifelse' | 'move' | 'turn' | 'wait' | 'say';
  value?: any; 
  color: string;
  subBlocks?: Block[];
}

export const LogicWorkshop: React.FC<{ mode: WorkshopMode, onWin?: () => void, isCompleted?: boolean, onNext?: () => void }> = ({ mode, onWin, isCompleted, onNext }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBlockId, setCurrentBlockId] = useState<string | null>(null);
  const [spriteState, setSpriteState] = useState({ x: 0, y: 0, rotation: 0, say: '', hearts: 3, score: 0 });
  const [ghostSprite, setGhostSprite] = useState({ x: 0, y: 0, rotation: 0, visible: false });
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isWin, setIsWin] = useState(false);
  const [hint, setHint] = useState('');
  const [loopMsg, setLoopMsg] = useState('');
  const executionRef = useRef(false);
  const ghostTimeout = useRef<number | null>(null);
  const stageSize = 340;

  const COLORS = { motion: '#4C97FF', loops: '#FFAB19', control: '#FFAB19', sensing: '#4CBFE6', looks: '#9966FF' };

  const setup = useCallback(() => {
    setIsPlaying(false);
    setIsWin(false);
    setSpriteState({ x: 0, y: 0, rotation: 0, say: '', hearts: 3, score: 0 });
    setGhostSprite({ x: 0, y: 0, rotation: 0, visible: false });
    setCurrentBlockId(null);
    setLoopMsg('');

    if (mode === 'LOOP') {
      setHint("JUMP 5 TIMES TO WIN!");
      setBlocks([{ id: 'b1', type: 'repeat', value: 'Plenty (5)', color: COLORS.control, subBlocks: [{ id: 'b1-1', type: 'move', value: 'Small Walk 🚶', color: COLORS.motion }, { id: 'b1-2', type: 'wait', value: 'Quick Blink ✨', color: COLORS.control }, { id: 'b1-3', type: 'move', value: 'Tiny Step 👣', color: COLORS.motion }, { id: 'b1-4', type: 'wait', value: 'Quick Blink ✨', color: COLORS.control }] }]);
    } else if (mode === 'CONDITION') {
      setHint("TEACH KIT TO TURN AT WALLS!");
      setBlocks([{ id: 'b1', type: 'forever', color: COLORS.control, subBlocks: [{ id: 'b2', type: 'move', value: 'Small Walk 🚶', color: COLORS.motion }, { id: 'b3', type: 'if', value: 'touching_edge', color: COLORS.control, subBlocks: [{ id: 'b3-1', type: 'say', value: 'Whoops! Wall!', color: COLORS.looks }, { id: 'b3-2', type: 'turn', value: 'Total Flip 🙃', color: COLORS.motion }] }] }]);
    } else if (mode === 'LOGIC') {
      setHint("GET THE STAR, AVOID MONSTERS!");
      setBlocks([{ id: 'b1', type: 'forever', color: COLORS.control, subBlocks: [{ id: 'b2', type: 'move', value: 'Tiny Step 👣', color: COLORS.motion }, { id: 'b3', type: 'if', value: 'touching_obstacle', color: COLORS.control, subBlocks: [{ id: 'b3-1', type: 'turn', value: 'Square Turn 📐', color: COLORS.motion }] }, { id: 'b4', type: 'if', value: 'at_goal', color: COLORS.control, subBlocks: [{ id: 'b4-1', type: 'say', value: 'I GOT THE STAR!', color: COLORS.looks }] }] }]);
    } else if (mode === 'FINAL' || mode === 'PLAYGROUND') {
      setHint(mode === 'FINAL' ? "EXPLORE THE WORLD!" : "EXPERIMENT FREELY!");
      setBlocks([{ id: 'b1', type: 'forever', color: COLORS.control, subBlocks: [{ id: 'b2', type: 'move', value: 'Small Walk 🚶', color: COLORS.motion }, { id: 'b3', type: 'if', value: 'touching_edge', color: COLORS.control, subBlocks: [{ id: 'b3-1', type: 'turn', value: 'Total Flip 🙃', color: COLORS.motion }] }, { id: 'b4', type: 'if', value: 'at_goal', color: COLORS.control, subBlocks: [{ id: 'b4-1', type: 'say', value: 'MISSION WON!', color: COLORS.looks }] }] }]);
    }
  }, [mode]);

  useEffect(() => { setup(); }, [setup]);

  const cycle = (id: string, type: string, current: string) => {
    let opts: any[] = type === 'move' ? MOVE_OPTIONS : type === 'turn' ? TURN_OPTIONS : type === 'wait' ? WAIT_OPTIONS : REPEAT_OPTIONS;
    const idx = opts.findIndex(o => o.label === current);
    const next = opts[(idx + 1) % opts.length];

    if (!isPlaying) {
      if (ghostTimeout.current) window.clearTimeout(ghostTimeout.current);
      let gx = spriteState.x, gy = spriteState.y, gr = spriteState.rotation;
      if (type === 'move') { const rad = (gr * Math.PI) / 180; gx += Math.cos(rad) * next.val; gy += Math.sin(rad) * next.val; }
      else if (type === 'turn') gr += next.val;
      setGhostSprite({ x: gx, y: gy, rotation: gr, visible: true });
      ghostTimeout.current = window.setTimeout(() => setGhostSprite(p => ({ ...p, visible: false })), 1200);
    }

    const update = (list: Block[]): Block[] => list.map(b => b.id === id ? { ...b, value: next.label } : b.subBlocks ? { ...b, subBlocks: update(b.subBlocks) } : b);
    sounds.playPop();
    setBlocks(p => update(p));
  };

  const execute = async (list: Block[]) => {
    for (const b of list) {
      if (!executionRef.current) break;
      setCurrentBlockId(b.id);
      let val = (MOVE_OPTIONS.concat(TURN_OPTIONS, WAIT_OPTIONS, REPEAT_OPTIONS).find(o => o.label === b.value))?.val || 0;

      if (b.type === 'move') {
        setSpriteState(p => {
          const rad = (p.rotation * Math.PI) / 180;
          const mv = b.id.includes('b1-3') ? -val : val; 
          let nx = Math.max(-stageSize/2, Math.min(stageSize/2, p.x + Math.cos(rad) * mv));
          let ny = Math.max(-stageSize/2, Math.min(stageSize/2, p.y + Math.sin(rad) * mv));
          sounds.playPop();
          return { ...p, x: nx, y: ny };
        });
        await new Promise(r => setTimeout(r, 150));
      } else if (b.type === 'turn') {
        sounds.playSpin();
        setSpriteState(p => ({ ...p, rotation: p.rotation + val }));
        await new Promise(r => setTimeout(r, 200));
      } else if (b.type === 'say') {
        setSpriteState(p => ({ ...p, say: b.value }));
        await new Promise(r => setTimeout(r, 800));
        setSpriteState(p => ({ ...p, say: '' }));
      } else if (b.type === 'wait') {
        await new Promise(r => setTimeout(r, val));
      } else if (b.type === 'repeat') {
        for (let i = 1; i <= val; i++) {
          if (!executionRef.current) break;
          setLoopMsg(`Repeat ${i} of ${val}`);
          if (b.subBlocks) await execute(b.subBlocks);
        }
        setLoopMsg('');
      } else if (b.type === 'forever') {
        while (executionRef.current) {
          if (b.subBlocks) await execute(b.subBlocks);
          await new Promise(r => setTimeout(r, 50));
          if (check()) break;
        }
      } else if (b.type === 'if') {
        if (sense(b.value)) if (b.subBlocks) await execute(b.subBlocks);
      }
    }
  };

  const sense = (cond: string) => {
    const b = stageSize / 2 - 45;
    if (cond === 'touching_edge') return Math.abs(spriteState.x) >= b || Math.abs(spriteState.y) >= b;
    if (cond === 'touching_obstacle') return Math.abs(spriteState.x - 80) < 50 && Math.abs(spriteState.y - 80) < 50;
    if (cond === 'at_goal') return Math.abs(spriteState.x - (-80)) < 40 && Math.abs(spriteState.y - (-80)) < 40;
    return false;
  };

  const check = () => { if (sense('at_goal')) { win(); return true; } return false; };
  const win = () => { executionRef.current = false; setIsPlaying(false); setIsWin(true); sounds.playSuccess(); if (onWin) onWin(); };
  const start = async () => { if (isPlaying) return; sounds.playPop(); setIsPlaying(true); setGhostSprite(p => ({ ...p, visible: false })); executionRef.current = true; await execute(blocks); if (mode === 'LOOP' && executionRef.current) win(); else if (!executionRef.current || !isWin) setIsPlaying(false); };
  const stop = () => { sounds.playPop(); executionRef.current = false; setIsPlaying(false); setup(); };

  const render = (b: Block) => (
    <div key={b.id} className={`relative transition-all rounded-lg p-2.5 mb-1.5 border-l-[6px] shadow-md text-white font-black text-[10px] flex flex-col gap-1 ${currentBlockId === b.id ? 'ring-2 ring-white scale-[1.02] z-10' : 'opacity-95'}`} style={{ backgroundColor: b.color, borderLeftColor: 'rgba(0,0,0,0.1)' }}>
      <div className="flex items-center gap-1.5 flex-wrap">
        {b.type === 'repeat' && 'DO'} {b.type === 'forever' && 'ALWAYS'} {b.type === 'if' && 'IF Kit'} {b.type === 'move' && 'Kit'} {b.type === 'turn' && 'Kit'} {b.type === 'say' && 'Kit says'} {b.type === 'wait' && 'Kit'}
        {['repeat', 'move', 'turn', 'wait'].includes(b.type) ? <button onClick={() => cycle(b.id, b.type, b.value)} disabled={isPlaying} className="bg-white text-indigo-950 px-2 py-0.5 rounded text-center shadow-inner font-black text-[9px] min-w-[70px]">{b.value}</button> : <span className="bg-sky-200 text-sky-800 px-2 py-0.5 rounded text-[8px] uppercase">{b.value === 'touching_edge' ? 'Hits Wall' : b.value === 'touching_obstacle' ? 'Hits Monster' : b.value === 'at_goal' ? 'Finds Star' : b.value}</span>}
        {b.type === 'repeat' && ' TIMES:'} {b.type === 'if' && ' THEN...'}
      </div>
      {b.subBlocks && <div className="ml-3 pl-3 border-l-2 border-black/5 flex flex-col gap-1.5 py-1 bg-black/5 rounded-md">{b.subBlocks.map(render)}</div>}
    </div>
  );

  return (
    <div className="h-full flex flex-col font-['Fredoka'] bg-[#e0f2fe] overflow-hidden">
      <div className="bg-[#1e1b4b] text-white px-4 py-2 flex items-center justify-between border-b-4 border-indigo-950 shrink-0 shadow-lg z-40">
        <div className="flex items-center gap-3"><div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-lg">🤖</div><div><h2 className="text-sm font-black uppercase leading-none">KIT'S LAB</h2><p className="text-[7px] font-black text-indigo-300 mt-0.5">{isPlaying ? 'THINKING...' : 'READY'}</p></div></div>
        <div className="flex gap-3 items-center bg-white/10 px-3 py-1 rounded-xl border border-white/10"><div className="flex items-center gap-1.5"><span>❤️</span><span className="text-xs font-black">{spriteState.hearts}</span></div><div className="flex items-center gap-1.5"><span>⭐</span><span className="text-xs font-black">{spriteState.score}</span></div></div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className="w-[260px] p-4 flex flex-col bg-[#f1f5f9] border-r-2 border-slate-300 shadow-inner shrink-0 overflow-y-auto"><div className="bg-white p-3 rounded-xl border-2 border-indigo-50 shadow-sm mb-4 flex items-start gap-2"><span className="text-xl">💡</span><p className="text-[9px] font-black text-slate-700 leading-tight uppercase mt-1">{hint}</p></div><div className="flex-1">{blocks.map(render)}</div></div>
        <div className="flex-1 relative bg-[#0f172a] flex items-center justify-center p-4 overflow-hidden">
          <div className="relative w-[340px] h-[340px] bg-[#1e293b] rounded-[2rem] border-[6px] border-white/5 shadow-2xl flex items-center justify-center overflow-hidden">
            {(mode === 'LOGIC' || mode === 'FINAL') && <><div className="absolute w-20 h-20 bg-emerald-500/10 border-4 border-dashed border-emerald-500/30 rounded-full flex items-center justify-center animate-pulse" style={{ transform: 'translate(-70px, -70px)' }}><span className="text-4xl">⭐</span></div><div className="absolute w-20 h-20 bg-rose-500/10 border-4 border-rose-500/30 rounded-xl flex items-center justify-center" style={{ transform: 'translate(70px, 70px)' }}><span className="text-4xl">👾</span></div></>}
            <div className="relative transition-all duration-300 ease-out z-20" style={{ transform: `translate(${spriteState.x}px, ${spriteState.y}px) rotate(${spriteState.rotation}deg)` }}>
              {loopMsg && <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg text-indigo-700 font-black text-[9px] animate-bounce border-2 border-indigo-100 z-50 whitespace-nowrap uppercase tracking-tight">🔁 {loopMsg}</div>}
              {spriteState.say && <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-xl shadow-lg text-indigo-950 font-black text-xs border-2 border-indigo-200 z-50 whitespace-nowrap uppercase tracking-tight">💬 {spriteState.say}</div>}
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-indigo-300 rounded-2xl flex items-center justify-center text-[50px] shadow-[0_6px_0_0_#1e1b4b] border-4 border-white">🐱</div>
            </div>
          </div>
          {isWin && <div className="absolute inset-0 bg-indigo-950/98 z-[200] flex flex-col items-center justify-center p-6 animate-in zoom-in duration-300 backdrop-blur-3xl"><div className="text-7xl mb-4 animate-bounce">🏆</div><h3 className="text-4xl font-black text-white uppercase mb-2">AMAZING!</h3><p className="text-indigo-300 text-sm font-black uppercase mb-8">MISSION COMPLETE</p><div className="flex gap-4"><button onClick={stop} className="bg-white/10 text-white px-6 py-3 rounded-xl font-black border-2 border-white/20 uppercase text-xs">RESET</button><button onClick={() => onNext?.()} className="bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black text-xl shadow-lg uppercase">NEXT 🚀</button></div></div>}
        </div>
      </div>
      <div className="bg-[#1e1b4b] p-4 flex items-center justify-center gap-6 border-t-4 border-indigo-950 shadow-inner z-40 shrink-0">
          <button onClick={stop} className="w-12 h-12 bg-slate-800 text-white rounded-xl flex items-center justify-center text-xl shadow hover:bg-slate-700 transition-all">⏹️</button>
          <button onClick={start} disabled={isPlaying || isWin} className={`h-12 px-16 rounded-xl font-black text-xl shadow-lg transition-all transform hover:scale-105 ${isPlaying || isWin ? 'bg-slate-700 opacity-50' : 'bg-emerald-500 text-white'}`}>{isPlaying ? '...' : 'RUN! 🚀'}</button>
          <button onClick={() => alert("Ready to see Kit's logic?")} className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-xl shadow hover:bg-indigo-500 transition-all">👣</button>
      </div>
    </div>
  );
};