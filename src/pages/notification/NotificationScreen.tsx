import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Appbar, Text, Divider } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { markAllAsRead } from '../../store/slices/notification/notificationSlice';
import { StaffNotification } from '../../type/notification/notification';

interface NotificationScreenProps {
  onBackPress: () => void;
}

const NotificationScreen: React.FC<NotificationScreenProps> = ({ onBackPress }) => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notification.notifications);

  const renderNotification = ({ item }: { item: StaffNotification }) => (
    <View style={[styles.notificationItem, !item.isRead && styles.unread]}>
      <Text variant="titleMedium" style={styles.title}>{item.title}</Text>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={onBackPress} />
        <Appbar.Content title="Notifications" />
        <Appbar.Action icon="email-open" onPress={() => dispatch(markAllAsRead())} />
      </Appbar.Header>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <Divider />}
        ListEmptyComponent={<Text style={styles.emptyText}>No notifications</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  notificationItem: {
    padding: 16,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  unread: {
    backgroundColor: '#EEF2FF',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#6B7280',
  },
});

export default NotificationScreen; 