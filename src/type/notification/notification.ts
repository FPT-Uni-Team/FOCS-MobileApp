export interface StaffNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  
  type:
    | 'NEW_ORDER'
    | 'CUSTOMER_REQUEST'
    | 'TABLE_STATUS'
    | 'KITCHEN_READY'
    | 'PAYMENT'
    | 'SYSTEM';

  
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';

  
  tableNumber?: number;
}

export interface NotificationState {
  notifications: StaffNotification[];
  unreadCount: number;
  isConnected: boolean;
  connectionState: 'connecting' | 'connected' | 'disconnected' | 'error';
  error: string | null;
}

export interface NotificationConnectionPayload {
  staffId: string;
  storeId: string;
} 