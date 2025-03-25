import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/utils/store';
import { DartPlayer, GameSettings, GameState, TurnResult, CheckoutPrompt } from '@/types';

// Generate a random ID since uuid may not be working properly
const generateId = () => Math.random().toString(36).substring(2, 15);

const initialState: GameState = {
  players: [],
  currentPlayerIndex: 0,
  gameSettings: {
    numberOfSets: 3,
    legsPerSet: 3,
  },
  isComplete: false,
  winner: null,
  currentLeg: 1,
  currentSet: 1,
};

export const dartSlice = createSlice({
  name: 'dart',
  initialState,
  reducers: {
    setGameSettings: (state, action: PayloadAction<GameSettings>) => {
      state.gameSettings = action.payload;
    },
    initializePlayers: (state, action: PayloadAction<string[]>) => {
      state.players = action.payload.map(name => ({
        id: generateId(),
        name,
        score: 501,
        initialScore: 501,
        darts: 0,
        legs: 0,
        sets: 0,
        checkoutAttempts: 0,
        checkoutSuccesses: 0,
      }));
      state.currentPlayerIndex = 0;
      state.isComplete = false;
      state.winner = null;
      state.currentLeg = 1;
      state.currentSet = 1;
    },
    processTurn: (state, action: PayloadAction<{ score: number }>) => {
      const { score } = action.payload;
      console.log('[REDUX] Processing turn with score:', score);

      // Validate that we have players initialized
      if (
        !state.players ||
        state.players.length === 0 ||
        state.currentPlayerIndex >= state.players.length
      ) {
        console.log('[REDUX] No players initialized or invalid player index');
        return;
      }

      console.log('[REDUX] Current player index:', state.currentPlayerIndex);
      console.log('[REDUX] Players array before update:', JSON.stringify(state.players));
      
      const currentPlayer = state.players[state.currentPlayerIndex];
      console.log('[REDUX] Current player before update:', JSON.stringify(currentPlayer));

      // Validate score
      if (score < 0 || score > 180) {
        console.log('[REDUX] Invalid score:', score);
        return;
      }

      const remainingScore = currentPlayer.score - score;
      console.log('[REDUX] Remaining score:', remainingScore);

      // Check for bust (score greater than remaining or would leave 1)
      if (remainingScore < 0 || remainingScore === 1) {
        console.log('[REDUX] Bust detected');
        // Score reverts, only update darts thrown
        currentPlayer.darts += 3;
        // Move to next player
        state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
        console.log('[REDUX] Updated player after bust:', JSON.stringify(currentPlayer));
        return;
      }

      // Update player score
      currentPlayer.score = remainingScore;
      // Default to 3 darts per turn
      currentPlayer.darts += 3;

      console.log('[REDUX] Updated player after score change:', JSON.stringify(currentPlayer));

      // Move to next player if no checkout
      if (remainingScore > 0) {
        state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
        console.log('[REDUX] Moving to next player, index:', state.currentPlayerIndex);
      }
    },
    recordCheckout: (state, action: PayloadAction<{ dartsUsed: number }>) => {
      const { dartsUsed } = action.payload;

      // Validate that we have players initialized
      if (
        !state.players ||
        state.players.length === 0 ||
        state.currentPlayerIndex >= state.players.length
      ) {
        return;
      }

      const currentPlayer = state.players[state.currentPlayerIndex];

      // Adjust the darts count (remove 3 added by default and add actual darts used)
      currentPlayer.darts = currentPlayer.darts - 3 + dartsUsed;

      // Update checkout stats
      currentPlayer.checkoutAttempts += 1;
      currentPlayer.checkoutSuccesses += 1;

      // Award leg
      currentPlayer.legs += 1;

      // Check if set is complete
      if (currentPlayer.legs >= state.gameSettings.legsPerSet) {
        currentPlayer.sets += 1;
        state.players.forEach(player => {
          player.legs = 0;
        });
        state.currentSet += 1;

        // Check if match is complete
        if (currentPlayer.sets >= state.gameSettings.numberOfSets) {
          state.isComplete = true;
          state.winner = currentPlayer.id;
        } else {
          // Reset for next set
          state.currentLeg = 1;
          state.players.forEach(player => {
            player.score = 501;
          });
        }
      } else {
        // Move to next leg
        state.currentLeg += 1;

        // Reset scores for next leg
        state.players.forEach(player => {
          player.score = 501;
        });
      }

      // Move to next player
      state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
    },
    recordCheckoutAttempt: (state, action: PayloadAction<{ dartsUsed: number }>) => {
      const { dartsUsed } = action.payload;

      // Validate that we have players initialized
      if (
        !state.players ||
        state.players.length === 0 ||
        state.currentPlayerIndex >= state.players.length
      ) {
        return;
      }

      const currentPlayer = state.players[state.currentPlayerIndex];

      // Adjust the darts count (remove 3 added by default and add actual darts used)
      currentPlayer.darts = currentPlayer.darts - 3 + dartsUsed;

      // Update checkout stats
      currentPlayer.checkoutAttempts += 1;
    },
    resetGame: () => initialState,
  },
});

export const {
  setGameSettings,
  initializePlayers,
  processTurn,
  recordCheckout,
  recordCheckoutAttempt,
  resetGame,
} = dartSlice.actions;

export const useDartSlice = () => {
  const dispatch = useDispatch();
  const dartState = useSelector((state: RootState) => state.dart);

  const getCurrentPlayer = (): DartPlayer => {
    if (!dartState.players || dartState.players.length === 0) {
      // Return a placeholder player if no players exist yet
      return {
        id: 'placeholder',
        name: 'Player',
        score: 501,
        initialScore: 501,
        darts: 0,
        legs: 0,
        sets: 0,
        checkoutAttempts: 0,
        checkoutSuccesses: 0,
      };
    }
    return dartState.players[dartState.currentPlayerIndex];
  };

  const processPlayerTurn = (score: number): TurnResult => {
    const currentPlayer = getCurrentPlayer();
    const remainingScore = currentPlayer.score - score;

    // Check for bust condition
    const isBust = remainingScore < 0 || remainingScore === 1;

    // Check for checkout (score reaches exactly 0)
    const isCheckout = remainingScore === 0;

    // Check if in checkout range (≤170)
    const isCheckoutRange = currentPlayer.score <= 170;

    console.log('[HOOK] Processing player turn with score:', score);
    console.log('[HOOK] Current player state before dispatch:', JSON.stringify(currentPlayer));

    // Always process the turn - the reducer will handle bust conditions
    dispatch(processTurn({ score }));
    
    console.log('[HOOK] Turn processed, dispatched action');
    
    // Now fetch updated state after the dispatch
    const updatedPlayer = getCurrentPlayer();
    console.log('[HOOK] Updated player after dispatch:', JSON.stringify(updatedPlayer));

    return {
      isBust,
      isCheckout,
      isCheckoutRange,
      remainingScore: isBust ? currentPlayer.score : remainingScore,
    };
  };

  const getCheckoutPrompt = (score: number): CheckoutPrompt | null => {
    const currentPlayer = getCurrentPlayer();
    const remainingScore = currentPlayer.score;

    // No prompt for scores out of checkout range
    if (remainingScore > 170) {
      return null;
    }

    // Checkout success case
    if (remainingScore === score) {
      return {
        type: 'success',
        score,
        remainingScore: 0,
        playerName: currentPlayer.name,
        maxDarts: remainingScore === 170 ? 3 : 3, // 170 requires exactly 3 darts
      };
    }

    // Checkout attempt case
    if (remainingScore <= 170 && score < remainingScore) {
      // Calculate maximum possible darts for the attempt
      const maxDarts = remainingScore > 40 ? 2 : 1;

      return {
        type: 'attempt',
        score,
        remainingScore: remainingScore - score,
        playerName: currentPlayer.name,
        maxDarts,
      };
    }

    return null;
  };

  const completeCheckout = (dartsUsed: number) => {
    dispatch(recordCheckout({ dartsUsed }));
  };

  const recordAttempt = (dartsUsed: number) => {
    dispatch(recordCheckoutAttempt({ dartsUsed }));
  };

  return {
    dispatch,
    ...dartState,
    ...dartSlice.actions,
    getCurrentPlayer,
    processPlayerTurn,
    getCheckoutPrompt,
    completeCheckout,
    recordAttempt,
  };
};

export default dartSlice.reducer;
