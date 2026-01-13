import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';

export const FeedAnimation: React.FC = () => {
  const { latestAction } = useGame();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (latestAction?.type === 'FEED') {
      setShowAnimation(true);
      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [latestAction]);

  if (!showAnimation) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[200] pointer-events-none">
      <img
        src="/feed-animation.gif"
        alt="Feed animation"
        className="w-64 h-64 object-contain drop-shadow-2xl"
      />
    </div>
  );
};
