import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useDartSlice } from '@/slices';
import { colors } from '@/theme';
import { DartPlayer } from '@/types';

interface DartScoreInputProps {
  onCheckoutPrompt: (score: number) => void;
}

interface PlayerCardProps {
  player: DartPlayer;
  isActive: boolean;
}

interface PlayerDetailCardProps {
  player: DartPlayer;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, isActive }) => {
  const calculateAverage = () => {
    if (!player || player.darts === 0) return '0.0';

    // Calculate across all legs
    const throwsCount = player.darts / 3;
    // Consider all completed legs plus current progress
    const legsPlayed = player.legs;
    const pointsScored = player.initialScore * legsPlayed + (player.initialScore - player.score);
    const average = pointsScored / throwsCount;

    return average.toFixed(1);
  };

  return (
    <View style={[styles.playerCard, isActive && styles.activePlayerCard]}>
      <View style={styles.playerCardHeader}>
        {isActive && <Text style={styles.activePlayerIcon}>▶</Text>}
        <Text
          style={[
            styles.playerCardName,
            isActive ? styles.activePlayerName : styles.inactivePlayerName,
          ]}>
          {player.name}
        </Text>
      </View>

      <Text
        style={[
          styles.playerCardScore,
          isActive ? styles.activePlayerScore : styles.inactivePlayerScore,
        ]}>
        {player.score}
      </Text>

      <View style={styles.playerCardStats}>
        <View style={styles.playerCardStatItem}>
          <Text style={styles.playerCardStatLabel}>Avg</Text>
          <Text style={styles.playerCardStatValue}>{calculateAverage()}</Text>
        </View>
        <View style={styles.playerCardStatItem}>
          <Text style={styles.playerCardStatLabel}>Set / Legs</Text>
          <Text style={styles.playerCardStatValue}>
            {player.sets}/{player.legs}
          </Text>
        </View>
      </View>
    </View>
  );
};

const PlayerDetailCard: React.FC<PlayerDetailCardProps> = ({ player }) => {
  const calculateLegAverage = () => {
    if (player.darts === 0) return '0.0';

    // Calculate for current leg only
    const throwsCount = player.darts / 3;
    const pointsScored = player.initialScore - player.score;
    const average = pointsScored / throwsCount;

    return average.toFixed(1);
  };

  const calculateGameAverage = () => {
    if (player.darts === 0) return '0.0';

    // Calculate across all legs
    const throwsCount = player.darts / 3;
    // Consider all completed legs plus current progress
    const legsPlayed = player.legs;
    const pointsScored = player.initialScore * legsPlayed + (player.initialScore - player.score);
    const average = pointsScored / throwsCount;

    return average.toFixed(1);
  };

  const calculateCheckoutPercentage = () => {
    if (player.checkoutAttempts === 0) return '0.0%';
    const percentage = (player.checkoutSuccesses / player.checkoutAttempts) * 100;
    return `${percentage.toFixed(1)}%`;
  };

  return (
    <View style={styles.playerDetailCard}>
      <View style={styles.playerDetailHeader}>
        <Text style={styles.playerDetailName}>{player.name}</Text>
        <Text style={styles.playerDetailScore}>{player.score}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Leg Avg</Text>
          <Text style={styles.statValue}>{calculateLegAverage()}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Game Avg</Text>
          <Text style={styles.statValue}>{calculateGameAverage()}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Checkout %</Text>
          <Text style={styles.statValue}>{calculateCheckoutPercentage()}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Darts</Text>
          <Text style={styles.statValue}>{player.darts || 0}</Text>
        </View>
      </View>
    </View>
  );
};

const DartScoreInput: React.FC<DartScoreInputProps> = ({ onCheckoutPrompt }) => {
  const {
    getCurrentPlayer,
    processPlayerTurn,
    getCheckoutPrompt,
    players,
    currentPlayerIndex,
    initializePlayers
  } = useDartSlice();
  const [scoreInput, setScoreInput] = useState('');
  // Add state to force re-rendering
  const [forceUpdate, setForceUpdate] = useState(false);

  // Initialize players if they don't exist yet
  React.useEffect(() => {
    if (!players || players.length === 0) {
      console.log('No players found, initializing default players');
      initializePlayers(['Player 1', 'Player 2']);
    } else {
      console.log('Players are already initialized:', JSON.stringify(players));
    }
  }, [players, initializePlayers]);

  const currentPlayer = getCurrentPlayer();

  // Calculate the other player index
  const otherPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;

  // Get the other player data directly using a function similar to getLatestPlayerData
  const getOtherPlayerData = () => {
    if (players && players.length > 1 && otherPlayerIndex < players.length) {
      console.log('Using real other player data from store:', JSON.stringify(players[otherPlayerIndex]));
      return {...players[otherPlayerIndex]};  // Return a new object to force re-render
    }
    
    // Fallback to placeholder
    return {
      id: 'placeholder2',
      name: 'Player 2',
      score: 501,
      initialScore: 501,
      darts: 0,
      legs: 0,
      sets: 0,
      checkoutAttempts: 0,
      checkoutSuccesses: 0,
    };
  };
  
  const otherPlayer = getOtherPlayerData();

  const handleScoreSubmit = () => {
    // Add console logs to debug the issue
    console.log('Submit score pressed');
    console.log('Current score input:', scoreInput);

    const score = parseInt(scoreInput, 10);
    console.log('Parsed score:', score);

    // Validate input
    if (isNaN(score) || score < 0 || score > 180) {
      console.log('Invalid score');
      Alert.alert('Invalid Score', 'Please enter a score between 0 and 180.');
      return;
    }

    console.log('Current player before turn:', currentPlayer);
    console.log('All players before turn:', JSON.stringify(players));

    try {
      // Process the turn
      const result = processPlayerTurn(score);
      console.log('Turn result:', result);

      // Clear the input
      setScoreInput('');

      // Force an immediate re-render to update the UI
      setForceUpdate(prev => !prev);

      // Log updated player data immediately and after a short delay to see if state updates
      console.log('Player data immediately after update:', getCurrentPlayer());
      console.log('Players array immediately after update:', JSON.stringify(players));
      
      // Use multiple timeouts to check state updates at different intervals
      setTimeout(() => {
        const updatedPlayer = getCurrentPlayer();
        console.log('Updated player data after 100ms:', updatedPlayer);
        console.log('Players array after 100ms:', JSON.stringify(players));
        // Force another update to ensure UI refreshes
        setForceUpdate(prev => !prev);
      }, 100);
      
      setTimeout(() => {
        const updatedPlayer = getCurrentPlayer();
        console.log('Updated player data after 500ms:', updatedPlayer);
        console.log('Players array after 500ms:', JSON.stringify(players));
        // Force another update to ensure UI refreshes
        setForceUpdate(prev => !prev);
      }, 500);

      // Check if bust
      if (result.isBust) {
        Alert.alert(
          'Bust!',
          `${currentPlayer.name} busted. Score reverts to ${currentPlayer.score}.`,
        );
        return;
      }

      // Check for checkout conditions
      const checkoutPrompt = getCheckoutPrompt(score);
      console.log('Checkout prompt:', checkoutPrompt);
      if (checkoutPrompt) {
        onCheckoutPrompt(score);
      }
    } catch (error) {
      console.error('Error processing turn:', error);
      Alert.alert('Error', 'Something went wrong when processing your score');
    }
  };

  const addNumber = (num: number) => {
    // Prevent adding more digits if we already have 3 digits
    if (scoreInput.length >= 3) return;

    const newValue = scoreInput + num.toString();

    // Validate that it doesn't exceed 180
    const numValue = parseInt(newValue, 10);
    if (numValue <= 180) {
      setScoreInput(newValue);
    }
  };

  const clearScore = () => {
    setScoreInput('');
  };

  const renderNumberButton = (num: number) => (
    <TouchableOpacity
      onPress={() => addNumber(num)}
      style={styles.numberButton}
      activeOpacity={0.7}>
      <Text style={styles.numberButtonText}>{num}</Text>
    </TouchableOpacity>
  );

  const renderQuickScoreButton = (num: number) => (
    <TouchableOpacity
      onPress={() => setScoreInput(num.toString())}
      style={styles.quickScoreButton}
      activeOpacity={0.7}>
      <Text style={styles.quickScoreButtonText}>{num}</Text>
    </TouchableOpacity>
  );

  // Get fresh player data for rendering
  const getLatestPlayerData = () => {
    // If we have players initialized in the store, use them directly instead of the placeholder
    if (players && players.length > 0 && currentPlayerIndex < players.length) {
      console.log('Using real player data from store:', JSON.stringify(players[currentPlayerIndex]));
      return {...players[currentPlayerIndex]};  // Return a new object to force re-render
    }
    
    // Fallback to getCurrentPlayer which may return a placeholder
    const latest = getCurrentPlayer();
    console.log('Latest player data for UI:', JSON.stringify(latest));
    return {...latest};  // Return a new object to force re-render
  };

  // The forceUpdate is used in the dependency for this console.log to ensure
  // it runs after each player update
  React.useEffect(() => {
    console.log('Component re-rendered, current players:', players);
    if (players && players.length > 0) {
      console.log('Active player score:', players[currentPlayerIndex]?.score);
    }
  }, [players, forceUpdate, currentPlayerIndex]);

  // Get fresh player data for each render cycle
  const activePlayerData = getLatestPlayerData();
  const inactivePlayerData = getOtherPlayerData();
  
  // Add a log to track component render cycles
  console.log('Rendering DartScoreInput with active player score:', activePlayerData.score);
  
  return (
    <View style={styles.container}>
      {/* Player Cards Row */}
      <View style={styles.playerCardsRow}>
        <PlayerCard
          player={activePlayerData}
          isActive={true}
          key={`player-${currentPlayerIndex}-${forceUpdate}-${activePlayerData.score}`}
        />
        <PlayerCard
          player={inactivePlayerData}
          isActive={false}
          key={`player-${otherPlayerIndex}-${forceUpdate}-${inactivePlayerData.score}`}
        />
      </View>

      {/* Active Player Detail Card */}
      <PlayerDetailCard
        player={activePlayerData}
        key={`detail-${currentPlayerIndex}-${forceUpdate}-${activePlayerData.score}`}
      />

      {/* Score Entry Area */}
      <View style={styles.scoreEntryArea}>
        <TouchableOpacity style={styles.actionButton} onPress={clearScore} activeOpacity={0.7}>
          <Text style={styles.actionButtonText}>↩</Text>
        </TouchableOpacity>

        <View style={styles.scoreDisplay}>
          <Text style={styles.scoreDisplayText}>{scoreInput ? scoreInput : 'Enter score'}</Text>
        </View>

        {/* This is a placeholder "next" button for now */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => console.log('Next button pressed')}
          activeOpacity={0.7}>
          <Text style={styles.actionButtonText}>⏭</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Score Buttons */}
      <View style={styles.quickScoreRow}>
        {renderQuickScoreButton(26)}
        {renderQuickScoreButton(41)}
        {renderQuickScoreButton(45)}
        {renderQuickScoreButton(60)}
        {renderQuickScoreButton(85)}
        {renderQuickScoreButton(100)}
      </View>

      {/* Number Pad */}
      <View style={styles.numberPad}>
        <View style={styles.numberRow}>
          {renderNumberButton(1)}
          {renderNumberButton(2)}
          {renderNumberButton(3)}
        </View>
        <View style={styles.numberRow}>
          {renderNumberButton(4)}
          {renderNumberButton(5)}
          {renderNumberButton(6)}
        </View>
        <View style={styles.numberRow}>
          {renderNumberButton(7)}
          {renderNumberButton(8)}
          {renderNumberButton(9)}
        </View>
        <View style={styles.numberRow}>
          <TouchableOpacity onPress={clearScore} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>🗑️</Text>
          </TouchableOpacity>
          {renderNumberButton(0)}
          <TouchableOpacity
            style={[styles.submitButton, !scoreInput && styles.disabledButton]}
            onPress={handleScoreSubmit}
            disabled={!scoreInput}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Debug button - only visible in development */}
      {__DEV__ && (
        <TouchableOpacity
          style={styles.debugButton}
          onPress={() => {
            // Force players initialization if array is empty
            if (!players || players.length === 0) {
              console.log('Debug: Initializing players');
              initializePlayers(['Player 1', 'Player 2']);
            }
            
            // Force a re-render and log current state
            setForceUpdate(prev => !prev);
            const latestPlayer = getCurrentPlayer();
            console.log('Debug: Force update triggered');
            console.log('Debug: Current player state:', latestPlayer);
            console.log('Debug: Players array:', players);

            // Show alert with current score
            Alert.alert(
              'Debug Info',
              `Current Player: ${latestPlayer.name}
Current Score: ${latestPlayer.score}
Number of Players: ${players?.length || 0}
Current Player Index: ${currentPlayerIndex}
Player from Redux: ${players && players.length > 0 ? JSON.stringify(players[currentPlayerIndex]) : 'None'}`,
            );
          }}>
          <Text style={styles.debugButtonText}>Debug Info</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E', // Dark background
    padding: 10,
    justifyContent: 'space-between', // Ensure content is spread out to fit screen height
  },
  // Player cards row styles
  playerCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  playerCard: {
    flex: 1,
    backgroundColor: '#2D2D3A', // Dark card background
    borderRadius: 16,
    padding: 8, // Reduced padding for more compact layout
    margin: 5,
  },
  activePlayerCard: {
    borderColor: colors.purple,
    borderWidth: 2,
  },
  playerCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activePlayerIcon: {
    color: colors.purple,
    fontSize: 14,
    marginRight: 4,
  },
  playerCardName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activePlayerName: {
    color: colors.purple,
  },
  inactivePlayerName: {
    color: colors.gray,
  },
  playerCardScore: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 4,
  },
  activePlayerScore: {
    color: colors.white,
  },
  inactivePlayerScore: {
    color: '#6D6D7D', // Muted gray for inactive
  },
  playerCardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  playerCardStatItem: {
    alignItems: 'center',
  },
  playerCardStatLabel: {
    fontSize: 12,
    color: colors.gray,
  },
  playerCardStatValue: {
    fontSize: 14,
    color: colors.white,
  },

  // Player detail card styles
  playerDetailCard: {
    backgroundColor: '#2D2D3A',
    borderRadius: 24,
    padding: 12, // Reduced padding
    marginBottom: 10, // Smaller margin
    borderColor: colors.purple,
    borderWidth: 2,
  },
  playerDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8, // Reduced margin
  },
  playerDetailName: {
    fontSize: 20, // Reduced font size
    fontWeight: 'bold',
    color: colors.white,
  },
  playerDetailScore: {
    fontSize: 36, // Reduced font size
    fontWeight: 'bold',
    color: colors.purple,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: '#22222E', // Darker background for stats
    borderRadius: 12,
    padding: 8, // Reduced padding
    alignItems: 'center',
    width: '22%',
  },
  statLabel: {
    color: colors.gray,
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Score entry area
  scoreEntryArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionButton: {
    width: 40, // Smaller button
    height: 40, // Smaller button
    borderRadius: 20,
    backgroundColor: '#22222E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 20,
  },
  scoreDisplay: {
    flex: 1,
    backgroundColor: '#22222E',
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  scoreDisplayText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: 'bold',
  },

  // Quick score buttons
  quickScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quickScoreButton: {
    width: 40, // Smaller button
    height: 40, // Smaller button
    borderRadius: 20,
    backgroundColor: '#22222E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickScoreButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Number pad
  numberPad: {
    marginBottom: 8, // Reduced margin
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8, // Reduced margin
  },
  numberButton: {
    flex: 1,
    backgroundColor: '#22222E',
    paddingVertical: 12, // Reduced padding
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  numberButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#7A282E', // Reddish color for delete
    paddingVertical: 12, // Reduced padding
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 24,
    color: colors.white,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#28785B', // Greenish color for submit
    paddingVertical: 12, // Reduced padding
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  debugButton: {
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
    opacity: 0.7,
  },
  debugButtonText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default DartScoreInput;
