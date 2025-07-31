import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Badge } from 'react-native-paper';
import Icon from '../../common/Icon/Icon';
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
      <TouchableOpacity onPress={onPress} style={styles.iconButton}>
        <Icon name="bell" size={size} color={color} />
      </TouchableOpacity>
      {unreadCount > 0 && (
        <Badge style={styles.badge} size={16}>
          {unreadCount}
        </Badge>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
});

export default NotificationBell; 