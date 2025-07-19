import type { MenuListDataType } from '../../../type/menu/menu';
import { createListSlice } from '../createListSlice';

const menuItemSlice = createListSlice<MenuListDataType>('menuItem');


export const {
  fetchStart: fetchMenuItemsStart,
  fetchSuccess: fetchMenuItemsSuccess,
  fetchFailure: fetchMenuItemsFailure,
  reset: resetMenuItemList,
} = menuItemSlice.actions;

export default menuItemSlice.reducer; 