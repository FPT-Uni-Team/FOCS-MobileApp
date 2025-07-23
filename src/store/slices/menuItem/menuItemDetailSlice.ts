import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MenuItem } from '../../../type/menu/menu';

interface MenuItemDetailState {
  loading: boolean;
  success: boolean;
  error: string | null;
  menuItem: MenuItem;
  refreshing: boolean;
}

const initialState: MenuItemDetailState = {
  loading: false,
  success: false,
  error: null,
  menuItem: {} as MenuItem,
  refreshing: false,
};

const menuItemDetailSlice = createSlice({
  name: 'menuItemDetail',
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetchMenuItemDetailStart: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    },
    fetchMenuItemDetailSuccess: (state, action: PayloadAction<MenuItem>) => {
      state.loading = false;
      state.success = true;
      state.menuItem = action.payload;
      state.refreshing = false;
    },
    fetchMenuItemDetailFailed: (state, action: PayloadAction<string | undefined>) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload || 'Failed to fetch menu item detail';
      state.refreshing = false;
    },
    resetMenuItemDetail: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.menuItem = {};
      state.refreshing = false;
    },
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.refreshing = action.payload;
    },
  },
});

export const {
  fetchMenuItemDetailStart,
  fetchMenuItemDetailSuccess,
  fetchMenuItemDetailFailed,
  resetMenuItemDetail,
  setRefreshing,
} = menuItemDetailSlice.actions;

export default menuItemDetailSlice.reducer; 