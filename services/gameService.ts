import { GameState, HealthState } from '../types';
import { DECAY_RATES, REWARDS, THRESHOLDS } from '../constants';

export const calculateOfflineProgress = (prevState: GameState): { newState: GameState; coinsEarned: number; timeAwaySeconds: number } => {
  const now = Date.now();
  const timeAwaySeconds = (now - prevState.lastLogin) / 1000;
  
  // Cap offline time to 24 hours to prevent total death
  const effectiveTime = Math.min(timeAwaySeconds, 86400);

  // Calculate decay based on time away
  // We apply a "sleep" factor - decay is 50% slower when offline
  const offlineFactor = 0.5;
  
  const hungerLoss = effectiveTime * DECAY_RATES.HUNGER * offlineFactor;
  const hygieneLoss = effectiveTime * DECAY_RATES.HYGIENE * offlineFactor;
  const energyLoss = effectiveTime * DECAY_RATES.ENERGY * offlineFactor;
  const happinessLoss = effectiveTime * DECAY_RATES.HAPPINESS * offlineFactor;

  let newStats = { ...prevState.stats };
  
  newStats.hunger = Math.max(0, newStats.hunger - hungerLoss);
  newStats.hygiene = Math.max(0, newStats.hygiene - hygieneLoss);
  newStats.energy = Math.max(0, newStats.energy - energyLoss);
  newStats.happiness = Math.max(0, newStats.happiness - happinessLoss);

  // Calculate Health impact based on new stats
  if (newStats.hunger < THRESHOLDS.CRITICAL || newStats.hygiene < THRESHOLDS.CRITICAL) {
    newStats.health = Math.max(0, newStats.health - (effectiveTime * DECAY_RATES.HEALTH_DAMAGE * 0.1));
  } else {
     // Recover health slightly if offline and well
    newStats.health = Math.min(100, newStats.health + (effectiveTime * DECAY_RATES.HEALTH_RECOVERY * 0.1));
  }

  // Determine Coins Earned
  // If sick, 0 coins. If unhappy, 50%.
  let coinRate = REWARDS.COIN_GENERATION_BASE;
  if (newStats.health < THRESHOLDS.SICK_TRIGGER) {
    coinRate = 0;
  } else if (newStats.happiness < 40) {
    coinRate = coinRate * 0.5;
  }

  const coinsEarned = Math.floor(effectiveTime * coinRate * 0.1); // Reduced rate for offline balance

  const newState: GameState = {
    ...prevState,
    stats: newStats,
    coins: prevState.coins + coinsEarned,
    lastLogin: now,
    hasPooped: newStats.hygiene < THRESHOLDS.POOP_TRIGGER,
    healthState: newStats.health < THRESHOLDS.SICK_TRIGGER ? HealthState.SICK_SERIOUS : (newStats.health < 60 ? HealthState.SICK_MILD : HealthState.HEALTHY)
  };

  return { newState, coinsEarned, timeAwaySeconds };
};