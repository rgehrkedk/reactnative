import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import useColorScheme from '@/hooks/useColorScheme';
import { colors } from '@/theme';
import { useDartSlice } from '@/slices';

// Import Dart components
import DartGameSetup from '@/components/elements/DartGameSetup/DartGameSetup';
import DartScoreInput from '@/components/elements/DartScoreInput/DartScoreInput';
import DartCheckoutPrompt from '@/components/elements/DartCheckoutPrompt/DartCheckoutPrompt';
import DartMatchResult from '@/components/elements/DartMatchResult/DartMatchResult';

// Game stages
enum GameStage {
  SETUP,
  PLAYING,
  COMPLETE,
}

// We're using the CheckoutPrompt interface from types/dart.ts

export default function Home() {
  const { isDark } = useColorScheme();
  const { resetGame, players } = useDartSlice();

  // Game state
  const [gameStage, setGameStage] = useState<GameStage>(GameStage.SETUP);
  
  // Debug log players array
  React.useEffect(() => {
    console.log('Home component - current players array:', players);
  }, [players]);

  // Checkout prompt state
  const [showCheckoutPrompt, setShowCheckoutPrompt] = useState(false);
  const [checkoutScore, setCheckoutScore] = useState<number>(0);

  // This is now handled by the Redux store
  // through the useDartSlice hook

  // Game initialization is now handled by DartGameSetup component

  // Game initialization is now handled by DartGameSetup component

  // Score submission is now handled by DartScoreInput component

  // Checkout handling is now managed by DartCheckoutPrompt component

  // Game state is now managed by the Redux store
  // We just need to signal to go back to setup mode

  // Statistics calculations are now handled by the individual components

  const handleGameStart = () => {
    setGameStage(GameStage.PLAYING);
  };

  const handleCheckoutPrompt = (score: number) => {
    setCheckoutScore(score);
    setShowCheckoutPrompt(true);
  };

  const handleCloseCheckoutPrompt = () => {
    setShowCheckoutPrompt(false);
  };

  const handleNewGame = () => {
    resetGame();
    setGameStage(GameStage.SETUP);
  };

  // Render setup screen
  const renderSetupScreen = () => (
    <View style={styles.container}>
      <DartGameSetup onGameStart={handleGameStart} />
    </View>
  );

  // Render playing screen
  const renderPlayingScreen = () => {
    return (
      <View style={styles.container}>
        <DartScoreInput onCheckoutPrompt={handleCheckoutPrompt} />
      </View>
    );
  };

  // Render checkout prompt
  const renderCheckoutPrompt = () => {
    return (
      <DartCheckoutPrompt
        visible={showCheckoutPrompt}
        checkoutInfo={
          checkoutScore
            ? {
                type: 'success',
                score: checkoutScore,
                remainingScore: 0,
                playerName: '',
                maxDarts: 3,
              }
            : null
        }
        onClose={handleCloseCheckoutPrompt}
      />
    );
  };

  // Render game complete
  const renderGameComplete = () => {
    return (
      <View style={styles.container}>
        <DartMatchResult onNewGame={handleNewGame} />
      </View>
    );
  };

  // Render content based on game stage
  let content;
  switch (gameStage) {
    case GameStage.SETUP:
      content = renderSetupScreen();
      break;
    case GameStage.PLAYING:
      content = renderPlayingScreen();
      break;
    case GameStage.COMPLETE:
      content = renderGameComplete();
      break;
    default:
      content = renderSetupScreen();
  }

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        isDark ? { backgroundColor: colors.blackGray } : { backgroundColor: '#1A1A2E' },
      ]}>
      {content}
      {renderCheckoutPrompt()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
    margin: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2B6CB0', // Dark blue
    textAlign: 'center',
    marginBottom: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#BEE3F8', // Light blue border
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: colors.darkGray,
  },
  input: {
    borderWidth: 2, // Thicker border
    borderColor: '#A0AEC0', // Medium gray border
    borderRadius: 4,
    padding: 12, // Slightly more padding
    fontSize: 18, // Larger text
    color: '#2D3748', // Dark gray text
    backgroundColor: '#FFFFFF', // White background
  },
  button: {
    backgroundColor: '#2C5282', // Darker blue for better contrast
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 12, // Slightly more vertical spacing
    // Add shadow for better visibility
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#1A365D', // Border for better definition
  },
  buttonText: {
    color: '#FFFFFF', // Pure white for maximum contrast
    fontWeight: 'bold',
    fontSize: 20, // Larger text
  },
  orText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#4A5568', // Darker gray for better readability
  },
  quickStartButton: {
    backgroundColor: '#2F855A', // Darker green for better contrast
  },
  playerInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  playerName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2B6CB0', // Dark blue that's clear on white
    marginBottom: 12,
  },
  score: {
    fontSize: 48, // Even larger score
    fontWeight: 'bold',
    color: '#2D3748', // Dark gray
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  checkoutScore: {
    color: '#276749', // Darker green
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  checkoutText: {
    color: '#276749', // Darker green
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 8,
    padding: 6,
    backgroundColor: '#C6F6D5', // Light green background
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreInputContainer: {
    marginBottom: 20,
  },
  scoreInput: {
    borderWidth: 3, // Extra thick border for score input
    borderColor: '#2B6CB0', // Blue border
    borderRadius: 8,
    padding: 16,
    fontSize: 32, // Large font size
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    backgroundColor: '#EBF8FF', // Light blue background
    color: '#2D3748', // Dark text
  },
  scoreButton: {
    backgroundColor: '#2C5282', // Darker blue
    borderWidth: 1,
    borderColor: '#1A365D',
    paddingVertical: 16, // More padding for larger touch target
  },
  gameProgress: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#EBF8FF', // Light blue background
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#90CDF4', // Medium blue border
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C5282', // Dark blue text
    textShadowColor: 'rgba(0, 0, 0, 0.05)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2B6CB0', // Dark blue
    marginBottom: 16,
    textAlign: 'center',
    backgroundColor: '#EBF8FF', // Light blue background
    paddingVertical: 8,
    borderRadius: 4,
  },
  playerStats: {
    backgroundColor: '#F7FAFC', // Very light gray background
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#CBD5E0', // Medium gray border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  statsPlayerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C5282', // Dark blue
    marginBottom: 12,
    textAlign: 'center',
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E0', // Medium gray border
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#4A5568', // Darker gray
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748', // Very dark gray
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker overlay for better contrast
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  promptContainer: {
    width: '90%', // Slightly wider
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#2B6CB0', // Blue border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  promptTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B6CB0', // Dark blue
    textAlign: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0', // Light gray border
  },
  promptText: {
    fontSize: 18,
    color: '#2D3748', // Dark gray
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24, // Better line spacing
  },
  dartOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  dartOption: {
    width: 60, // Larger touch target
    height: 60, // Larger touch target
    borderRadius: 30,
    backgroundColor: '#E2E8F0', // Light gray
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A0AEC0', // Medium gray border
    margin: 8, // Add spacing between options
  },
  selectedDartOption: {
    backgroundColor: '#2B6CB0', // Dark blue background
    borderColor: '#1A365D', // Darker blue border
  },
  dartOptionText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2D3748', // Dark gray text
  },
  selectedDartOptionText: {
    color: '#FFFFFF', // White text for selected
  },
  promptButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#718096', // Medium-dark gray for visibility
    borderWidth: 1,
    borderColor: '#4A5568', // Darker outline
  },
  yesButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#2F855A', // Darker green for better contrast
    borderWidth: 1,
    borderColor: '#22543D', // Darker outline
  },
  disabledButton: {
    opacity: 0.6, // Slightly higher opacity so still visible
    backgroundColor: '#A0AEC0', // Lighter color when disabled
  },
  winnerContainer: {
    alignItems: 'center',
    backgroundColor: '#F0FFF4', // Light green background
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#48BB78', // Medium green border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  winnerLabel: {
    fontSize: 16,
    color: '#2D3748', // Dark gray
    marginBottom: 8,
  },
  winnerName: {
    fontSize: 32, // Larger winner name
    fontWeight: 'bold',
    color: '#276749', // Dark green
    textTransform: 'uppercase', // All caps for emphasis
    letterSpacing: 1, // Spread letters for emphasis
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  winnerStats: {
    borderWidth: 3, // Thicker border
    borderColor: '#48BB78', // Medium green
    backgroundColor: '#F0FFF4', // Light green background
  },
  winnerStatsName: {
    color: '#276749', // Dark green
    fontSize: 20, // Larger text
  },
  newGameButton: {
    backgroundColor: '#2F855A', // Darker green
    borderWidth: 2,
    borderColor: '#22543D', // Even darker green border
    paddingVertical: 16, // More padding for larger touch target
  },
});
