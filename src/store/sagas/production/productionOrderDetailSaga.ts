import { call, put, takeLatest, select, all } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchProductionOrderDetailStart,
  fetchProductionOrderDetailSuccess,
  fetchProductionOrderDetailFailed,
  changeProductionOrderStatusStart,
  changeProductionOrderStatusByCodeStart,
  changeProductionOrderStatusSuccess,
  changeProductionOrderStatusFailed,
} from '../../slices/production/productionOrderDetailSlice';
import { productionOrderService } from '../../../services/productionOrderService';
import type { ProductionOrder, KitchenOrderDetailItem } from '../../../type/production/production';
import type { RootState } from '../../store';
import { updateProductionOrderStatus } from '../../slices/production/productionOrderSlice';

function* fetchProductionOrderDetailSaga(action: PayloadAction<string>) {
  try {
    const productionOrderCode = action.payload;
    const state: RootState = yield select();
    const { storeId } = state.productionOrder;
    
    if (!storeId) {
      yield put(fetchProductionOrderDetailFailed('StoreId is required'));
      return;
    }
    
    const listItem: ProductionOrder | undefined = state.productionOrder.items.find(
      (it: ProductionOrder) => it.code === productionOrderCode
    );

    const order: ProductionOrder = {
      code: productionOrderCode,
      status: (listItem?.status ?? 0) as any,
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

function* changeProductionOrderStatusSaga(action: PayloadAction<{ orderWrapIds: string[]; status: number }>) {
  try {
    const storeId: string | null = yield select((state: RootState) => state.productionOrder.storeId);
    const { orderWrapIds, status } = action.payload;

    try {
      yield call(productionOrderService.changeStatusBatch, orderWrapIds, status, storeId || undefined);
    } catch (_err) {
      yield all(
        orderWrapIds.map(orderWrapId =>
          call(productionOrderService.changeStatus, orderWrapId, status, storeId || undefined)
        )
      );
    }

    yield put(changeProductionOrderStatusSuccess(status));
    const orderCode: string = yield select((state: RootState) => state.productionOrderDetail.productionOrder.code);
    if (orderCode) {
      yield put(updateProductionOrderStatus({ code: orderCode, status } as any));
    }
  } catch (error: any) {
    const errorMessage = error?.message || 'Failed to change production order status';
    yield put(changeProductionOrderStatusFailed(errorMessage));
  }
}

function* changeProductionOrderStatusByCodeSaga(action: PayloadAction<{ orderCode: string; status: number }>) {
  try {
    const storeId: string | null = yield select((state: RootState) => state.productionOrder.storeId);
    const { orderCode, status } = action.payload;

    const detailItems: KitchenOrderDetailItem[] = yield call(
      productionOrderService.getKitchenOrderDetail,
      orderCode,
      storeId || undefined
    );
    const orderWrapIds = (detailItems || []).map((it) => it.order_wrap_id).filter(Boolean);
    if (orderWrapIds.length === 0) {
      throw new Error('No order_wrap_ids found for the order');
    }

    try {
      yield call(productionOrderService.changeStatusBatch, orderWrapIds, status, storeId || undefined);
    } catch (_err) {
      yield all(
        orderWrapIds.map((orderWrapId) =>
          call(productionOrderService.changeStatus, orderWrapId, status, storeId || undefined)
        )
      );
    }

    yield put(changeProductionOrderStatusSuccess(status));
    yield put(updateProductionOrderStatus({ code: orderCode, status } as any));
  } catch (error: any) {
    const errorMessage = error?.message || 'Failed to change production order status';
    yield put(changeProductionOrderStatusFailed(errorMessage));
  }
}

export function* productionOrderDetailSaga() {
  yield takeLatest(fetchProductionOrderDetailStart.type, fetchProductionOrderDetailSaga);
  yield takeLatest(changeProductionOrderStatusStart.type, changeProductionOrderStatusSaga);
  yield takeLatest(changeProductionOrderStatusByCodeStart.type, changeProductionOrderStatusByCodeSaga);
}
