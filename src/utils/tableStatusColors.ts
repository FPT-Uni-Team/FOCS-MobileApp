import type { TableStatus } from '../type/table/table';

export const TABLE_STATUS_COLORS: Record<TableStatus, string> = {
  Available: '#4CAF50',
  Occupied: '#F44336',
  Reserved: '#FF9800',
  Cleaning: '#2196F3',
  OutOfService: '#9E9E9E',
};

export const TABLE_STATUS_LABELS: Record<TableStatus, string> = {
  Available: 'Có sẵn',
  Occupied: 'Đang sử dụng',
  Reserved: 'Đã đặt trước', 
  Cleaning: 'Đang dọn dẹp',
  OutOfService: 'Không hoạt động',
};

export const TABLE_STATUS_API_MAPPING: Record<TableStatus, number> = {
  Available: 0,
  Occupied: 1,
  Reserved: 2,
  Cleaning: 3,
  OutOfService: 4,
};

export const API_TO_TABLE_STATUS: Record<number, TableStatus> = {
  0: 'Available',
  1: 'Occupied', 
  2: 'Reserved',
  3: 'Cleaning',
  4: 'OutOfService',
}; 