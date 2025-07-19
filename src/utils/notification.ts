import type { StaffNotification } from '../type/notification/notification';

export const formatTime = (timestamp: string): string => {
  return new Date(timestamp).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getTypeIcon = (type: StaffNotification['type']): string => {
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

export const getTypeStyle = (type: StaffNotification['type']) => {
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
      return {
        container: { backgroundColor: '#E5E7EB' },
        iconColor: '#4B5563',
      };
  }
};

export const getPriorityStyle = (priority: StaffNotification['priority']) => {
  switch (priority) {
    case 'URGENT':
      return { chip: { backgroundColor: '#EF4444' }, text: { color: 'white' } };
    case 'HIGH':
      return { chip: { backgroundColor: '#F97316' }, text: { color: 'white' } };
    case 'MEDIUM':
      return {
        chip: { backgroundColor: '#FBBF24' },
        text: { color: '#422006' },
      };
    case 'LOW':
      return {
        chip: { backgroundColor: '#6B7280' },
        text: { color: 'white' },
      };
    default:
      return { chip: {}, text: {} };
  }
}; 