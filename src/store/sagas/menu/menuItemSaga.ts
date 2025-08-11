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
    
   
    const itemsWithImages: MenuListDataType[] = [];
    for (let i = 0; i < dataMapped.length; i++) {
      const item = dataMapped[i];
      
      if (i < 20) { // Only fetch images for first 20 items to improve performance
        try {
          const imageResponse = yield call(menuItemService.menuItemImage, item.menuId);
          const imageData = imageResponse.data || [];
          const firstImageUrl = Array.isArray(imageData) && imageData.length > 0
            ? (typeof imageData[0] === 'string' ? imageData[0] : imageData[0]?.url || imageData[0]?.image_url || '')
            : '';
          
          itemsWithImages.push({
            ...item,
            menuImageUrl: firstImageUrl || 'https://via.placeholder.com/120x120?text=Food',
          });
        } catch (error) {
          itemsWithImages.push({
            ...item,
            menuImageUrl: 'https://via.placeholder.com/120x120?text=Food',
          });
        }
      } else {
        // Use placeholder for remaining items to improve performance
        itemsWithImages.push({
          ...item,
          menuImageUrl: 'https://via.placeholder.com/120x120?text=Food',
        });
      }
    }
    
    const total = response.data.total_count;
    yield put(fetchMenuItemsSuccess({ items: itemsWithImages, total }));
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
    const imageData = responseImage.data || [];
    menuItemDetailData.images = Array.isArray(imageData) 
      ? imageData.map((img: any) => typeof img === 'string' ? img : img?.url || img?.image_url || '')
      : [];

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