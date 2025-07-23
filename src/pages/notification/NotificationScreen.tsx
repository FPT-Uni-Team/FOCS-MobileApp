import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Divider, Appbar } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { markAllAsRead } from '../../store/slices/notification/notificationSlice';
import { StaffNotification } from '../../type/notification/notification';
import AppHeader from '../../components/common/AppHeader/AppHeader';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import Colors from '../../utils/Colors';
import { spacing, typography } from '../../utils/theme';

const NotificationScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notification.notifications);

  const renderNotification = ({ item }: { item: StaffNotification }) => (
    <View style={[styles.notificationItem, !item.isRead && styles.unread]}>
      <Text variant="titleMedium" style={styles.title}>{item.title}</Text>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
    </View>
  );

  const headerActions = notifications.length > 0 ? [
    <Appbar.Action 
      key="mark-all-read"
      icon="email-open" 
      onPress={() => dispatch(markAllAsRead())}
      iconColor={Colors.primary}
    />
  ] : [];

  const renderEmptyState = () => (
    <EmptyState 
      icon="bell-off" 
      title="No notifications" 
      subtitle="You're all caught up!"
    />
  );

  return (
    <View style={styles.container}>
      <AppHeader 
        title="Notifications" 
        actions={headerActions}
      />

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <Divider />}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  notificationItem: {
    padding: spacing.l,
    backgroundColor: Colors.backgroundPrimary,
    marginHorizontal: spacing.l,
    marginVertical: spacing.s,
    borderRadius: spacing.m,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  unread: {
    backgroundColor: Colors.chipBackground,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: Colors.textPrimary,
    marginBottom: spacing.s,
  },
  message: {
    fontSize: typography.sizes.base,
    color: Colors.textSecondary,
    lineHeight: typography.sizes.lg * typography.lineHeights.normal,
    marginBottom: spacing.s,
  },
  timestamp: {
    fontSize: typography.sizes.sm,
    color: Colors.textMuted,
    marginTop: spacing.xs,
  },
});

export default NotificationScreen; 