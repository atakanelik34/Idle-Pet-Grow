import React from 'react';
import { useGame } from '../context/GameContext';
import { StatusBar } from './StatusBar';
import { Utensils, Zap, Smile, Trash2, Heart } from 'lucide-react';
import { THRESHOLDS } from '../constants';

export const ActionMenu: React.FC = () => {
  const { gameState, performAction } = useGame();
  const { stats, inventory } = gameState;

  // Determine button states
  const canFeed = inventory.basicFood > 0;
  const needsClean = stats.hygiene < 100;
  
  // Dynamic color logic for bars
  const getColor = (val: number) => val < THRESHOLDS.CRITICAL ? 'bg-red-500' : (val < 50 ? 'bg-yellow-500' : 'bg-green-500');

  return (
    <div className="absolute bottom-0 w-full bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 pb-8 z-50 transition-transform">
      
      {/* Status Bars */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1 mb-6">
        <StatusBar 
          label="Hunger" 
          value={stats.hunger} 
          color={getColor(stats.hunger)} 
          icon={<Utensils size={14} />} 
        />
        <StatusBar 
          label="Clean" 
          value={stats.hygiene} 
          color={getColor(stats.hygiene)} 
          icon={<Trash2 size={14} />} 
        />
        <StatusBar 
          label="Energy" 
          value={stats.energy} 
          color={getColor(stats.energy)} 
          icon={<Zap size={14} />} 
        />
        <StatusBar 
          label="Love" 
          value={stats.happiness} 
          color={getColor(stats.happiness)} 
          icon={<Heart size={14} />} 
        />
      </div>

      {/* Main Actions */}
      <div className="flex justify-between gap-4">
        
        <ActionButton 
          onClick={() => performAction('FEED')}
          disabled={!canFeed}
          label="Feed"
          subLabel={`x${inventory.basicFood}`}
          icon={<Utensils className="w-6 h-6" />}
          color="bg-orange-100 text-orange-600 hover:bg-orange-200"
        />

        <ActionButton 
          onClick={() => performAction('CLEAN')}
          disabled={!needsClean}
          label="Clean"
          icon={<Trash2 className="w-6 h-6" />}
          color="bg-blue-100 text-blue-600 hover:bg-blue-200"
        />

        <ActionButton 
          onClick={() => performAction('PLAY')}
          disabled={stats.energy < 20}
          label="Play"
          icon={<Smile className="w-6 h-6" />}
          color="bg-pink-100 text-pink-600 hover:bg-pink-200"
        />

      </div>
    </div>
  );
};

interface ButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  subLabel?: string;
  color: string;
  disabled?: boolean;
}

const ActionButton: React.FC<ButtonProps> = ({ onClick, icon, label, subLabel, color, disabled }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`
      flex-1 py-4 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all
      ${disabled ? 'opacity-50 grayscale bg-gray-100 cursor-not-allowed' : `${color} active:scale-95 shadow-sm`}
    `}
  >
    {icon}
    <span className="font-bold text-sm">{label}</span>
    {subLabel && <span className="text-[10px] opacity-70 font-mono">{subLabel}</span>}
  </button>
);