import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { HealthState, PetType } from '../types';
import { Heart, AlertCircle, Sparkles } from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  type: 'HEART' | 'COIN';
}

// User provided 7 frames (00:00 to 00:06)
const FEED_ANIMATION_FRAMES = 7;
const FEED_FRAME_DURATION = 150; // ms

export const PetRender: React.FC = () => {
  const { gameState, performAction, latestAction } = useGame();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isBouncing, setIsBouncing] = useState(false);
  
  // Animation State
  const [isAnimatingFeed, setIsAnimatingFeed] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [imgError, setImgError] = useState(false); // Fallback to CSS animation if images missing

  const { stats, healthState, hasPooped } = gameState;

  // Listen for FEED action
  useEffect(() => {
    if (latestAction?.type === 'FEED' && gameState.petType === PetType.DOG) {
      setIsAnimatingFeed(true);
      setCurrentFrame(0);
      setImgError(false); // Try loading images again for new action
    }
  }, [latestAction, gameState.petType]);

  // Run Animation Loop
  useEffect(() => {
    if (isAnimatingFeed) {
      if (currentFrame < FEED_ANIMATION_FRAMES - 1) {
        const timer = setTimeout(() => {
          setCurrentFrame(prev => prev + 1);
        }, FEED_FRAME_DURATION);
        return () => clearTimeout(timer);
      } else {
        // Animation finished
        const timer = setTimeout(() => {
           setIsAnimatingFeed(false);
           setCurrentFrame(0);
        }, FEED_FRAME_DURATION);
        return () => clearTimeout(timer);
      }
    }
  }, [isAnimatingFeed, currentFrame]);


  // Visual States
  const isSad = stats.happiness < 40 || healthState !== HealthState.HEALTHY;
  const isSleeping = stats.energy < 20;
  const isDirty = stats.hygiene < 40;

  // --- CSS Fallback Animation Logic ---
  // Frame 0-1: Anticipation
  // Frame 2-3: Mouth Open, Food visible
  // Frame 4-5: Chewing (Mouth closed, wiggle)
  // Frame 6: Happy/Sparkle
  const isMouthOpen = imgError && isAnimatingFeed && (currentFrame === 2 || currentFrame === 3);
  const isChewing = imgError && isAnimatingFeed && (currentFrame === 4 || currentFrame === 5);
  const showFood = imgError && isAnimatingFeed && (currentFrame >= 2 && currentFrame <= 3);
  const showSparkles = imgError && isAnimatingFeed && currentFrame === 6;


  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (isAnimatingFeed) return; // Disable interaction during animation

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const newParticle: Particle = {
      id: Date.now(),
      x,
      y,
      type: 'HEART'
    };
    
    setParticles(prev => [...prev, newParticle]);
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 200);

    performAction('PET');
  };

  // Cleanup particles
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => {
        setParticles(prev => prev.slice(1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [particles]);

  // Pet CSS Classes
  const baseClasses = "relative w-48 h-48 transition-all duration-300";
  const animationClass = (isSleeping && !isAnimatingFeed) ? "" : "animate-float";
  const bounceClass = (isBouncing || isChewing) ? "scale-110" : "scale-100";
  
  // Dynamic Body Color (gets dull if sick/dirty)
  const bodyColor = isDirty || isSad ? 'bg-amber-700' : 'bg-amber-400';
  const earColor = isDirty ? 'bg-amber-900' : 'bg-amber-600';

  return (
    <div className="relative flex justify-center items-center h-64 w-full select-none" 
         onClick={handleInteraction}
         onTouchStart={handleInteraction}>
      
      {/* Poop Overlay - Only show if not animating */}
      {hasPooped && !isAnimatingFeed && (
        <div className="absolute bottom-0 right-10 z-10 animate-[poop-bounce_2s_infinite]">
          <span className="text-4xl">💩</span>
        </div>
      )}

      {/* Sickness Indicator - Only show if not animating */}
      {healthState !== HealthState.HEALTHY && !isAnimatingFeed && (
        <div className="absolute top-0 right-20 z-20 bg-white rounded-full p-2 shadow-lg animate-pulse">
           <AlertCircle className="text-red-500 w-6 h-6" />
        </div>
      )}

      {/* --- IMAGE BASED ANIMATION --- */}
      {isAnimatingFeed && !imgError ? (
        <div className={`${baseClasses} flex items-center justify-center`}>
           <img 
             key={currentFrame}
             src={`dog_feed_${currentFrame}.jpg`} 
             alt={`Feeding animation frame ${currentFrame}`}
             className="w-full h-full object-contain drop-shadow-2xl"
             onError={() => setImgError(true)}
           />
        </div>
      ) : (
        
        // --- CSS DOG RENDER (Default + Fallback) ---
        <div className={`${baseClasses} ${animationClass} ${bounceClass}`}>
          
          {/* Head */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-28 ${bodyColor} rounded-[2rem] z-10 shadow-lg border-4 border-amber-900 overflow-hidden`}>
             {/* Face Details */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                {/* Eyes */}
                <div className={`absolute top-8 left-6 w-4 h-4 bg-gray-900 rounded-full ${isChewing ? 'scale-y-50' : 'animate-blink'}`}>
                  {isSleeping && !isAnimatingFeed && <div className="absolute top-1/2 w-full h-1 bg-gray-900"></div>}
                </div>
                <div className={`absolute top-8 right-6 w-4 h-4 bg-gray-900 rounded-full ${isChewing ? 'scale-y-50' : 'animate-blink'}`}>
                   {isSleeping && !isAnimatingFeed && <div className="absolute top-1/2 w-full h-1 bg-gray-900"></div>}
                </div>

                {/* Nose */}
                <div className="absolute top-14 left-1/2 -translate-x-1/2 w-6 h-4 bg-gray-900 rounded-full"></div>

                {/* Mouth */}
                {isMouthOpen ? (
                   // Open Mouth (Feeding Fallback)
                   <div className="absolute top-16 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-800 rounded-full border-2 border-amber-900"></div>
                ) : isSad ? (
                   <div className="absolute top-20 left-1/2 -translate-x-1/2 w-8 h-4 border-t-4 border-gray-900 rounded-t-full"></div>
                ) : (
                   <div className="absolute top-16 left-1/2 -translate-x-1/2 w-8 h-4 border-b-4 border-gray-900 rounded-b-full"></div>
                )}
                
                {/* Cheeks */}
                <div className="absolute top-12 left-2 w-4 h-2 bg-pink-300 rounded-full opacity-50 blur-[2px]"></div>
                <div className="absolute top-12 right-2 w-4 h-2 bg-pink-300 rounded-full opacity-50 blur-[2px]"></div>
             </div>
          </div>

          {/* Fallback: Floating Food */}
          {showFood && (
             <div className="absolute top-16 left-1/2 translate-x-4 w-6 h-6 bg-amber-700 rounded-full border-2 border-amber-900 z-50 animate-[float_1s_infinite]"></div>
          )}

          {/* Fallback: Sparkles */}
          {showSparkles && (
             <div className="absolute -top-4 right-0 z-50 text-yellow-400 animate-pulse">
                <Sparkles size={32} />
             </div>
          )}

          {/* Ears */}
          <div className={`absolute -top-4 left-4 w-10 h-16 ${earColor} rounded-full border-4 border-amber-900 transform -rotate-12 z-0 origin-bottom transition-transform duration-500 ${isSad ? 'rotate-[0deg] top-0' : ''}`}></div>
          <div className={`absolute -top-4 right-4 w-10 h-16 ${earColor} rounded-full border-4 border-amber-900 transform rotate-12 z-0 origin-bottom transition-transform duration-500 ${isSad ? 'rotate-[0deg] top-0' : ''}`}></div>

          {/* Body */}
          <div className={`absolute top-24 left-1/2 -translate-x-1/2 w-20 h-24 ${bodyColor} rounded-[2rem] border-4 border-amber-900 z-0`}></div>

          {/* Paws */}
          <div className="absolute bottom-0 left-12 w-8 h-8 bg-white border-4 border-gray-200 rounded-full z-20"></div>
          <div className="absolute bottom-0 right-12 w-8 h-8 bg-white border-4 border-gray-200 rounded-full z-20"></div>

          {/* Tail */}
          {!isSleeping && !isSad && (
             <div className={`absolute bottom-4 right-8 w-16 h-4 ${bodyColor} border-4 border-amber-900 rounded-full origin-left animate-wiggle z-[-1]`}></div>
          )}

        </div>
      )}

      {/* Particles Overlay (Hearts) */}
      {particles.map(p => (
        <div key={p.id} 
             className="particle absolute text-red-500"
             style={{ left: p.x, top: p.y }}>
          <Heart fill="currentColor" size={24} />
        </div>
      ))}
      
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};