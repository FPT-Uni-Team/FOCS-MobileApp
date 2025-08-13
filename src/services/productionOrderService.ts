import axiosClient from '../api/axiosClient';
import type { ProductionOrderListResponse, ProductionOrderListParams } from '../type/production/production';

export const productionOrderService = {
  getKitchenOrders: async (params: ProductionOrderListParams, storeId?: string): Promise<ProductionOrderListResponse> => {
    const headers = storeId ? { storeId } : {};
    const response = await axiosClient.post('/api/KitchenOrder', params, { headers });
    return response.data;
  },
};
