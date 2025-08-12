export interface ProductionOrderItem {
  code: string;
  amount: number;
}

export interface ProductionOrder {
  code: string;
  status: ProductionOrderStatus;
  orders: ProductionOrderItem[];
}

export interface ProductionOrderListResponse {
  total_count: number;
  page_index: number;
  page_size: number;
  items: ProductionOrder[];
}

export type ProductionOrderStatus = 0 | 1 | 2 | 3;

export const getProductionOrderStatusText = (status: ProductionOrderStatus): string => {
  switch (status) {
    case 0:
      return 'Pending';
    case 1:
      return 'In Progress';
    case 2:
      return 'Completed';
    case 3:
      return 'Cancelled';
    default:
      return 'Unknown';
  }
};

export const getProductionOrderStatusColor = (status: ProductionOrderStatus): string => {
  switch (status) {
    case 0:
      return '#FFA726'; 
    case 1:
      return '#42A5F5'; 
    case 2:
      return '#66BB6A'; 
    case 3:
      return '#EF5350';
    default:
      return '#9E9E9E';
  }
};

export interface ProductionOrderListState {
  items: ProductionOrder[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  page_size: number;
  storeId: string | null;
}

export interface ProductionOrderListParams {
  page?: number;
  page_size?: number;
  search_by?: string;
  search_value?: string;
  sort_by?: string;
  sort_order?: string;
  storeId?: string;
  filters?: {
    additionalProp1?: string;
    additionalProp2?: string;
    additionalProp3?: string;
  };
}
