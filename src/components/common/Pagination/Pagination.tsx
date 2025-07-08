import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';

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
      <Button
        icon="chevron-left"
        mode="outlined"
        onPress={handlePrev}
        disabled={currentPage === 1}
        style={styles.button}
      >
        {''}
      </Button>
      <Text style={styles.pageText}>
        {currentPage} / {totalPages}
      </Text>
      <Button
        icon="chevron-right"
        mode="outlined"
        onPress={handleNext}
        disabled={currentPage === totalPages}
        style={styles.button}
      >
        {''}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
    gap: 24,
  },
  pageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  button: {
    
  }
});

export default Pagination; 