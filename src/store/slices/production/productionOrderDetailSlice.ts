import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ProductionOrder, KitchenOrderDetailItem } from '../../../type/production/production';

interface ProductionOrderDetailState {
  loading: boolean;
  success: boolean;
  error: string | null;
  productionOrder: ProductionOrder;
  items: KitchenOrderDetailItem[];
  refreshing: boolean;
}

const initialState: ProductionOrderDetailState = {
  loading: false,
  success: false,
  error: null,
  productionOrder: {} as ProductionOrder,
  items: [],
  refreshing: false,
};

const productionOrderDetailSlice = createSlice({
  name: 'productionOrderDetail',
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetchProductionOrderDetailStart: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    },
    fetchProductionOrderDetailSuccess: (state, action: PayloadAction<{ order: ProductionOrder; items: KitchenOrderDetailItem[] }>) => {
      state.loading = false;
      state.success = true;
      state.productionOrder = action.payload.order;
      state.items = action.payload.items || [];
      state.refreshing = false;
    },
    fetchProductionOrderDetailFailed: (state, action: PayloadAction<string | undefined>) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload || 'Failed to fetch production order detail';
      state.refreshing = false;
    },
    resetProductionOrderDetail: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.productionOrder = {} as ProductionOrder;
      state.items = [];
      state.refreshing = false;
    },
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.refreshing = action.payload;
    },
  },
});

export const {
  fetchProductionOrderDetailStart,
  fetchProductionOrderDetailSuccess,
  fetchProductionOrderDetailFailed,
  resetProductionOrderDetail,
  setRefreshing,
} = productionOrderDetailSlice.actions;

export default productionOrderDetailSlice.reducer;
