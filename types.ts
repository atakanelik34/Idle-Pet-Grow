export enum PetType {
  DOG = 'DOG',
  CAT = 'CAT',
}

export enum HealthState {
  HEALTHY = 'HEALTHY',
  SICK_MILD = 'SICK_MILD',    // Reduced coins
  SICK_SERIOUS = 'SICK_SERIOUS' // No coins
}

export interface PetStats {
  hunger: number;    // 0-100 (100 is full)
  hygiene: number;   // 0-100 (100 is clean)
  energy: number;    // 0-100 (100 is rested)
  happiness: number; // 0-100 (100 is happy)
  health: number;    // 0-100 (hidden, drives HealthState)
}

export interface GameState {
  petName: string;
  petType: PetType;
  stats: PetStats;
  coins: number;
  careScore: number; // 0-100
  daysAlive: number;
  lastLogin: number;
  healthState: HealthState;
  inventory: {
    basicFood: number;
    premiumFood: number;
  };
  hasPooped: boolean; // Visual state for low hygiene
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'FOOD' | 'TOY' | 'VET' | 'COSMETIC';
  effect?: Partial<PetStats>;
  isPremium?: boolean; // Uses real money (simulated)
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  careScore: number;
  petType: PetType;
  badge: string;
}

export const INITIAL_GAME_STATE: GameState = {
  petName: 'Buddy',
  petType: PetType.DOG,
  stats: {
    hunger: 80,
    hygiene: 100,
    energy: 100,
    happiness: 90,
    health: 100,
  },
  coins: 50,
  careScore: 50,
  daysAlive: 1,
  lastLogin: Date.now(),
  healthState: HealthState.HEALTHY,
  inventory: {
    basicFood: 5,
    premiumFood: 1,
  },
  hasPooped: false,
};