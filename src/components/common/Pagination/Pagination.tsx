import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from '../Icon/Icon';
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
      <TouchableOpacity
        onPress={handlePrev}
        disabled={currentPage === 1}
        style={[
          styles.button,
          currentPage === 1 && styles.buttonDisabled
        ]}
      >
        <Icon 
          name="chevron-left" 
          size={24} 
          color={currentPage === 1 ? Colors.textDisabled : Colors.primary} 
        />
      </TouchableOpacity>
      
      <View style={styles.pageInfo}>
        <Text style={styles.pageNumber}>{currentPage}</Text>
        <Text style={styles.separator}>of</Text>
        <Text style={styles.totalPages}>{totalPages}</Text>
      </View>
      
      <TouchableOpacity
        onPress={handleNext}
        disabled={currentPage === totalPages}
        style={[
          styles.button,
          currentPage === totalPages && styles.buttonDisabled
        ]}
      >
        <Icon 
          name="chevron-right" 
          size={24} 
          color={currentPage === totalPages ? Colors.textDisabled : Colors.primary} 
        />
      </TouchableOpacity>
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