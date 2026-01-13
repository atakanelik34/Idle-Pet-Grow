import { ShopItem } from './types';

// Game Loop Tick Rate (ms)
export const TICK_RATE = 1000;

// Stats Decay per tick (1 second)
// Real-time balancing: Needs to be slow enough to be idle, fast enough to require daily care.
// Assuming user checks 2-3 times a day.
export const DECAY_RATES = {
  HUNGER: 0.05,  // Approx 5% per 15 mins roughly if active, slower if idle
  HYGIENE: 0.03,
  ENERGY: 0.02,
  HAPPINESS: 0.04,
  HEALTH_RECOVERY: 0.1, // Recovers slowly if needs are met
  HEALTH_DAMAGE: 0.2,   // Damages if needs are critical
};

export const THRESHOLDS = {
  CRITICAL: 20, // Stats turn red
  POOP_TRIGGER: 30, // Hygiene below this triggers visuals
  SICK_TRIGGER: 40, // Health below this makes pet sick
};

export const REWARDS = {
  COIN_GENERATION_BASE: 0.5, // Coins per tick
  INTERACTION_BONUS: 2, // Coins per tap/pet
  CARE_ACTION: 10, // XP/Score per care action
};

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'food_basic',
    name: 'Kibble',
    description: 'Basic nutrition. +20 Hunger.',
    price: 10,
    type: 'FOOD',
    effect: { hunger: 20 },
  },
  {
    id: 'food_premium',
    name: 'Gourmet Steak',
    description: 'Delicious! +40 Hunger, +10 Happy.',
    price: 50,
    type: 'FOOD',
    effect: { hunger: 40, happiness: 10 },
  },
  {
    id: 'vet_visit',
    name: 'Vet Checkup',
    description: 'Cures sickness and restores Health.',
    price: 200,
    type: 'VET',
    effect: { health: 100 },
  },
  {
    id: 'toy_ball',
    name: 'Tennis Ball',
    description: 'Great for energy and happiness.',
    price: 30,
    type: 'TOY',
    effect: { happiness: 15, energy: -5 },
  }
];