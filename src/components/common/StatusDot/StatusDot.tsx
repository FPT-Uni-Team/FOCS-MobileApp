import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { TABLE_STATUS_COLORS } from '../../../utils/tableStatusColors';
import type { TableStatus } from '../../../type/table/table';

interface StatusDotProps {
  status?: TableStatus;
  color?: string;
  size?: number;
}

const StatusDot: React.FC<StatusDotProps> = ({ status, color, size = 12 }) => {
  const theme = useTheme();

  const dotColor = color || (status ? TABLE_STATUS_COLORS[status] : theme.colors.surfaceDisabled);

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