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
import {
  fetchMenuItemDetailStart,
  fetchMenuItemDetailSuccess,
  fetchMenuItemDetailFailed,
} from '../../slices/menuItem/menuItemDetailSlice';
import { changeStatusMenuItemStart } from '../../actions/menuItemAction';
import type { MenuItem } from '../../../type/menu/menu';
import type { VariantGroup } from '../../../type/variant/variant';
import type { CategoryListDataType } from '../../../type/category/category';

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

function* fetchMenuItemDetail(
  action: PayloadAction<string>,
): Generator<any, void, AxiosResponse<any>> {
  try {
    const response = yield call(menuItemService.menuItemDetail, action.payload);
    const menuItemDetailData = response.data as MenuItem;

    const responseImage = yield call(menuItemService.menuItemImage, action.payload);
    menuItemDetailData.images = responseImage.data as [];

    const responseVariantGroups = yield call(menuItemService.menuItemGroups, action.payload);
    menuItemDetailData.variant_groups = responseVariantGroups.data as VariantGroup[];

    const responseCategory = yield call(menuItemService.menuItemCategory, action.payload);
    menuItemDetailData.categories = responseCategory.data as CategoryListDataType[];

    yield put(fetchMenuItemDetailSuccess(menuItemDetailData));
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch menu item detail';
    yield put(fetchMenuItemDetailFailed(errorMessage));
  }
}

function* changeStatusWorker(
  action: ReturnType<typeof changeStatusMenuItemStart>,
): Generator<any, void, any> {
  const { category, menuItemId } = action.payload;
  const status = category === 'deactive' ? 'disable' : 'enable';

  try {
    yield call(menuItemService.changeStatus, status, menuItemId);
    yield put(fetchMenuItemDetailStart(menuItemId));
  } catch (error) {
    yield put(fetchMenuItemDetailFailed('Failed to change status'));
  }
}

export default function* menuItemSaga() {
  yield takeLatest(fetchMenuItemsStart.type, fetchMenuItemList);
  yield takeLatest(fetchMenuItemDetailStart.type, fetchMenuItemDetail);
  yield takeLatest(changeStatusMenuItemStart.type, changeStatusWorker);
} 