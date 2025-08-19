import axiosClient from '../api/axiosClient';
import type { ProductionOrderListResponse, ProductionOrderListParams, KitchenOrderDetailItem } from '../type/production/production';
import endpoints from '../api/endpoint';

export const productionOrderService = {
  getKitchenOrders: async (params: ProductionOrderListParams, storeId?: string): Promise<ProductionOrderListResponse> => {
    const headers = storeId ? { storeId } : {};
    const response = await axiosClient.post(endpoints.production.kitchenOrders(), params, { headers });
    return response.data;
  },
  
  getKitchenOrderDetail: async (code: string, storeId?: string): Promise<KitchenOrderDetailItem[]> => {
    const headers = storeId ? { storeId } : {};
    const response = await axiosClient.get(endpoints.production.kitchenOrderDetail(code), { headers });
    return response.data;
  },
};
