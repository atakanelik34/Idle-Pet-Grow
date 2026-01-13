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
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [latestAction]);

  if (!showAnimation) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[200] pointer-events-none bg-black/30">
      <img
        src="/feed-animation.gif"
        alt="Feed animation"
        className="w-screen h-screen object-cover"
      />
    </div>
  );
};
