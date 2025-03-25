export interface DartPlayer {
  id: string;
  name: string;
  score: number;
  initialScore: number;
  darts: number;
  legs: number;
  sets: number;
  checkoutAttempts: number;
  checkoutSuccesses: number;
}

export interface GameSettings {
  numberOfSets: number;
  legsPerSet: number;
}

export interface GameState {
  players: DartPlayer[];
  currentPlayerIndex: number;
  gameSettings: GameSettings;
  isComplete: boolean;
  winner: string | null;
  currentLeg: number;
  currentSet: number;
}

export interface TurnResult {
  isBust: boolean;
  isCheckout: boolean;
  isCheckoutRange: boolean;
  remainingScore: number;
}

export type CheckoutPrompt = {
  type: 'success' | 'attempt';
  score: number;
  remainingScore: number;
  playerName: string;
  maxDarts: number;
};
