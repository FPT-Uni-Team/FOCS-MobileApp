import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import type { RootState } from '../store/store';
import { 
  markAsRead, 
  markAllAsRead, 
  removeNotification, 
  clearNotifications,
  disconnect,
  connectRequest
} from '../store/slices/notification/notificationSlice';

const useNotifications = () => {
  const dispatch = useDispatch();
  
  const notifications = useSelector((state: RootState) => state.notification.notifications);
  const unreadCount = useSelector((state: RootState) => state.notification.unreadCount);
  const isConnected = useSelector((state: RootState) => state.notification.isConnected);
  const connectionState = useSelector((state: RootState) => state.notification.connectionState);
  const error = useSelector((state: RootState) => state.notification.error);

  const markNotificationAsRead = useCallback((id: string) => {
    dispatch(markAsRead(id));
  }, [dispatch]);

  const markAllNotificationsAsRead = useCallback(() => {
    dispatch(markAllAsRead());
  }, [dispatch]);

  const removeNotificationById = useCallback((id: string) => {
    dispatch(removeNotification(id));
  }, [dispatch]);

  const clearAllNotifications = useCallback(() => {
    dispatch(clearNotifications());
  }, [dispatch]);

  const disconnectNotifications = useCallback(() => {
    dispatch(disconnect());
  }, [dispatch]);

  const reconnectNotifications = useCallback(() => {
    dispatch(connectRequest());
  }, [dispatch]);

  return {
    notifications,
    unreadCount,
    isConnected,
    connectionState,
    error,
    
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotificationById,
    clearAllNotifications,
    disconnectNotifications,
    reconnectNotifications,
  };
};

export default useNotifications; 