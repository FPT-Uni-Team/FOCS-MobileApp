import { call, put, takeEvery, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { productionOrderService } from '../../../services/productionOrderService';
import {
  fetchProductionOrderListStart,
  fetchProductionOrderListSuccess,
  fetchProductionOrderListFailure,
} from '../../slices/production/productionOrderSlice';
import type { ProductionOrderListParams } from '../../../type/production/production';
import type { RootState } from '../../store';

function* fetchProductionOrderListSaga(action: PayloadAction<ProductionOrderListParams>): Generator<any, void, any> {
  try {
    const state: RootState = yield select();
    const { storeId: stateStoreId } = state.productionOrder;
    
    const storeId = action.payload.storeId || stateStoreId;
    
    const params = {
      page: action.payload.page || 1,
      page_size: action.payload.page_size || 10,
      ...action.payload,
    };

    if (!storeId) {
      yield put(fetchProductionOrderListFailure('StoreId is required'));
      return;
    }
    const response = yield call(productionOrderService.getKitchenOrders, params, storeId);
    yield put(fetchProductionOrderListSuccess(response));
  } catch (error: any) {
    yield put(fetchProductionOrderListFailure(error.message));
  }
}

export function* productionOrderSaga() {
  yield takeEvery(fetchProductionOrderListStart.type, fetchProductionOrderListSaga);
}
