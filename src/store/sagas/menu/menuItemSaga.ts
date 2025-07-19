import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AxiosResponse } from 'axios';
import menuItemService from '../../../services/menuItemService';
import { objectMapper } from '../../../utils/objectMapper';
import { fieldMap } from '../../../utils/objectMapper/menuItem';
import {
  fetchMenuItemsFailure,
  fetchMenuItemsStart,
  fetchMenuItemsSuccess,
} from '../../slices/menuItem/menuItemSlice';
import type {
  ListPageParams,
  ListPageResponse,
} from '../../../type/common/common';
import type { MenuListDataType } from '../../../type/menu/menu';

function* fetchMenuItemList(
  action: PayloadAction<ListPageParams>,
): Generator<any, void, AxiosResponse<ListPageResponse>> {
  try {
    const response = yield call(menuItemService.getListMenuItems, action.payload);
    const dataMapped = objectMapper(response.data.items, fieldMap) as MenuListDataType[];
    const total = response.data.total_count;
    yield put(fetchMenuItemsSuccess({ items: dataMapped, total }));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch menu items';
    yield put(fetchMenuItemsFailure(errorMessage));
  }
}

export default function* menuItemSaga() {
  yield takeLatest(fetchMenuItemsStart.type, fetchMenuItemList);
} 