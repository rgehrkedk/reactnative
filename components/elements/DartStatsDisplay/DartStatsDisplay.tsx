import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useDartSlice } from '@/slices';
import { colors } from '@/theme';
import { DartPlayer } from '@/types';

const DartStatsDisplay: React.FC = () => {
  const { players, gameSettings, currentLeg, currentSet } = useDartSlice();

  const calculateThreeDartAverage = (player: DartPlayer) => {
    if (player.darts === 0) return 0;

    const throwsCount = player.darts / 3;
    const pointsScored = player.initialScore * (player.legs + 1) - player.score;

    return (pointsScored / throwsCount).toFixed(2);
  };

  const calculateCheckoutPercentage = (player: DartPlayer) => {
    if (player.checkoutAttempts === 0) return '0%';

    const percentage = (player.checkoutSuccesses / player.checkoutAttempts) * 100;
    return `${percentage.toFixed(1)}%`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Game Progress</Text>
      </View>

      <View style={styles.gameInfo}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Set</Text>
          <Text style={styles.infoValue}>
            {currentSet} of {gameSettings.numberOfSets}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Leg</Text>
          <Text style={styles.infoValue}>
            {currentLeg} of {gameSettings.legsPerSet}
          </Text>
        </View>
      </View>

      {players.map((player, index) => (
        <View key={player.id} style={styles.playerStatsCard}>
          <Text style={styles.playerName}>{player.name}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Sets</Text>
              <Text style={styles.statValue}>{player.sets}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Legs</Text>
              <Text style={styles.statValue}>{player.legs}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Score</Text>
              <Text style={styles.statValue}>{player.score}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Darts</Text>
              <Text style={styles.statValue}>{player.darts}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>3-Dart Avg</Text>
              <Text style={styles.statValue}>{calculateThreeDartAverage(player)}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Checkout %</Text>
              <Text style={styles.statValue}>{calculateCheckoutPercentage(player)}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Checkout Attempts</Text>
              <Text style={styles.statValue}>{player.checkoutAttempts}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Checkouts</Text>
              <Text style={styles.statValue}>{player.checkoutSuccesses}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  headerRow: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
  gameInfo: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: colors.lightGray,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: colors.darkGray,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.darkGray,
  },
  playerStatsCard: {
    margin: 8,
    padding: 12,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
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
});

export default DartStatsDisplay;
