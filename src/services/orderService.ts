import axiosClient from '../api/axiosClient';
import endpoints from '../api/endpoint';
import type { OrderListParams, OrderListResponse, OrderDTO, ChangeOrderStatusRequest } from '../type/order/order';

export const fetchOrderList = async (params: OrderListParams): Promise<{ data: OrderListResponse }> => {
  const headers = {
    'actorId': '1',
  };
  
  const response = await axiosClient.post(endpoints.order.list(), params, { headers });
  return response;
};

export const fetchOrderDetail = async (orderCode: string): Promise<{ data: OrderDTO }> => {
  const response = await axiosClient.get(endpoints.order.detail(orderCode));
  return response;
};

export const changeOrderPaymentStatus = async (
  orderCode: string, 
  request: ChangeOrderStatusRequest
): Promise<{ data: any }> => {
  const response = await axiosClient.patch(endpoints.order.changeStatus(orderCode), request);
  return response;
};

// Helper function to mark order as paid
export const markOrderAsPaid = async (orderCode: string): Promise<{ data: any }> => {
  return changeOrderPaymentStatus(orderCode, { status: 1 }); // 1 = Paid
}; 