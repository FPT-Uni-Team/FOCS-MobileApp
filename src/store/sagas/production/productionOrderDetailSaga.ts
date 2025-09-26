import { call, put, takeLatest, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchProductionOrderDetailStart,
  fetchProductionOrderDetailSuccess,
  fetchProductionOrderDetailFailed,
} from '../../slices/production/productionOrderDetailSlice';
import { productionOrderService } from '../../../services/productionOrderService';
import type { ProductionOrder, KitchenOrderDetailItem } from '../../../type/production/production';
import type { RootState } from '../../store';

function* fetchProductionOrderDetailSaga(action: PayloadAction<string>) {
  try {
    const productionOrderCode = action.payload;
    const state: RootState = yield select();
    const { storeId } = state.productionOrder;
    
    if (!storeId) {
      yield put(fetchProductionOrderDetailFailed('StoreId is required'));
      return;
    }
    
    const order: ProductionOrder = {
      code: productionOrderCode,
      status: 0,
      orders: [],
    };
    const detailItems: KitchenOrderDetailItem[] = yield call(
      productionOrderService.getKitchenOrderDetail,
      productionOrderCode,
      storeId
    );
    yield put(fetchProductionOrderDetailSuccess({ order, items: detailItems }));
  } catch (error: any) {
    yield put(fetchProductionOrderDetailFailed(error?.message || 'Failed to fetch production order detail'));
  }
}

export function* productionOrderDetailSaga() {
  yield takeLatest(fetchProductionOrderDetailStart.type, fetchProductionOrderDetailSaga);
}
