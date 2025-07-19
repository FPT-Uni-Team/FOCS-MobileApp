import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, IconButton, Chip } from 'react-native-paper';
import useNotifications from '../../../hooks/useNotifications';
import type { StaffNotification } from '../../../type/notification/notification';

interface NotificationItemProps {
  notification: StaffNotification;
  onPress: (notification: StaffNotification) => void;
  onDismiss: (id: string) => void;
}

const getTypeStyle = (type: StaffNotification['type']) => {
  switch (type) {
    case 'NEW_ORDER':
      return { container: { backgroundColor: '#FEF3C7' }, iconColor: '#D97706' };
    case 'CUSTOMER_REQUEST':
      return { container: { backgroundColor: '#FFE4E6' }, iconColor: '#E11D48' };
    case 'TABLE_STATUS':
      return { container: { backgroundColor: '#FEE2E2' }, iconColor: '#DC2626' };
    case 'KITCHEN_READY':
      return { container: { backgroundColor: '#DBEAFE' }, iconColor: '#2563EB' };
    case 'PAYMENT':
      return { container: { backgroundColor: '#D1FAE5' }, iconColor: '#059669' };
    default:
      return { container: { backgroundColor: '#E5E7EB' }, iconColor: '#4B5563' };
  }
};

const getPriorityStyle = (priority: StaffNotification['priority']) => {
  switch (priority) {
    case 'URGENT':
      return { chip: styles.chipUrgent, text: styles.chipTextWhite };
    case 'HIGH':
      return { chip: styles.chipHigh, text: styles.chipTextWhite };
    case 'MEDIUM':
      return { chip: styles.chipMedium, text: styles.chipTextDark };
    case 'LOW':
      return { chip: styles.chipLow, text: styles.chipTextWhite };
    default:
      return { chip: {}, text: {} };
  }
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onPress,
  onDismiss,
}) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeIcon = (type: StaffNotification['type']) => {
    switch (type) {
      case 'NEW_ORDER':
        return 'food';
      case 'CUSTOMER_REQUEST':
        return 'hand-back-left';
      case 'KITCHEN_READY':
        return 'chef-hat';
      case 'TABLE_STATUS':
        return 'table-furniture';
      case 'PAYMENT':
        return 'cash';
      default:
        return 'bell';
    }
  };

  const typeStyle = getTypeStyle(notification.type);
  const priorityStyle = getPriorityStyle(notification.priority);

  return (
    <TouchableOpacity
      onPress={() => onPress(notification)}
      style={[styles.item, !notification.isRead && styles.unread]}
    >
      <Card style={styles.card}>
        <View style={styles.content}>
          <View style={styles.notificationHeader}>
            <View style={styles.leftSection}>
              <View style={[styles.iconContainer, typeStyle.container]}>
                <IconButton
                  icon={getTypeIcon(notification.type)}
                  size={20}
                  iconColor={typeStyle.iconColor}
                />
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.title}>{notification.title}</Text>
                <Text style={styles.tableNumber}>Bàn {notification.tableNumber}</Text>
              </View>
            </View>
            <View style={styles.rightSection}>
              <Text style={styles.time}>{formatTime(notification.timestamp)}</Text>
              <TouchableOpacity
                onPress={() => onDismiss(notification.id)}
                style={styles.dismissButton}
              >
                <IconButton icon="close" size={16} iconColor="#999" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.message}>{notification.message}</Text>

          <View style={styles.footer}>
            <Chip
              style={[styles.priorityChip, priorityStyle.chip]}
              textStyle={priorityStyle.text}
            >
              {notification.priority}
            </Chip>
            {!notification.isRead && <View style={styles.unreadDot} />}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const NotificationList: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    removeNotificationById,
    markAllNotificationsAsRead
  } = useNotifications();

  const handleNotificationPress = (notification: StaffNotification) => {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id);
    }
    
    console.log('Notification pressed:', notification);
  };

  const handleDismiss = (id: string) => {
    removeNotificationById(id);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <IconButton icon="bell-off" size={48} iconColor="#ccc" />
      <Text style={styles.emptyText}>Không có thông báo</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thông báo</Text>
        {notifications.length > 0 && (
          <TouchableOpacity
            onPress={markAllNotificationsAsRead}
            style={styles.markAllButton}
          >
            <Text style={styles.markAllText}>Đánh dấu tất cả đã đọc</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MemoizedNotificationItem
            notification={item}
            onPress={handleNotificationPress}
            onDismiss={handleDismiss}
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const MemoizedNotificationItem = React.memo(NotificationItem);

export default React.memo(NotificationList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#007AFF',
    borderRadius: 16,
  },
  markAllText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  item: {
    marginBottom: 12,
  },
  unread: {
    backgroundColor: 'transparent',
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#1F2937',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  content: {
    padding: 16,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  tableNumber: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  dismissButton: {
    margin: -8, // Reduce touch area visually
    padding: 0,
  },
  message: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 12,
    marginLeft: 56, // Indent message to align with title
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 56, // Indent footer to align with title
  },
  priorityChip: {
    height: 22,
    justifyContent: 'center',
    paddingHorizontal: 0,
    borderWidth: 0,
    borderRadius: 6,
  },
  chipTextWhite: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginHorizontal: 8,
    lineHeight: 12,
  },
  chipTextDark: {
    color: '#422006',
    fontSize: 10,
    fontWeight: 'bold',
    marginHorizontal: 8,
    lineHeight: 12,
  },
  chipUrgent: {
    backgroundColor: '#EF4444',
  },
  chipHigh: {
    backgroundColor: '#F97316',
  },
  chipMedium: {
    backgroundColor: '#FBBF24',
  },
  chipLow: {
    backgroundColor: '#6B7280',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
}); 