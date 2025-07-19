import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

interface StatusDotProps {
  status: 'ACTIVE' | 'INACTIVE' | 'OCCUPIED';
  size?: number;
}

const StatusDot: React.FC<StatusDotProps> = ({ status, size = 12 }) => {
  const theme = useTheme();

  const colors: Record<string, string> = {
    ACTIVE: '#4CAF50',
    INACTIVE: '#BDBDBD',
    OCCUPIED: '#FF9800',
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