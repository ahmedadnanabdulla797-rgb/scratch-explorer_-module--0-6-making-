return (
    <div className={`h-full flex flex-col font-['Fredoka'] overflow-hidden transition-colors duration-500 ${isCreative ? 'bg-orange-50' : 'bg-sky-100'}`}>
      
      {/* Header - Made slightly thinner */}
      <div className="bg-[#1e1b4b] text-white px-4 py-2 flex items-center justify-between border-b-4 border-black/20 shrink-0">
        <h2 className="text-[10px] font-black uppercase tracking-widest">
            {isCreative ? "🎵 Music Maker" : "🏗️ Stack the Toys!"}
        </h2>
        <div className="text-[10px] font-black bg-white/20 px-3 py-1 rounded-full">
            {isCreative ? "FREE PLAY" : `STACK: ${blocks.length}/5`}
        </div>
      </div>

      {/* Main Game Area - Adjusted to fit screen */}
      <div className="flex-1 flex flex-col items-center justify-center p-2 gap-2 overflow-hidden">
        
        {/* THE STAGE - Height reduced from 400px to 300px so it fits */}
        <div className="relative w-full max-w-[260px] h-[300px] bg-white/50 rounded-[2.5rem] border-b-[8px] border-slate-400 shadow-inner flex flex-col-reverse items-center overflow-visible">
          
          {/* THE STAR */}
          {!isCreative && !isWin && (
            <div className="absolute top-2 animate-bounce">
              <span className="text-5xl drop-shadow-lg">⭐</span>
            </div>
          )}

          {/* THE BLOCKS */}
          <div className="flex flex-col-reverse items-center mb-1">
            {blocks.map((block) => (
              <div 
                key={block.id}
                className={`${block.color} w-20 h-12 rounded-xl flex items-center justify-center text-3xl shadow-[0_4px_0_0_rgba(0,0,0,0.2)] border-2 border-white/30 animate-in slide-in-from-top-10 duration-300`}
                style={{ marginBottom: '2px' }}
              >
                {block.emoji}
              </div>
            ))}
          </div>

          {/* Floor */}
          <div className="absolute bottom-[-8px] w-[110%] h-3 bg-slate-500 rounded-full" />
        </div>

        {/* THE BIG ACTION BUTTON - Made smaller (max-w-160px) so it's fully visible */}
        <div className="w-full max-w-[160px] pb-4 shrink-0">
          <button 
            onClick={dropBlock}
            className="w-full aspect-square bg-red-500 rounded-full border-b-[8px] border-red-800 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center justify-center shadow-lg group"
          >
            <span className="text-4xl group-active:scale-110 transition-transform">🚀</span>
            <span className="text-white font-black text-sm mt-1 uppercase">PUSH!</span>
          </button>
        </div>
      </div>

      {/* Win Screen */}
      {isWin && (
        <div className="absolute inset-0 z-[100] bg-indigo-900/90 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-in zoom-in">
          <div className="text-8xl mb-4 animate-bounce">🎉</div>
          <h3 className="text-3xl font-black text-white text-center uppercase">Amazing!</h3>
          <button 
            onClick={() => onNext?.()} 
            className="mt-6 bg-emerald-500 text-white px-12 py-4 rounded-[1.5rem] font-black text-xl shadow-[0_8px_0_0_#065f46]"
          >
            NEXT 🚀
          </button>
        </div>
      )}
    </div>
  );
