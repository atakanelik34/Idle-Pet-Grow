import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { GameState, INITIAL_GAME_STATE, PetStats, HealthState } from '../types';
import { TICK_RATE, DECAY_RATES, THRESHOLDS, REWARDS } from '../constants';
import { calculateOfflineProgress } from '../services/gameService';

interface ActionEvent {
  type: 'FEED' | 'CLEAN' | 'PLAY' | 'VET' | 'PET';
  timestamp: number;
}

interface GameContextProps {
  gameState: GameState;
  performAction: (action: 'FEED' | 'CLEAN' | 'PLAY' | 'VET' | 'PET', payload?: any) => void;
  buyItem: (price: number, itemType: string) => boolean;
  offlineReport: { coins: number; seconds: number } | null;
  clearOfflineReport: () => void;
  latestAction: ActionEvent | null;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [offlineReport, setOfflineReport] = useState<{ coins: number; seconds: number } | null>(null);
  const [latestAction, setLatestAction] = useState<ActionEvent | null>(null);
  const saveInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load game on mount
  useEffect(() => {
    const saved = localStorage.getItem('petGrowSave');
    if (saved) {
      try {
        const parsed: GameState = JSON.parse(saved);
        const { newState, coinsEarned, timeAwaySeconds } = calculateOfflineProgress(parsed);
        setGameState(newState);
        if (timeAwaySeconds > 60) {
           setOfflineReport({ coins: coinsEarned, seconds: timeAwaySeconds });
        }
      } catch (e) {
        console.error("Save file corrupted, resetting", e);
        setGameState(INITIAL_GAME_STATE);
      }
    }
  }, []);

  // Save loop
  useEffect(() => {
    saveInterval.current = setInterval(() => {
      localStorage.setItem('petGrowSave', JSON.stringify({ ...gameState, lastLogin: Date.now() }));
    }, 5000); // Save every 5 seconds
    return () => {
      if (saveInterval.current) clearInterval(saveInterval.current);
    };
  }, [gameState]);

  // Main Game Loop
  useEffect(() => {
    const tick = setInterval(() => {
      setGameState(prev => {
        // 1. Decay Stats
        let newStats = { ...prev.stats };
        newStats.hunger = Math.max(0, newStats.hunger - DECAY_RATES.HUNGER);
        newStats.hygiene = Math.max(0, newStats.hygiene - DECAY_RATES.HYGIENE);
        newStats.energy = Math.max(0, newStats.energy - DECAY_RATES.ENERGY);
        newStats.happiness = Math.max(0, newStats.happiness - DECAY_RATES.HAPPINESS);

        // 2. Health Logic
        // Recover if everything is good (>50), decay if critical (<20)
        const isGood = newStats.hunger > 50 && newStats.hygiene > 50;
        const isCritical = newStats.hunger < THRESHOLDS.CRITICAL || newStats.hygiene < THRESHOLDS.CRITICAL;

        if (isCritical) {
           newStats.health = Math.max(0, newStats.health - DECAY_RATES.HEALTH_DAMAGE);
        } else if (isGood) {
           newStats.health = Math.min(100, newStats.health + DECAY_RATES.HEALTH_RECOVERY);
        }

        // 3. Determine States
        const isSick = newStats.health < THRESHOLDS.SICK_TRIGGER;
        const healthState = isSick ? HealthState.SICK_SERIOUS : (newStats.health < 60 ? HealthState.SICK_MILD : HealthState.HEALTHY);
        const hasPooped = newStats.hygiene < THRESHOLDS.POOP_TRIGGER;

        // 4. Generate Coins (Only if not sick)
        let coinGain = 0;
        if (healthState !== HealthState.SICK_SERIOUS) {
          const happinessMult = newStats.happiness / 100;
          coinGain = REWARDS.COIN_GENERATION_BASE * happinessMult;
        }

        return {
          ...prev,
          stats: newStats,
          healthState,
          hasPooped,
          coins: prev.coins + coinGain
        };
      });
    }, TICK_RATE);

    return () => clearInterval(tick);
  }, []);

  const performAction = useCallback((action: 'FEED' | 'CLEAN' | 'PLAY' | 'VET' | 'PET', payload?: any) => {
    // Set the latest action event for animations
    setLatestAction({ type: action, timestamp: Date.now() });

    setGameState(prev => {
      const stats = { ...prev.stats };
      let coins = prev.coins;
      let inventory = { ...prev.inventory };

      switch (action) {
        case 'FEED':
          if (inventory.basicFood > 0) {
            inventory.basicFood--;
            stats.hunger = Math.min(100, stats.hunger + 20);
            stats.happiness = Math.min(100, stats.happiness + 5);
          }
          break;
        case 'CLEAN':
          stats.hygiene = 100;
          stats.happiness = Math.min(100, stats.happiness + 10);
          break;
        case 'PLAY':
          stats.happiness = Math.min(100, stats.happiness + 15);
          stats.energy = Math.max(0, stats.energy - 10);
          break;
        case 'PET':
          stats.happiness = Math.min(100, stats.happiness + 2);
          coins += 1; // Small reward for interaction
          break;
        case 'VET':
          stats.health = 100;
          break;
      }

      // Calculate Care Score update (simplified)
      let newCareScore = Math.min(100, prev.careScore + 0.5);

      return {
        ...prev,
        stats,
        coins,
        inventory,
        careScore: newCareScore,
        hasPooped: stats.hygiene < THRESHOLDS.POOP_TRIGGER
      };
    });
  }, []);

  const buyItem = useCallback((price: number, itemType: string) => {
    let success = false;
    setGameState(prev => {
      if (prev.coins >= price) {
        success = true;
        const newInventory = { ...prev.inventory };
        if (itemType === 'food_basic') newInventory.basicFood++;
        
        return {
          ...prev,
          coins: prev.coins - price,
          inventory: newInventory
        };
      }
      return prev;
    });
    return success;
  }, []);

  const clearOfflineReport = () => setOfflineReport(null);

  return (
    <GameContext.Provider value={{ gameState, performAction, buyItem, offlineReport, clearOfflineReport, latestAction }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};