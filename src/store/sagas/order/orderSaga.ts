import { call, put, takeLatest, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
} from '../../slices/order/orderSlice';
import { fetchOrderList } from '../../../services/orderService';
import type { RootState } from '../../store';
import type { OrderListParams, OrderDTO } from '../../../type/order/order';

function* handleFetchOrders(action: PayloadAction<Partial<OrderListParams> | undefined>): Generator<any, void, any> {
  try {
    const currentParams: OrderListParams = yield select((state: RootState) => state.order.params);
    const params: any = {
      page: action.payload?.page ?? currentParams.page,
      page_size: action.payload?.page_size ?? currentParams.page_size,
      search_by: '',
      search_value: '',
      sort_by: '',
      sort_order: '',
      filters: {},
    };
    const { data } = yield call(fetchOrderList, params);
    const mappedOrders: OrderDTO[] = data.items.map((item: any) => ({
      id: item.id,
      order_code: item.order_code,
      user_id: item.user_id,
      order_status: item.order_status,
      order_type: item.order_type,
      payment_status: item.payment_status,
      sub_total_amount: item.sub_total_amount,
      tax_amount: item.tax_amount,
      discount_amount: item.discount_amount,
      total_amount: item.total_amount,
      customer_note: item.customer_note,
      created_at: item.created_at,
      created_by: item.created_by,
      updated_at: item.updated_at,
      updated_by: item.updated_by,
      order_details: item.order_details || [],
    }));
    yield put(
      fetchOrdersSuccess({
        items: mappedOrders,
        total: data.total_count || data.total || 0,
      })
    );
  } catch (error: any) {
    yield put(
      fetchOrdersFailure(
        error?.response?.data?.message || error.message || 'Failed to fetch orders'
      )
    );
  }
}

export function* orderSaga() {
  yield takeLatest(fetchOrdersStart.type, handleFetchOrders);
}

export default orderSaga; 