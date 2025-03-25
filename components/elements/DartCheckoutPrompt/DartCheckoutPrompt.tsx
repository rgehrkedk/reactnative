import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, TouchableOpacity } from 'react-native';
import { useDartSlice } from '@/slices';
import { colors } from '@/theme';
import { CheckoutPrompt } from '@/types';

interface DartCheckoutPromptProps {
  visible: boolean;
  checkoutInfo: CheckoutPrompt | null;
  onClose: () => void;
}

const DartCheckoutPrompt: React.FC<DartCheckoutPromptProps> = ({
  visible,
  checkoutInfo,
  onClose,
}) => {
  const { completeCheckout, recordAttempt } = useDartSlice();
  const [selectedDarts, setSelectedDarts] = useState<number | null>(null);

  if (!checkoutInfo) return null;

  const handleSubmit = () => {
    if (selectedDarts === null) return;

    if (checkoutInfo.type === 'success') {
      completeCheckout(selectedDarts);
    } else {
      recordAttempt(selectedDarts);
    }

    setSelectedDarts(null);
    onClose();
  };

  const renderDartOptions = () => {
    const options: number[] = [];

    // Create array of available dart options based on max darts
    for (let i = 1; i <= checkoutInfo.maxDarts; i++) {
      options.push(i);
    }

    return options.map(dartCount => (
      <Pressable
        key={dartCount}
        style={[styles.dartOption, selectedDarts === dartCount && styles.dartOptionSelected]}
        onPress={() => setSelectedDarts(dartCount)}>
        <Text
          style={[
            styles.dartOptionText,
            selectedDarts === dartCount && styles.dartOptionTextSelected,
          ]}>
          {dartCount}
        </Text>
      </Pressable>
    ));
  };

  const promptText =
    checkoutInfo.type === 'success'
      ? `You checked out with ${checkoutInfo.score}. How many darts did you use?`
      : `You scored ${checkoutInfo.score} from ${checkoutInfo.score + checkoutInfo.remainingScore} — did you attempt checkout? If yes, how many darts did you throw?`;

  const headerText = checkoutInfo.type === 'success' ? 'Checkout Success!' : 'Checkout Attempt?';

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.headerText}>{headerText}</Text>
          <Text style={styles.promptText}>{promptText}</Text>

          <View style={styles.dartOptionsContainer}>{renderDartOptions()}</View>

          <View style={styles.buttonContainer}>
            {checkoutInfo.type === 'attempt' && (
              <TouchableOpacity style={styles.noButton} onPress={onClose} activeOpacity={0.8}>
                <Text style={styles.buttonText}>No Attempt</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.submitButton, selectedDarts === null && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={selectedDarts === null}
              activeOpacity={0.8}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    width: '80%',
    maxWidth: 400,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: colors.primary,
  },
  promptText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    color: colors.darkGray,
  },
  dartOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  dartOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dartOptionSelected: {
    backgroundColor: colors.primary,
  },
  dartOptionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.darkGray,
  },
  dartOptionTextSelected: {
    color: colors.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: colors.lightGray,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DartCheckoutPrompt;
