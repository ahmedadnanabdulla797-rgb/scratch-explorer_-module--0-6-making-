import React from 'react';

export const WelcomeModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-indigo-900/90 backdrop-blur-sm">
      <div className="bg-white rounded-[3rem] p-8 max-w-lg w-full text-center shadow-2xl border-8 border-yellow-400 animate-in zoom-in duration-300">
        <div className="text-8xl mb-4 animate-bounce">🐱</div>
        <h2 className="text-4xl font-black text-indigo-900 mb-4">Sprite Quest!</h2>
        <p className="text-xl text-gray-700 font-bold mb-8 leading-relaxed">
          Ready to learn how to build amazing games? 🎮
        </p>
        
        <div className="space-y-4 text-left mb-8">
          <div className="flex items-center gap-4 bg-indigo-50 p-4 rounded-2xl">
            <span className="text-3xl">⬅️</span>
            <p className="font-bold text-indigo-900">1. Select levels from the menu!</p>
          </div>
          <div className="flex items-center gap-4 bg-yellow-50 p-4 rounded-2xl">
            <span className="text-3xl">⭐</span>
            <p className="font-bold text-yellow-700">2. Earn stars for every win!</p>
          </div>
          <div className="flex items-center gap-4 bg-green-50 p-4 rounded-2xl">
            <span className="text-3xl">🚀</span>
            <p className="font-bold text-green-700">3. Complete modules to level up!</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-green-500 hover:bg-green-600 text-white text-3xl font-black py-6 rounded-[2rem] shadow-[0_10px_0_0_#15803d] transition-all transform hover:scale-105 active:translate-y-2 active:shadow-none"
        >
          START QUEST! 🚀
        </button>
      </div>
    </div>
  );
};