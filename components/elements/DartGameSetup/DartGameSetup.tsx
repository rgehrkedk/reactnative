import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { useDartSlice } from '@/slices';
import { colors } from '@/theme';
import { GameSettings } from '@/types';

interface DartGameSetupProps {
  onGameStart: () => void;
}

const DartGameSetup: React.FC<DartGameSetupProps> = ({ onGameStart }) => {
  const { setGameSettings, initializePlayers, resetGame } = useDartSlice();

  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');
  const [numberOfSets, setNumberOfSets] = useState('3');
  const [legsPerSet, setLegsPerSet] = useState('3');

  const handleStartGame = () => {
    console.log('Start Game button pressed');

    // Validate inputs
    if (!player1Name.trim() || !player2Name.trim()) {
      console.log('Player names empty');
      return; // Don't start if player names are empty
    }

    const setsValue = parseInt(numberOfSets, 10);
    const legsValue = parseInt(legsPerSet, 10);

    if (isNaN(setsValue) || isNaN(legsValue) || setsValue < 1 || legsValue < 1) {
      console.log('Invalid set/leg values');
      return; // Don't start if values are invalid
    }

    // Set game settings and initialize players
    const gameSettings: GameSettings = {
      numberOfSets: setsValue,
      legsPerSet: legsValue,
    };

    console.log('Setting game settings:', gameSettings);
    setGameSettings(gameSettings);

    // Reset game first to ensure clean state
    console.log('Resetting game state');
    resetGame();
    
    console.log('Initializing players:', [player1Name, player2Name]);
    initializePlayers([player1Name, player2Name]);

    // Wait for state to be properly updated before proceeding
    setTimeout(() => {
      console.log('Calling onGameStart callback after player initialization');
      onGameStart();
    }, 100);
  };

  // Helper function to create number pickers
  const renderPicker = (
    value: string,
    setValue: (value: string) => void,
    min: number = 1,
    max: number = 9,
  ) => {
    const currentValue = parseInt(value, 10);

    const increment = () => {
      if (currentValue < max) {
        setValue((currentValue + 1).toString());
      }
    };

    const decrement = () => {
      if (currentValue > min) {
        setValue((currentValue - 1).toString());
      }
    };

    return (
      <View style={styles.pickerContainer}>
        <Pressable onPress={decrement} style={styles.pickerButton}>
          <Text style={styles.pickerButtonText}>-</Text>
        </Pressable>
        <Text style={styles.pickerValue}>{value}</Text>
        <Pressable onPress={increment} style={styles.pickerButton}>
          <Text style={styles.pickerButtonText}>+</Text>
        </Pressable>
      </View>
    );
  };

  // Quick start with default values
  const handleQuickStart = () => {
    console.log('Quick Start Game button pressed');
    
    // Reset the game first to clear any previous state
    console.log('Resetting game state for quick start');
    resetGame();

    // Use default settings
    const gameSettings: GameSettings = {
      numberOfSets: 3,
      legsPerSet: 3,
    };

    console.log('Setting game settings:', gameSettings);
    setGameSettings(gameSettings);

    console.log('Initializing players with default names');
    initializePlayers(['Player 1', 'Player 2']);

    // Wait for state to be properly updated before proceeding
    setTimeout(() => {
      console.log('Calling onGameStart callback after quick start initialization');
      onGameStart();
    }, 100);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dart Game Setup - 501</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Player 1 Name</Text>
        <TextInput
          style={styles.input}
          value={player1Name}
          onChangeText={setPlayer1Name}
          placeholder="Enter Player 1 Name"
          placeholderTextColor={colors.gray}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Player 2 Name</Text>
        <TextInput
          style={styles.input}
          value={player2Name}
          onChangeText={setPlayer2Name}
          placeholder="Enter Player 2 Name"
          placeholderTextColor={colors.gray}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Number of Sets</Text>
        {renderPicker(numberOfSets, setNumberOfSets, 1, 9)}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Legs per Set</Text>
        {renderPicker(legsPerSet, setLegsPerSet, 1, 9)}
      </View>

      <TouchableOpacity onPress={handleStartGame} style={styles.startButton} activeOpacity={0.8}>
        <Text style={styles.startButtonText}>Start Game</Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity
        onPress={handleQuickStart}
        style={[styles.startButton, styles.quickStartButton]}
        activeOpacity={0.8}>
        <Text style={styles.startButtonText}>Quick Start Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: colors.primary,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: colors.darkGray,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    color: colors.darkGray,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  pickerButton: {
    backgroundColor: colors.lightGray,
    padding: 8,
    width: 40,
    alignItems: 'center',
  },
  pickerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkGray,
  },
  pickerValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkGray,
  },
  startButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  startButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.lightGray,
  },
  dividerText: {
    marginHorizontal: 10,
    color: colors.gray,
    fontWeight: 'bold',
  },
  quickStartButton: {
    backgroundColor: colors.purple,
  },
});

export default DartGameSetup;
