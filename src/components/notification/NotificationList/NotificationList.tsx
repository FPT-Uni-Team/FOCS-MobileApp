import React, { memo} from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, Chip } from 'react-native-paper';
import Icon from '../../common/Icon/Icon';
import { StaffNotification } from '../../../type/notification/notification';
import useNotifications from '../../../hooks/useNotifications';
import { getTypeStyle, getPriorityStyle, getTypeIcon, formatTime } from '../../../utils/notification';

interface NotificationItemProps {
  notification: StaffNotification;
  onPress: (notification: StaffNotification) => void;
  onDismiss: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onPress,
  onDismiss,
}) => {
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
                <Icon
                  name={getTypeIcon(notification.type)}
                  size={20}
                  color={typeStyle.iconColor}
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
                <Icon name="close" size={16} color="#999" />
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
  };

  const handleDismiss = (id: string) => {
    removeNotificationById(id);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="bell-off" size={48} color="#ccc" />
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
          <NotificationItem
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

export default memo(NotificationList);

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
    margin: -8, 
    padding: 0,
  },
  message: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 12,
    marginLeft: 56, 
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 56, 
  },
  priorityChip: {
    height: 22,
    justifyContent: 'center',
    paddingHorizontal: 0,
    borderWidth: 0,
    borderRadius: 6,
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