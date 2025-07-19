import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Badge } from 'react-native-paper';
import { useAppSelector } from '../../../hooks/redux';

interface NotificationBellProps {
  onPress: () => void;
  size?: number;
  color?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ onPress, size = 24, color = 'black' }) => {
  const unreadCount = useAppSelector((state) => state.notification.unreadCount);

  return (
    <View>
      <IconButton icon="bell" size={size} iconColor={color} onPress={onPress} />
      {unreadCount > 0 && (
        <Badge style={styles.badge} size={16}>
          {unreadCount}
        </Badge>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
});

export default NotificationBell; 