import React from 'react';

interface StatusBarProps {
  label: string;
  value: number;
  color: string;
  icon?: React.ReactNode;
}

export const StatusBar: React.FC<StatusBarProps> = ({ label, value, color, icon }) => {
  return (
    <div className="flex items-center gap-2 w-full mb-2">
      <div className="w-6 text-gray-600 flex justify-center">{icon}</div>
      <div className="flex-1">
        <div className="flex justify-between text-xs font-bold text-gray-500 mb-0.5 uppercase tracking-wider">
          <span>{label}</span>
          <span>{Math.round(value)}%</span>
        </div>
        <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <div 
            className={`h-full ${color} transition-all duration-700 ease-out`}
            style={{ width: `${Math.max(5, value)}%` }}
          />
        </div>
      </div>
    </div>
  );
};