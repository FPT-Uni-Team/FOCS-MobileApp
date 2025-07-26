export interface OrderDetail {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderDTO {
  id: string;
  order_code: string;
  user_id: string;
  order_status: OrderStatus;
  order_type: OrderType;
  payment_status: PaymentStatus;
  sub_total_amount: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  customer_note?: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  order_details: OrderDetail[];
}

export type OrderStatus = 0 | 1 | 2 | 3 | 4 | 5; 
export type OrderType = 0 | 1; 
export type PaymentStatus = 0 | 1 | 2; 

export interface OrderListParams {
  page: number;
  page_size: number;
}

export interface OrderListResponse {
  total_count: number;
  page_index: number;
  page_size: number;
  items: OrderDTO[];
}

export interface OrderListState {
  items: OrderDTO[];
  total: number;
  loading: boolean;
  error: string | null;
  params: OrderListParams;
}

// Helper functions
export const getOrderStatusText = (status: OrderStatus): string => {
  switch (status) {
    case 0: return 'Pending';
    case 1: return 'Confirmed';
    case 2: return 'Preparing';
    case 3: return 'Ready';
    case 4: return 'Completed';
    case 5: return 'Cancelled';
    default: return 'Unknown';
  }
};

export const getOrderTypeText = (type: OrderType): string => {
  switch (type) {
    case 0: return 'Dine-in';
    case 1: return 'Take-away';
    default: return 'Unknown';
  }
};

export const getPaymentStatusText = (status: PaymentStatus): string => {
  switch (status) {
    case 0: return 'Pending';
    case 1: return 'Paid';
    case 2: return 'Failed';
    default: return 'Unknown';
  }
};

export const getOrderStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case 0: return '#FF9800'; 
    case 1: return '#2196F3'; 
    case 2: return '#9C27B0'; 
    case 3: return '#4CAF50'; 
    case 4: return '#4CAF50'; 
    case 5: return '#F44336'; 
    default: return '#8E8E93';
  }
}; 