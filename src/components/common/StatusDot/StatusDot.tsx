import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

interface StatusDotProps {
  status: 'Available' | 'Occupied' | 'Reserved' | 'Cleaning' | 'OutOfService';
  size?: number;
}

const StatusDot: React.FC<StatusDotProps> = ({ status, size = 12 }) => {
  const theme = useTheme();

  const colors: Record<string, string> = {
    Available: '#2196F3',      
    Occupied: '#F44336',       
    Reserved: '#FF9800',       
    Cleaning: '#4CAF50',       
    OutOfService: '#F44336',   
  };

  return (
    <View
      style={[
        styles.dot,
        {
          backgroundColor: colors[status] || theme.colors.surfaceDisabled,
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