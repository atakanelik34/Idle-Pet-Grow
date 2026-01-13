import React from 'react';
import { GameProvider } from './context/GameContext';
import { PetRender } from './components/PetRender';
import { ActionMenu } from './components/ActionMenu';
import { UIOverlay } from './components/UIOverlay';

const App: React.FC = () => {
  return (
    <GameProvider>
      <div className="h-[100dvh] w-full max-w-md mx-auto relative bg-gradient-to-b from-sky-200 to-green-100 overflow-hidden flex flex-col shadow-2xl">
        
        {/* Background Decor */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-yellow-200/20 rounded-full blur-xl"></div>
        
        {/* Floor/Grass */}
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-green-300/80 to-transparent z-0 pointer-events-none"></div>

        {/* Main Game Area */}
        <UIOverlay />
        
        <main className="flex-1 flex flex-col justify-center items-center pb-32 relative z-10">
          <PetRender />
          
          <div className="mt-8 bg-white/40 backdrop-blur-sm px-6 py-2 rounded-full">
            <p className="text-gray-700 font-medium text-sm">
              Tap pet to love • Keep stats high!
            </p>
          </div>
        </main>

        <ActionMenu />
      </div>
    </GameProvider>
  );
};

export default App;