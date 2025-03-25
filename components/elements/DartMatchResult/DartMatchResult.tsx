import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDartSlice } from '@/slices';
import { colors } from '@/theme';

interface DartMatchResultProps {
  onNewGame: () => void;
}

const DartMatchResult: React.FC<DartMatchResultProps> = ({ onNewGame }) => {
  const { players, winner, resetGame } = useDartSlice();

  const winningPlayer = players.find(player => player.id === winner);

  if (!winningPlayer) return null;

  const handleNewGame = () => {
    resetGame();
    onNewGame();
  };

  const calculateThreeDartAverage = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player || player.darts === 0) return 0;

    const throwsCount = player.darts / 3;
    const pointsScored =
      player.initialScore * (player.legs + player.sets * players[0].legs + 1) - player.score;

    return (pointsScored / throwsCount).toFixed(2);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Match Complete!</Text>

      <View style={styles.winnerContainer}>
        <Text style={styles.winnerLabel}>WINNER</Text>
        <Text style={styles.winnerName}>{winningPlayer.name}</Text>
      </View>

      <View style={styles.statsContainer}>
        {players.map(player => (
          <View key={player.id} style={styles.playerStats}>
            <Text style={[styles.playerName, player.id === winner && styles.winningPlayerName]}>
              {player.name}
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Sets Won</Text>
                <Text style={styles.statValue}>{player.sets}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>3-Dart Avg</Text>
                <Text style={styles.statValue}>{calculateThreeDartAverage(player.id)}</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Checkout %</Text>
                <Text style={styles.statValue}>
                  {player.checkoutAttempts
                    ? ((player.checkoutSuccesses / player.checkoutAttempts) * 100).toFixed(1) + '%'
                    : '0%'}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Darts Thrown</Text>
                <Text style={styles.statValue}>{player.darts}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.newGameButton} onPress={handleNewGame} activeOpacity={0.8}>
        <Text style={styles.newGameButtonText}>New Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.primary,
    marginBottom: 16,
  },
  winnerContainer: {
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  winnerLabel: {
    fontSize: 14,
    color: colors.darkGray,
  },
  winnerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.success,
  },
  statsContainer: {
    marginBottom: 16,
  },
  playerStats: {
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkGray,
    marginBottom: 8,
    textAlign: 'center',
  },
  winningPlayerName: {
    color: colors.success,
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
    fontSize: 12,
    color: colors.gray,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.darkGray,
  },
  newGameButton: {
    backgroundColor: colors.success,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  newGameButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default DartMatchResult;
