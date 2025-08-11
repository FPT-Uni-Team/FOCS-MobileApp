import type { ListPageParams } from '../common/common';

export type TableStatus =
  | 'Available'
  | 'Occupied'
  | 'Reserved'
  | 'Cleaning'
  | 'OutOfService';

export interface TableDTO {
  tableId: string;
  tableNumber: string;
  status: TableStatus;
  capacity: number;
  note?: string;
  createdAt: string;
}

export interface TableFilters {
  status?: TableStatus;
  [key: string]: string | undefined;
}

export interface TableListParams extends ListPageParams {
  storeId: string;
  filters?: TableFilters;
}

export interface TableListState extends ListPageParams {
  items: TableDTO[];
  total: number;
  loading: boolean;
  error: string | null;
  filters: TableFilters;
  storeId: string;
}

export interface ChangeTableStatusRequest {
  tableId: string;
  storeId: string;
  status: number; // API expects numbers 0-4 for enum values
}

export interface ChangeTableStatusParams {
  tableId: string;
  storeId: string;
  status: TableStatus; // Frontend uses string values
} 