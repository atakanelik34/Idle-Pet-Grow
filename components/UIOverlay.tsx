import React, { useState } from 'react';
import { Coins, Settings, Trophy, AlertTriangle } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { CareReportModal } from './CareReportModal';
import { HealthState } from '../types';

export const UIOverlay: React.FC = () => {
  const { gameState, offlineReport, clearOfflineReport, buyItem, performAction } = useGame();
  const [showReport, setShowReport] = useState(false);
  const [showShop, setShowShop] = useState(false); // Simplified shop toggle for prototype

  // Offline Popup
  if (offlineReport) {
    return (
      <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full">
          <div className="text-4xl mb-4">🌙</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
          <p className="text-gray-600 mb-6">
            While you were away for {Math.floor(offlineReport.seconds / 60)} minutes, 
            {gameState.petName} missed you!
          </p>
          
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mb-6">
            <div className="text-sm text-yellow-800 uppercase font-bold tracking-wide mb-1">Earned</div>
            <div className="flex items-center justify-center gap-2 text-3xl font-bold text-yellow-600">
              <Coins className="fill-current" />
              <span>{offlineReport.coins}</span>
            </div>
          </div>

          <button 
            onClick={clearOfflineReport}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-transform active:scale-95"
          >
            Collect & Play
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-40 pointer-events-none">
        
        {/* Coins Badge */}
        <div className="pointer-events-auto bg-white/90 backdrop-blur shadow-lg rounded-full px-4 py-2 flex items-center gap-2 border border-gray-100">
          <div className="bg-yellow-100 p-1.5 rounded-full">
            <Coins className="w-5 h-5 text-yellow-600" />
          </div>
          <span className="font-bold text-gray-800 font-mono text-lg">{Math.floor(gameState.coins)}</span>
        </div>

        {/* Right Side Icons */}
        <div className="flex gap-3 pointer-events-auto">
          <button 
            onClick={() => setShowReport(true)}
            className="bg-white/90 p-3 rounded-full shadow-lg border border-gray-100 hover:bg-blue-50 transition-colors"
          >
            <Trophy className="w-5 h-5 text-blue-500" />
          </button>
          <button className="bg-white/90 p-3 rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors">
            <Settings className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Vet / Health Warning */}
      {gameState.healthState !== HealthState.HEALTHY && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-30 animate-pulse pointer-events-auto cursor-pointer"
             onClick={() => performAction('VET')}>
          <AlertTriangle size={16} />
          <span className="font-bold text-sm">Pet needs a Vet! Tap to cure. (-200 coins)</span>
        </div>
      )}

      <CareReportModal isOpen={showReport} onClose={() => setShowReport(false)} />
    </>
  );
};