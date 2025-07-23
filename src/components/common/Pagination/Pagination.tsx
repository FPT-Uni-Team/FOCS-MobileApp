import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import Colors from '../../../utils/Colors';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<Props> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <View style={styles.container}>
      <IconButton
        icon="chevron-left"
        size={24}
        onPress={handlePrev}
        disabled={currentPage === 1}
        style={[
          styles.button,
          currentPage === 1 && styles.buttonDisabled
        ]}
        iconColor={currentPage === 1 ? Colors.textDisabled : Colors.primary}
      />
      
      <View style={styles.pageInfo}>
        <Text style={styles.pageNumber}>{currentPage}</Text>
        <Text style={styles.separator}>of</Text>
        <Text style={styles.totalPages}>{totalPages}</Text>
      </View>
      
      <IconButton
        icon="chevron-right"
        size={24}
        onPress={handleNext}
        disabled={currentPage === totalPages}
        style={[
          styles.button,
          currentPage === totalPages && styles.buttonDisabled
        ]}
        iconColor={currentPage === totalPages ? Colors.textDisabled : Colors.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 16,
  },
  button: {
    backgroundColor: Colors.backgroundPrimary,
    borderRadius: 8,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonDisabled: {
    backgroundColor: Colors.backgroundSecondary,
    elevation: 0,
  },
  pageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundPrimary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    gap: 6,
  },
  pageNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  separator: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  totalPages: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});

export default Pagination; 