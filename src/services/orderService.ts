import axiosClient from '../api/axiosClient';
import endpoints from '../api/endpoint';
import type { OrderListParams, OrderListResponse, OrderDTO } from '../type/order/order';

export const fetchOrderList = async (params: OrderListParams): Promise<{ data: OrderListResponse }> => {
  const response = await axiosClient.post(endpoints.order.list(), params);
  return response;
};

export const fetchOrderDetail = async (orderCode: string): Promise<{ data: OrderDTO }> => {
  const response = await axiosClient.get(endpoints.order.detail(orderCode));
  return response;
}; 