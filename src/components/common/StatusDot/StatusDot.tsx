import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

interface StatusDotProps {
  status?: 'Available' | 'Occupied' | 'Reserved' | 'Cleaning' | 'OutOfService';
  color?: string;
  size?: number;
}

const StatusDot: React.FC<StatusDotProps> = ({ status, color, size = 12 }) => {
  const theme = useTheme();

  const colors: Record<string, string> = {
    Available: '#2196F3',      
    Occupied: '#F44336',       
    Reserved: '#FF9800',       
    Cleaning: '#4CAF50',       
    OutOfService: '#F44336',   
  };

  const dotColor = color || (status ? colors[status] : theme.colors.surfaceDisabled);

  return (
    <View
      style={[
        styles.dot,
        {
          backgroundColor: dotColor,
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  dot: {
    alignSelf: 'flex-start',
  },
});

export default StatusDot; 