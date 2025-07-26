import axiosClient from '../api/axiosClient';
import endpoints from '../api/endpoint';
import type { OrderListParams, OrderListResponse } from '../type/order/order';

export const fetchOrderList = async (params: OrderListParams): Promise<{ data: OrderListResponse }> => {
  const response = await axiosClient.post(endpoints.order.list(), params);
  return response;
}; 