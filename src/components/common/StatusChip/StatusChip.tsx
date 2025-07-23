import React from 'react';
import { StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import Colors from '../../../utils/Colors';

interface StatusChipProps {
  label: string;
  isPositive: boolean;
  compact?: boolean;
  style?: any;
}

const StatusChip: React.FC<StatusChipProps> = ({ 
  label, 
  isPositive, 
  compact = true, 
  style 
}) => {
  const backgroundColor = isPositive ? Colors.available : Colors.unavailable;

  return (
    <Chip
      style={[styles.chip, { backgroundColor }, style]}
      textStyle={styles.text}
      compact={compact}
    >
      {label}
    </Chip>
  );
};

const styles = StyleSheet.create({
  chip: {
    height: 28,
    borderRadius: 14,
  },
  text: {
    color: Colors.backgroundPrimary,
    fontSize: 11,
    fontWeight: '600',
  },
});

export default StatusChip; 