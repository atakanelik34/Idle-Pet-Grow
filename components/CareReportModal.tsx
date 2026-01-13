import React from 'react';
import { X } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CareReportModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { gameState } = useGame();

  if (!isOpen) return null;

  // Mock historical data for visualization
  const data = [
    { name: 'Mon', score: Math.max(0, gameState.careScore - 10) },
    { name: 'Tue', score: Math.max(0, gameState.careScore - 5) },
    { name: 'Wed', score: gameState.careScore },
  ];

  const getRating = (score: number) => {
    if (score >= 90) return { text: "Expert Handler", color: "text-green-600" };
    if (score >= 70) return { text: "Responsible Owner", color: "text-blue-600" };
    if (score >= 40) return { text: "Learning", color: "text-yellow-600" };
    return { text: "Needs Improvement", color: "text-red-600" };
  };

  const rating = getRating(gameState.careScore);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden animate-[float_0.5s_ease-out]">
        <div className="bg-blue-50 p-4 border-b border-blue-100 flex justify-between items-center">
          <h2 className="text-xl font-fredoka font-bold text-blue-800">Care Report</h2>
          <button onClick={onClose}><X className="text-blue-400" /></button>
        </div>
        
        <div className="p-6 text-center">
          <div className="text-6xl font-bold mb-2 text-gray-800">{Math.round(gameState.careScore)}</div>
          <div className={`text-lg font-bold mb-6 ${rating.color}`}>{rating.text}</div>

          <div className="h-40 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="score" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-left bg-gray-50 p-4 rounded-xl text-sm text-gray-600 space-y-2">
            <p>✅ Daily Login Streak: {gameState.daysAlive} days</p>
            <p>✅ Pet Happiness: {Math.round(gameState.stats.happiness)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};