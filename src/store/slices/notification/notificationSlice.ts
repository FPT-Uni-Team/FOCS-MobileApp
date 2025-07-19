import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StaffNotification, NotificationState } from '../../../type/notification/notification';

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isConnected: false,
  connectionState: 'disconnected',
  error: null,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<StaffNotification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    setNotifications: (state, action: PayloadAction<StaffNotification[]>) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.isRead).length;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount -= 1;
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => {
        n.isRead = true;
      });
      state.unreadCount = 0;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },

    connectRequest: (state) => {
      state.connectionState = 'connecting';
    },
    connectSuccess: (state) => {
      state.isConnected = true;
      state.connectionState = 'connected';
    },
    connectFailure: (state, action: PayloadAction<string>) => {
      state.isConnected = false;
      state.connectionState = 'error';
      state.error = action.payload;
    },
    disconnect: (state) => {
      state.isConnected = false;
      state.connectionState = 'disconnected';
    },
  },
});

export const {
  addNotification,
  setNotifications,
  markAsRead,
  removeNotification,
  markAllAsRead,
  clearNotifications,
  connectRequest,
  connectSuccess,
  connectFailure,
  disconnect,
} = notificationSlice.actions;

export default notificationSlice.reducer; 