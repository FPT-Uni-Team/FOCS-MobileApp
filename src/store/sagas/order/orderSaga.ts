import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AxiosResponse } from 'axios';
import { 
  fetchOrderListStart, 
  fetchOrderListSuccess, 
  fetchOrderListFailure 
} from '../../slices/order/orderSlice';
import {
  fetchOrderDetailStart,
  fetchOrderDetailSuccess,
  fetchOrderDetailFailed,
} from '../../slices/order/orderDetailSlice';
import type { OrderListParams, OrderListResponse, OrderDTO } from '../../../type/order/order';
import { fetchOrderList, fetchOrderDetail } from '../../../services/orderService';

function* fetchOrderListSaga(
  action: PayloadAction<OrderListParams>,
): Generator<any, void, AxiosResponse<OrderListResponse>> {
  try {
    const response = yield call(fetchOrderList, action.payload);
    yield put(fetchOrderListSuccess({
      items: response.data.items,
      total: response.data.total_count,
    }));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch orders';
    yield put(fetchOrderListFailure(errorMessage));
  }
}

function* fetchOrderDetailSaga(
  action: PayloadAction<string>,
): Generator<any, void, AxiosResponse<OrderDTO>> {
  try {
    const response = yield call(fetchOrderDetail, action.payload);
    yield put(fetchOrderDetailSuccess(response.data));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch order detail';
    yield put(fetchOrderDetailFailed(errorMessage));
  }
}

export default function* orderSaga() {
  yield takeLatest(fetchOrderListStart.type, fetchOrderListSaga);
  yield takeLatest(fetchOrderDetailStart.type, fetchOrderDetailSaga);
} 